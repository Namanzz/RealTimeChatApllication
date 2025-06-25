import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  padding: 15px 20px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.8);
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  position: relative;
  background: ${props => props.isCurrentUser ? '#667eea' : '#e5e5ea'};
  color: ${props => props.isCurrentUser ? 'white' : 'black'};
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isCurrentUser ? 'right: -10px' : 'left: -10px'};
    width: 20px;
    height: 20px;
    background: ${props => props.isCurrentUser ? '#667eea' : '#e5e5ea'};
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isCurrentUser ? 'right: -26px' : 'left: -26px'};
    width: 26px;
    height: 26px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    z-index: -1;
  }
`;

const Sender = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.8rem;
  color: ${props => props.isCurrentUser ? '#e5e5ea' : '#555'};
`;

const Timestamp = styled.div`
  font-size: 0.7rem;
  text-align: right;
  margin-top: 5px;
  color: ${props => props.isCurrentUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 0 20px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TypingIndicator = styled.div`
  font-style: italic;
  color: #666;
  padding: 5px 15px;
  font-size: 0.9rem;
`;

const OnlineUsers = styled.div`
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  
  span {
    display: inline-block;
    margin-right: 8px;
    color: #667eea;
    font-weight: bold;
  }
`;

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:4000');

    socket.current.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.current.on('message_history', (history) => {
      setMessages(history);
    });

    socket.current.on('user_connected', (user) => {
      setActiveUsers(prev => [...prev, user]);
    });

    socket.current.on('user_disconnected', (user) => {
      setActiveUsers(prev => prev.filter(u => u.id !== user.id));
    });

    socket.current.on('active_users', (users) => {
      setActiveUsers(users);
    });

    socket.current.on('user_typing', ({ username, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => [...new Set([...prev, username])]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== username));
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.current.emit('new_user', username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.current.emit('send_message', { text: message });
      setMessage('');
      setIsTyping(false);
      socket.current.emit('typing', false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping && e.target.value) {
      setIsTyping(true);
      socket.current.emit('typing', true);
    } else if (isTyping && !e.target.value) {
      setIsTyping(false);
      socket.current.emit('typing', false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ChatContainer>
      <Header>Real-Time Chat</Header>
      
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.9)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Enter your username</h2>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ width: '80%', maxWidth: '400px' }}
          />
          <Button type="submit" style={{ marginTop: '15px' }}>
            Join Chat
          </Button>
        </form>
      ) : (
        <>
          <OnlineUsers>
            Online: {activeUsers.map(user => (
              <span key={user.id}>{user.username}</span>
            ))}
          </OnlineUsers>
          
          <MessagesContainer>
            {messages.map((msg, index) => (
              <Message 
                key={index} 
                isCurrentUser={msg.user === username}
              >
                <Sender isCurrentUser={msg.user === username}>
                  {msg.user === username ? 'You' : msg.user}
                </Sender>
                {msg.text}
                <Timestamp isCurrentUser={msg.user === username}>
                  {formatTime(msg.timestamp)}
                </Timestamp>
              </Message>
            ))}
            
            {typingUsers.length > 0 && (
              <TypingIndicator>
                {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
              </TypingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>
          
          <form onSubmit={handleSendMessage}>
            <InputContainer>
              <Input
                type="text"
                value={message}
                onChange={handleTyping}
                placeholder="Type a message..."
              />
              <Button type="submit">Send</Button>
            </InputContainer>
          </form>
        </>
      )}
    </ChatContainer>
  );
};

export default Chat;