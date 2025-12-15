# 🌾 SilayLearn – Iloilo Culture MOOC Platform

SilayLearn is a **Massive Open Online Course (MOOC) web platform** dedicated to promoting and preserving the rich **culture, heritage, and identity of Iloilo**. It delivers an engaging, beginner‑friendly learning experience through interactive lessons, a modern interface, and **AI‑powered services** (learning assistant and email automation).

The system is intentionally **student‑focused**. Learners can explore courses, study lessons, track progress, and receive guided support—**without instructor or admin dashboards**.

---

## 📖 Project Overview

Inspired by global MOOC platforms, SilayLearn blends modern web design with **localized Filipino content** to make learning culturally meaningful and accessible. Courses highlight real Iloilo experiences and heritage, enabling self‑paced exploration for a wide audience.

**Course themes include:**

* Iloilo tourism and historical landmarks
* Local cuisine and cooking traditions
* Agriculture and farming practices
* Traditional crafts and local skills
* Festivals and cultural customs

**Target users:** students, teachers, parents, tourists, researchers, and lifelong learners.

---

## 🎯 Purpose and Goals

* Promote **localized online learning** centered on Iloilo culture
* Preserve and share Iloilo’s traditions digitally
* Provide a smooth, beginner‑friendly MOOC experience
* Support learners with **AI‑powered guidance**
* Make cultural education accessible anytime, anywhere

---

## 🌺 Cultural Relevance & AI Integration

SilayLearn emphasizes Iloilo’s identity by grounding lessons in **real local contexts** rather than generic content.

### 🤖 AI Course Assistant (Python Flask)

The AI assistant:

* Explains lessons in simpler terms
* Translates concepts into **Filipino or Hiligaynon**
* Provides localized Iloilo‑based examples
* Maintains conversational context to guide learners

AI interactions are handled via a **Python Flask API** and stored for continuity and improvement.

---

## ✉️ Email Automation System (Python Flask)

SilayLearn includes an **automated email system** built with Python Flask to improve security, communication, and user engagement.

**Use cases:**

* Password reset requests
* Account and system notifications
* Course‑related updates (future‑ready)

**How it works:**

1. A user triggers an action (e.g., password reset)
2. The backend generates a **secure, unique token**
3. The token is saved with an **expiration time**
4. Flask sends an automated email containing the action link
5. The user completes the action securely

This design ensures **automation, security, and reliability** with minimal manual handling.

---

## 🛠️ Technical Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript (ES6), JSX
* TypeScript, TSX
* React Hooks
* React Router

### Backend

* PHP (core backend logic)
* Python Flask (AI assistant & email automation APIs)

### Database

* MySQL

### Tools & Environment

* Git & GitHub
* VS Code
* phpMyAdmin
* XAMPP (Apache & MySQL)

---

## 🗄️ Database Design & Integration

SilayLearn uses **MySQL** as a relational database with enforced foreign keys to maintain data integrity. Backend APIs follow **CRUD operations** (Create, Read, Update, Delete).

### Core Tables & Roles

* **`users`** – Stores learner accounts and serves as the central reference table.
* **`ref_courses`** – Stores course metadata (title, category, thumbnail).
* **`ref_instructors`** – Stores instructor display information (no instructor UI implemented).
* **`ref_course_content`** – Groups lessons into course sections/modules.
* **`ref_course_lessons`** – Stores individual lessons (video/reading/quiz).
* **`tra_user_courses`** – Manages enrollments and course‑level progress (many‑to‑many between users and courses).
* **`progress`** – Tracks lesson‑level completion for accurate progress calculation.
* **`chat_history`** – Saves AI assistant conversations per user.
* **`tra_comment`** – Stores learner ratings and feedback.
* **`password_reset_tokens`** – Supports secure email‑based password recovery.

### Relationship Summary

* One **user** → many **enrolled courses**
* One **course** → many **content sections** → many **lessons**
* Progress is tracked per **lesson** and aggregated per **course**
* AI chats and reset tokens are directly linked to users

---

## 🚀 How to Run the Project

### 📌 Prerequisites

* **Node.js** (frontend)
* **Python** (Flask services)
* **XAMPP** (PHP & MySQL)

---

### 🔹 Frontend (React + Vite)

```bash
npm install
npm run dev
```

Open the provided local URL in your browser.

---

### 🔹 AI Assistant & Email Automation (Python Flask)

1. Install Python (if not already installed)
2. Open a terminal in the Flask directory
3. Run:

```bash
python app.py
```

The local API will handle AI assistance and email automation.

---

### 🔹 Backend & Database (PHP + MySQL)

1. Install and open **XAMPP**
2. Start **Apache** and **MySQL**
3. Use **phpMyAdmin** to create/import the database
4. Place PHP backend files in the `htdocs` directory
5. Access backend routes via `localhost`

---

## 👤 User Scope

* Student‑only learning platform
* No instructor or admin dashboards
* Focused on learning, progress tracking, and cultural exploration

---

## 🌱 Future Improvements (Optional)

* Course completion certificates
* Offline lesson support
* Mobile optimization
* Community discussions
* Expanded AI capabilities

---

## 📜 License

Developed for **educational purposes** and the promotion of Iloilo culture.


