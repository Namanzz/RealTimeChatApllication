// server/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store active users and messages
let activeUsers = [];
let messages = [];

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Add new user
  socket.on('new_user', (username) => {
    const user = { id: socket.id, username };
    activeUsers.push(user);
    io.emit('user_connected', user);
    io.emit('active_users', activeUsers);
    io.emit('message_history', messages);
  });

  // Handle new messages
  socket.on('send_message', (message) => {
    const user = activeUsers.find(u => u.id === socket.id);
    if (user) {
      const msgWithUser = { ...message, user: user.username, timestamp: new Date() };
      messages.push(msgWithUser);
      io.emit('receive_message', msgWithUser);
    }
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    const user = activeUsers.find(u => u.id === socket.id);
    if (user) {
      io.emit('user_typing', { username: user.username, isTyping });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userIndex = activeUsers.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      const disconnectedUser = activeUsers[userIndex];
      activeUsers.splice(userIndex, 1);
      io.emit('user_disconnected', disconnectedUser);
      io.emit('active_users', activeUsers);
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});