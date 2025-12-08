import os
from flask import Flask, render_template, request, jsonify
import mysql.connector
import requests
from flask_cors import CORS

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
    "database": "mooc_system",
    "port": 3306,
}

# Gemini configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCQRNEb3LcRLExpTLs4NaBuOIBZE_Tx59k")
GEMINI_MODEL = "gemini-2.5-flash"
USE_SDK = True  # switch to False to use REST

# --------------------------
# DB helper functions
# --------------------------
def get_db():
    return mysql.connector.connect(**DB_CONFIG)

def save_message(user_id, role, message):
    """Saves a chat message, now only requiring user_id."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO chat_history (user_id, role, message) VALUES (%s, %s, %s)",
        (user_id, role, message)
    )
    db.commit()
    cursor.close()
    db.close()

def load_chat_summary(user_id):
    """Retrieves history for the specific user_id."""
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
    # Display in chronological order
    for role, msg in reversed(rows):
        short = msg[:120].replace("\n", " ")  # avoid long/sensitive data
        summary.append(f"{role}: {short}")

    return "\n".join(summary)


# --------------------------
# Gemini call with enhanced response extraction
# --------------------------
def parse_gemini_response(resp):
    """Safely extract the best output text from different possible Gemini SDK/REST formats."""
    # SDK (resp.text usually exists)
    # The existing logic is retained for safe parsing
    if hasattr(resp, "text") and resp.text:
        return resp.text

    # Sometimes SDK returns resp.output
    if hasattr(resp, "output") and resp.output:
        collected = []
        for part in resp.output:
            if isinstance(part, dict):
                if "content" in part:
                    for c in part["content"]:
                        if c.get("type") == "output_text":
                            collected.append(c.get("text", ""))
            elif isinstance(part, str):
                collected.append(part)
        return "\n".join(collected).strip()

    return str(resp)


def call_gemini_sdk(prompt):
    if genai is None:
        raise RuntimeError("google-genai SDK not installed")

    client = genai.Client(api_key=GEMINI_API_KEY)
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    return parse_gemini_response(resp)


def call_gemini_rest(prompt):
    url = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateText"
    body = {"prompt": {"text": prompt}, "temperature": 0.4, "maxOutputTokens": 800}

    # API key via query param
    resp = requests.post(url + f"?key={GEMINI_API_KEY}", json=body, timeout=30)
    data = resp.json()

    if "candidates" in data:
        # Assuming the first candidate's text is the desired response
        if 'content' in data["candidates"][0]:
            content = data["candidates"][0]['content']
            if 'parts' in content and content['parts']:
                return content['parts'][0].get('text', str(content))
        # Fallback for simpler REST structure if available
        return data["candidates"][0].get("output", str(data))
        
    return str(data)


# --------------------------
# Routes
# --------------------------
@app.route("/")
def index():
    return render_template("lesson.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    # Require a valid user_id from frontend
    user_id = data.get("user_id")
    if not isinstance(user_id, int) or user_id <= 0:
        return jsonify({"reply": "Error: Invalid user_id provided."}), 400

    user_msg = data.get("message", "")
    lesson_title = data.get("lesson_title", "MOOC Lesson")
    language = data.get("language", "en")

    # Save user message
    # History is now correctly tied to the user_id
    save_message(user_id, "user", user_msg)

    # Load summarized history (privacy friendly)
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

    # Save assistant reply
    save_message(user_id, "assistant", reply)

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True, port=5000)