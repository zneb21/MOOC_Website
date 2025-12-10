# app.py

import os
import uuid  # For generating unique reset tokens
import datetime # For setting token expiration time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, render_template, request, jsonify
import mysql.connector
import requests
from flask_cors import CORS
import bcrypt # For secure password hashing and checking

# Gemini SDK (safe import)
try:
    from google import genai
except:
    genai = None

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# --------------------------
# Database configuration
# --------------------------
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "my_app_db",
    "port": 3306,
}

# --------------------------
# Gemini configuration (MUST BE UPDATED)
# --------------------------
# 🛑 CRITICAL: REPLACE THIS ENTIRE STRING with your BRAND NEW, VALID GEMINI API KEY.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.5-flash"
USE_SDK = True  # switch to False to use REST

# --------------------------
# Email Configuration (for forgot-password route)
# --------------------------
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SENDER_EMAIL = os.environ.get("MAIL_USERNAME", "glass418cloudy@gmail.com")
# IMPORTANT: This must be a 16-character Google App Password if using Gmail
_raw_password = os.environ.get("MAIL_PASSWORD", "") 
SENDER_PASSWORD = _raw_password.replace(" ", "") 
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:8080")


# --------------------------
# DB helper functions
# --------------------------
def get_db():
    """Establishes a connection to the MySQL database."""
    return mysql.connector.connect(**DB_CONFIG)

def save_message(user_id, role, message):
    """Saves a chat message."""
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO chat_history (user_id, role, message) VALUES (%s, %s, %s)",
            (user_id, role, message)
        )
        db.commit()
    except mysql.connector.Error as err:
        print(f"ERROR saving message: {err.msg}")
    finally:
        cursor.close()
        db.close()

def load_chat_summary(user_id):
    """Retrieves history for the specific user_id to provide context to the AI."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT role, message FROM chat_history WHERE user_id=%s ORDER BY id DESC LIMIT 10",
        (user_id,)
    )
    rows = cursor.fetchall()
    cursor.close()
    db.close()

    if not rows:
        return "No previous conversation."

    summary = []
    for role, msg in reversed(rows):
        short = msg[:120].replace("\n", " ")
        summary.append(f"{role}: {short}")

    return "\n".join(summary)


def get_chat_history(user_id):
    """
    Retrieves the full chat history for a user, structured for API response.
    """
    db = get_db()
    cursor = db.cursor(dictionary=True) 
    
    cursor.execute(
        "SELECT id, role, message, created_at FROM chat_history WHERE user_id=%s ORDER BY id ASC",
        (user_id,)
    )
    history = cursor.fetchall()
    cursor.close()
    db.close()
    
    for item in history:
        if 'created_at' in item and hasattr(item['created_at'], 'isoformat'):
            item['created_at'] = item['created_at'].isoformat()
        
    return history


# --------------------------
# Gemini handler functions (PRESERVED)
# --------------------------
def parse_gemini_response(resp):
    """Safely extract the best output text from different possible Gemini SDK/REST formats."""
    if hasattr(resp, "text") and resp.text: return resp.text
    return str(resp)


def call_gemini_sdk(prompt):
    """Tries the Gemini SDK, falls back to REST call on failure."""
    if genai is None:
        return "SDK not installed. Falling back to REST call..." + call_gemini_rest(prompt)

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        resp = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        return parse_gemini_response(resp)
    except Exception as e:
        print(f"ERROR: Gemini SDK call failed. Falling back to REST call. Error: {e}")
        return call_gemini_rest(prompt)


def call_gemini_rest(prompt):
    """Calls Gemini API using REST for maximum compatibility and debugging."""
    url = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateText"
    body = {"prompt": {"text": prompt}, "temperature": 0.4, "maxOutputTokens": 800}

    try:
        resp = requests.post(url + f"?key={GEMINI_API_KEY}", json=body, timeout=30)
        
        if resp.status_code != 200:
            data = resp.json()
            error_message = data.get('error', {}).get('message', 'No message provided.')
            
            print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(f"!!! GEMINI API ERROR: HTTP Status Code {resp.status_code} !!!")
            print(f"!!! Message: {error_message} !!!")
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

            return "Error: unable to reach AI server."
            
        # Success parsing logic (retained)
        data = resp.json()
        if "candidates" in data:
            if 'content' in data["candidates"][0]:
                content = data["candidates"][0]['content']
                if 'parts' in content and content['parts']:
                    return content['parts'][0].get('text', str(content))
            return data["candidates"][0].get("output", str(data))
            
        return str(data)
        
    except requests.exceptions.RequestException as e:
        print(f"\nFATAL NETWORK ERROR REACHING GEMINI: {e}\n")
        return "Network Error: Could not connect to the Gemini server endpoint."


# --------------------------
# Email handler functions (FIXED FOR RELIABILITY)
# --------------------------
def _create_reset_password_html_body(reset_link):
    # (HTML template generation is retained)
    START_COLOR = "#1D4ED8"  
    END_COLOR = "#0D9488"    
    ACCENT_COLOR = "#0D9488" 
    BG_COLOR = "#f7f7f7"
    CARD_BG = "#ffffff"
    TEXT_COLOR = "#333333"

    GRADIENT_STYLE = f"""
        background-color: {START_COLOR}; 
        background-image: linear-gradient(to right, {START_COLOR}, {END_COLOR});
        color: white; 
        padding: 24px 20px; 
        text-align: center;
    """

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: {BG_COLOR}; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: {CARD_BG}; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
            
            <div style="{GRADIENT_STYLE}">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">
                    Silay<span style="color: {CARD_BG};">Learn</span>
                </h1>
            </div>

            <div style="padding: 30px 40px; color: {TEXT_COLOR};">
                <h2 style="font-size: 20px; color: #1f2937; margin-top: 0; margin-bottom: 20px;">
                    Reset Your Password
                </h2>
                <p style="margin-bottom: 25px; line-height: 1.6;">
                    Click the button below to be taken to a secure page to set a new password.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       target="_blank" 
                       style="display: inline-block; padding: 12px 25px; background-color: {ACCENT_COLOR}; 
                              color: {CARD_BG}; text-decoration: none; border-radius: 8px; 
                              font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(13, 148, 136, 0.3);">
                        Set New Password
                    </a>
                </div>

                <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; color: #6b7280;">
                    If you did not request a password reset, please ignore this email.
                </p>
            </div>

            <div style="background-color: {BG_COLOR}; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
                &copy; {datetime.date.today().year} SilayLearn. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """
    return html


def send_reset_email(user_email):
    # Generates the unique token
    reset_token = str(uuid.uuid4())
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    subject = "Action Required: Reset Your SilayLearn Password"
    html_body = _create_reset_password_html_body(reset_link)
    plain_text_body = f"Hello,\nYou requested a password reset. Please click the link below:\n{reset_link}"
    
    # Send the email and return the token on success
    success, msg = _send_email(user_email, subject, plain_text_body, html_body)
    
    if success:
        return True, reset_token 
    else:
        return False, msg


def _send_email(to_email, subject, plain_text_body, html_body):
    
    if SENDER_PASSWORD == "ohzmfislveuugwto": 
        print("WARNING: Using default/hardcoded password. Ensure this is intentional.")

    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(plain_text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        print(f"DEBUG: Attempting to connect to SMTP server: {SMTP_SERVER}:{SMTP_PORT}")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        
        print(f"DEBUG: Attempting SMTP login as {SENDER_EMAIL}...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        
        print(f"SUCCESS: Email sent to {to_email}")
        return True, "Email sent"
        
    except smtplib.SMTPAuthenticationError:
        print("\nFATAL ERROR: SMTP Authentication Failed.")
        return False, "Authentication Error. Please check your username and App Password."
    except Exception as e:
        print(f"FATAL ERROR: Failed to send email to {to_email}. Generic Exception: {e}")
        return False, str(e)


# --------------------------
# Routes
# --------------------------
@app.route("/")
def index():
    return render_template("lesson.html")

# --- Chat Routes ---

@app.route("/api/chat/history/<int:user_id>", methods=["GET"])
def chat_history_route(user_id):
    try:
        history = get_chat_history(user_id)
        return jsonify(history), 200
    except Exception as e:
        print(f"ERROR fetching chat history for user {user_id}: {e}")
        return jsonify({"message": "Failed to retrieve chat history."}), 500


@app.route("/chat", methods=["POST"])
def chat():
    # Exact AI logic from your previous snippet (Preserved)
    data = request.json
    user_id = data.get("user_id") or data.get("userId") # Handle both keys
    user_msg = data.get("message", "")
    lesson_title = data.get("lesson_title", "MOOC Lesson")
    language = data.get("language", "en")
    
    if not user_id: return jsonify({"reply": "Error: Invalid user_id provided."}), 400
    try: user_id = int(user_id)
    except: return jsonify({"reply": "Error: user_id must be an integer."}), 400

    save_message(user_id, "user", user_msg)
    summary = load_chat_summary(user_id)

    system_prompt = f"""
You are the MOOC Lesson AI Assistant integrated into an educational platform.
Lesson: {lesson_title}

--- Student Conversation Summary (for context, privacy-safe) ---
{summary}

--- Role ---
You help Filipino MOOC students by:
- Answering simply and accurately
- Giving local Ilonggo examples
- Providing Filipino/Hiligaynon translations when asked
- NEVER including sensitive data
- NEVER exposing raw internal chat logs

Formatting rules:
- DO NOT use Markdown.
- DO NOT use bold (** **), italics (* * / _ _), backticks, or code blocks.
- Output PLAIN TEXT ONLY.
User says:
{user_msg}

Preferred language: {language}
"""

    try:
        if USE_SDK:
            reply = call_gemini_sdk(system_prompt)
        else:
            reply = call_gemini_rest(system_prompt)
    except Exception as e:
        reply = f"Error contacting AI service: {str(e)}"

    save_message(user_id, "assistant", reply)
    return jsonify({"reply": reply})

# --- Authentication and User Management Routes ---

@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    """
    Initiates the password reset process: checks user, sends email, and saves token.
    """
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    db = get_db()
    cursor = db.cursor()

    try:
        # 1. Check if user exists and get ID
        cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
        user_record = cursor.fetchone()
        if not user_record:
            # Security measure: return generic success message even if the user doesn't exist
            return jsonify({"message": "If an account exists, a password reset link has been sent."}), 200

        user_id = user_record[0]
        
        # 2. Send the email and get the generated token back
        success, msg_or_token = send_reset_email(email)
        
        if not success:
            # Provide the specific error message from the email function to the client
            return jsonify({"message": "Failed to send email. Check server logs.", "error": msg_or_token}), 500

        reset_token = msg_or_token # This is the UUID token

        # 3. Save the token to the database, expiring in 1 hour
        expires_at = datetime.datetime.now() + datetime.timedelta(hours=1)
        
        # NOTE: Ensure the password_reset_tokens table exists (as defined in your SQL dump)
        cursor.execute(
            "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, reset_token, expires_at)
        )
        db.commit()
        print(f"DEBUG: Saved reset token {reset_token} for user {user_id}")

        return jsonify({"message": "Password reset link sent. Check your inbox."}), 200

    except mysql.connector.Error as err:
        db.rollback()
        print(f"ERROR: Database error during forgot-password process: {err.msg}")
        return jsonify({"message": "Failed to generate reset link due to a server error."}), 500
    finally:
        cursor.close()
        db.close()


@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    """
    Handles the final step of the password reset: verifies token, updates password, deletes token.
    The minimum password length check (>= 6) has been REMOVED as requested.
    """
    data = request.json
    token = data.get("token")
    new_password = data.get("newPassword")
    
    if not all([token, new_password]):
        return jsonify({"message": "Token and new password are required."}), 400
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # 1. Validate the token: Check existence and expiry
        cursor.execute(
            "SELECT user_id FROM password_reset_tokens WHERE token=%s AND expires_at > NOW()",
            (token,)
        )
        token_record = cursor.fetchone()

        if not token_record:
            return jsonify({"message": "Invalid or expired password reset link."}), 401

        user_id = token_record['user_id']
        
        # 2. Hash the new password securely
        hashed_password = bcrypt.hashpw(
            new_password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')

        # 3. Update the user's password in the 'users' table
        db.autocommit = False
        cursor.execute(
            "UPDATE users SET password = %s WHERE id = %s",
            (hashed_password, user_id)
        )

        # 4. Invalidate the token (Crucial for security)
        cursor.execute(
            "DELETE FROM password_reset_tokens WHERE token = %s",
            (token,)
        )
        
        db.commit()
        db.autocommit = True

        return jsonify({"message": "Password updated successfully."}), 200

    except mysql.connector.Error as err:
        db.rollback()
        print(f"ERROR: Database error during password reset: {err.msg}")
        return jsonify({"message": f"Server error: Could not complete reset. ({err.msg})"}), 500
    finally:
        cursor.close()
        db.close()

@app.route("/api/auth/delete", methods=["DELETE"])
def delete_account():
    data = request.json
    user_id = data.get("user_id")
    email = data.get("email")
    password = data.get("password")

    if not all([user_id, email, password]):
        return jsonify({"message": "Missing required fields."}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True) 
    
    try:
        db_id = int(user_id) 

        # 1. Verify credentials
        cursor.execute("SELECT password FROM users WHERE id=%s AND email=%s", (db_id, email))
        user_record = cursor.fetchone()

        if not user_record:
            return jsonify({"message": "User not found or ID/email mismatch."}), 404
        
        # Secure Password Check using bcrypt
        stored_hash = user_record['password']
        
        try:
            hashed_password_bytes = stored_hash.encode('utf-8')
            if not bcrypt.checkpw(password.encode('utf-8'), hashed_password_bytes): 
                return jsonify({"message": "Invalid password confirmation."}), 401
        except Exception as e:
            print(f"ERROR: Bcrypt check failed for ID {db_id}. Hash issue: {e}")
            return jsonify({"message": "Invalid password confirmation (hashing error). Please check server logs."}), 401
            
        # 2. Perform Deletion
        db.autocommit = False 
        cursor.execute("DELETE FROM chat_history WHERE user_id=%s", (db_id,))
        cursor.execute("DELETE FROM users WHERE id=%s", (db_id,))
        db.commit() 
        db.autocommit = True
        
        return jsonify({"message": "Account deleted successfully."}), 200

    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({"message": f"Database error during deletion: {err.msg}"}), 500
    except ValueError:
        return jsonify({"message": "Invalid user ID format."}), 400
    finally:
        cursor.close()
        db.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)