
### 13. `ARCHITECTURE.md`

```markdown
# Application Architecture

## Overview

The real-time chat application consists of two main components:
1. **Backend**: Node.js server with Express and Socket.IO
2. **Frontend**: React application with styled-components

## Backend Architecture

The backend server handles:
- WebSocket connections via Socket.IO
- User management (connection/disconnection)
- Message broadcasting
- Typing indicators
- Maintaining message history

### Key Components

1. **Socket.IO Server**: Manages real-time communication
2. **User Management**: Tracks active users
3. **Message Handling**: Stores and broadcasts messages

## Frontend Architecture

The frontend provides:
- User interface for chat
- Login screen
- Real-time message display
- Typing indicators
- Online user list

### Key Components

1. **Chat Component**: Main chat interface
2. **Socket.IO Client**: Connects to backend
3. **State Management**: Handles messages, users, and UI state

## Data Flow

1. User connects and provides username
2. Server adds user to active users list
3. User sends message → server broadcasts to all clients
4. Server maintains message history
5. Typing events are broadcast in real-time
6. Disconnections are handled gracefully

## Scalability Considerations

1. The backend can be scaled horizontally with Socket.IO adapters
2. Redis can be added for shared state across multiple servers
3. Frontend is stateless and can be served via CDN