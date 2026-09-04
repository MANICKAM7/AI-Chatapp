# NexusAI — AI-Powered Chat Application (MERN + Gemini)

A full-stack, production-grade ChatGPT-like AI Chat Application built with **React.js (Vite)**, **Node.js**, **Express.js**, **MongoDB (Mongoose)**, **JWT + bcrypt**, and **Google Gemini API**.

---

## 🌟 Highlights & Features

### 1. Authentication Module
- **User Registration & Login** with validated fields (`name`, `email`, `password`, `avatar`).
- **Password Security**: Strong hashing with `bcryptjs` salts.
- **JWT Authentication**: Stateless Bearer tokens with 30-day expiry.
- **Protected Routes**: Middleware verifies authentication on all chat and profile endpoints.
- **Auto-session restoration** from `localStorage`.

### 2. AI Chat Module
- **ChatGPT-Style Interface**: User messages right-styled, AI assistant on the left with custom avatars.
- **Gemini 1.5 Flash Integration**: Multi-turn conversational context so the AI remembers previous exchanges.
- **Markdown & Code Syntax Highlighting**: Render markdown tables, lists, blockquotes, and code snippets with one-click "Copy Code" button.
- **Real-time Typing Indicator**: Smooth bouncing dots when the AI is formulating responses.
- **Auto-scrolling**: Smoothly follows new tokens and messages, with an intuitive "Scroll to bottom" button.
- **Zero Input Lag**: Optimistic UI immediately posts user message while background network executes.

### 3. Chat History Module
- Saved securely in MongoDB linked to the authenticated `userId`.
- **Automatic Smart Titling**: Upon sending the first message, Gemini summarizes a clean 3-5 word title for the conversation.
- **Sidebar History**: Chronological list of user chats with last message previews and message counts.

### 4. Conversation Management Module
- **+ New Chat**: Easily start fresh conversations.
- **Select Chat**: Instantly switch between chats with full history loading.
- **Inline Rename**: Click the 3 dots or edit icon to rename conversations in-place.
- **Delete Chat with Confirmation**: Modal confirmation dialog prevents accidental deletion.

### 5. User Profile Module
- View personal info (Name, Email, Registration date).
- Live Name editor and one-click DiceBear Bot avatar generator.
- Password change modal with current password validation.
- Secure Logout.

### 6. Animations & Performance
- Built with **Framer Motion** for buttery smooth micro-animations.
- Responsive mobile drawer sidebar with backdrop blur.
- Tailored dark theme inspired by modern AI apps.

---

## 🏗️ Architecture

```text
d:\AI chatapp\
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB Mongoose connection
│   │   │   └── gemini.js      # Gemini client configuration
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT protect middleware
│   │   │   └── errorMiddleware.js  # 404 & centralized error handler
│   │   ├── models/
│   │   │   ├── User.js             # User schema with bcrypt hooks
│   │   │   └── Conversation.js     # Conversation & Message schemas
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── userRoutes.js
│   │   └── services/
│   │       └── geminiService.js    # Multi-turn context & title generator
│   ├── .env
│   └── server.js
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx     # Chat history, new chat, rename/delete
    │   │   ├── ChatWindow.jsx  # Hero screen, message feed, typing indicator
    │   │   ├── Message.jsx     # Markdown renderer, code copying, avatars
    │   │   ├── ChatInput.jsx   # Auto-grow textarea, keyboard send
    │   │   └── UserProfile.jsx # Profile modal, avatar roller, password change
    │   ├── pages/
    │   │   ├── Login.jsx       # Dark glass login UI
    │   │   ├── Register.jsx    # User registration with avatar preview
    │   │   └── Chat.jsx        # Main orchestrator
    │   ├── context/
    │   │   └── AuthContext.jsx # Auth state management
    │   ├── services/
    │   │   └── api.js          # Fetch wrapper with Bearer token injection
    │   └── App.jsx
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas connection string.

### 2. Environment Setup
In `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aichatapp
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/))*

### 3. Run Backend & Frontend
Terminal 1 (Backend):
```bash
cd server
npm run dev
# or: node server.js
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`
Backend runs on: `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user |

### Chat
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/chat` | Send message to Gemini & get response |
| `GET` | `/api/chat/conversations` | List conversations for user |
| `GET` | `/api/chat/conversations/:id` | Get full messages for conversation |
| `POST` | `/api/chat/conversations` | Create new conversation |
| `PUT` | `/api/chat/conversations/:id` | Rename conversation title |
| `DELETE` | `/api/chat/conversations/:id` | Delete conversation |

### User Profile
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get user profile |
| `PUT` | `/api/users/profile` | Update name and avatar |
| `PUT` | `/api/users/change-password` | Change user password |
