# Real-Time Chat Application 💬

A beautiful, responsive real-time chat application built with React, Node.js, and Socket.IO. Features include instant messaging, user presence indicators, typing notifications, and message history.

## Features ✨

- **Real-time messaging** with Socket.IO
- **User presence** - see who's online
- **Typing indicators** - know when others are typing
- **Message history** - view past conversations
- **Responsive design** - works on mobile & desktop
- **Modern UI** with smooth animations
- **User authentication** (simple username-based)
- **Active user list**
- **Timestamps** on all messages

## Technologies 🛠️

**Frontend:**
- React.js
- Styled Components
- Socket.IO Client
- React Icons (optional)

**Backend:**
- Node.js
- Express
- Socket.IO
- CORS middleware

## Prerequisites 📋

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Git

## Installation 🚀

### 1. Clone the repository

bash
git clone https://github.com/your-username/chat-app.git
cd chat-app

2. Install dependencies
bash
npm install
# or
yarn install
3. Create environment file
Create a .env file in the server directory with:

env
PORT=4000
CLIENT_URL=http://localhost:3000
4. Start the server
bash
npm start
# For development with auto-restart:
npm run dev
The backend will run on http://localhost:4000

Frontend Setup 💻
1. Navigate to frontend directory
bash
cd client
2. Install dependencies
bash
npm install
# or
yarn install
3. Create environment file
Create a .env file in the client directory with:

env
REACT_APP_SERVER_URL=http://localhost:4000
4. Start the development server
bash
npm start
The frontend will open automatically at http://localhost:3000

Configuration ⚙️
Backend Environment Variables
Variable	Description	Required	Default
PORT	Port to run the server	No	4000
CLIENT_URL	Frontend URL for CORS	Yes	http://localhost:3000
Frontend Environment Variables
Variable	Description	Required	Default
REACT_APP_SERVER_URL	Backend server URL	Yes	http://localhost:4000
Important Notes:
All environment variables must start with REACT_APP_ in the frontend to be accessible

The .env files should be added to your .gitignore

For production, set these variables in your hosting provider's environment settings

After changing environment variables, restart your development servers

Development Proxy Setup (Optional)
To avoid CORS issues during development, add this to client/package.json:

json
"proxy": "http://localhost:4000"
