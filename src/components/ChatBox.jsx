import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

const ChatBox = ({ customerId, customerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Real-time message listener
  useEffect(() => {
    if (!customerId) return;

    const messagesRef = collection(db, 'chats', customerId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [customerId]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const messagesRef = collection(db, 'chats', customerId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        sender: 'customer',
        senderName: customerName,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isMinimized) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '50px',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(231, 76, 60, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        maxWidth: '250px'
      }}
      onClick={() => setIsMinimized(false)}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = '#c0392b';
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = '#e74c3c';
        e.target.style.transform = 'scale(1)';
      }}
      >
        💬 Chat with us
        {messages.length > 0 && (
          <span style={{
            backgroundColor: 'white',
            color: '#e74c3c',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {messages.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      maxWidth: '90vw',
      height: '500px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e0e0e0'
    }}>
      {/* Chat Header */}
      <div style={{
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
            Chat with Urbann Interiors
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            We're here to help!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              fontSize: '1.2rem',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            −
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              fontSize: '1.2rem',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '2rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👋</div>
            <p style={{ margin: 0 }}>Start a conversation with us!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: message.sender === 'customer' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: message.sender === 'customer' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: message.sender === 'customer' ? '#e74c3c' : 'white',
                color: message.sender === 'customer' ? 'white' : '#2c3e50',
                border: message.sender === 'admin' ? '1px solid #e0e0e0' : 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                wordBreak: 'break-word'
              }}>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', lineHeight: 1.4 }}>
                  {message.text}
                </p>
                <span style={{
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '25px',
            outline: 'none',
            fontSize: '0.95rem',
            backgroundColor: isLoading ? '#f9fafb' : 'white'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#e74c3c';
            e.target.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!newMessage.trim() || isLoading}
          style={{
            backgroundColor: newMessage.trim() && !isLoading ? '#e74c3c' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            cursor: newMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;