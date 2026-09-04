# 🤖 NexusAI — AI Chat Application

NexusAI is a full-stack AI chat application inspired by ChatGPT, built using the **MERN stack** and **Google Gemini API**.

Users can create conversations, chat with Gemini, manage chat history, and customize their profile through a modern responsive interface.

## 🚀 Live Demo : **[AI-Chatapp.in]()**

## 📸 Screenshot

![NexusAI Screenshot]()

## ✨ Features

* 🔐 User Registration & Login
* 🔑 JWT Authentication
* 🔒 Password Hashing with bcrypt
* 🤖 Google Gemini AI Integration
* 💬 Multi-turn AI Conversations
* 📝 Markdown & Code Rendering
* 📋 Copy Code Feature
* 💾 Chat History
* ✏️ Rename Conversations
* 🗑️ Delete Conversations
* ➕ Create New Chats
* 👤 User Profile Management
* 🔄 Change Password
* 🎨 Dark Modern UI
* 📱 Responsive Design
* ⚡ Smooth Animations with Framer Motion

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### AI

* Google Gemini API

## 📁 Project Structure

```text
NexusAI/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── App.jsx
│
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        └── services/
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
cd NexusAI
```

### 2. Install Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Frontend

```bash
cd ../client
npm install
```

### 4. Start the Backend

```bash
cd server
npm run dev
```

### 5. Start the Frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## 📡 Main API Endpoints

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/api/auth/register`          | Register user          |
| POST   | `/api/auth/login`             | Login user             |
| GET    | `/api/auth/me`                | Get authenticated user |
| POST   | `/api/chat`                   | Send message to Gemini |
| GET    | `/api/chat/conversations`     | Get chat history       |
| GET    | `/api/chat/conversations/:id` | Get conversation       |
| POST   | `/api/chat/conversations`     | Create conversation    |
| PUT    | `/api/chat/conversations/:id` | Rename conversation    |
| DELETE | `/api/chat/conversations/:id` | Delete conversation    |
| GET    | `/api/users/profile`          | Get profile            |
| PUT    | `/api/users/profile`          | Update profile         |
| PUT    | `/api/users/change-password`  | Change password        |

## 🔐 Security

* JWT-based authentication
* Protected API routes
* Password hashing with bcrypt
* User-specific conversations
* Environment variables for sensitive credentials

## 👨‍💻 Author

**Manickam**

MERN Stack Developer | Full Stack Developer

---

⭐ If you like this project, consider giving it a star!
