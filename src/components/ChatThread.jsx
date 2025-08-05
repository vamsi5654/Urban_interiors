import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

const ChatThread = ({ customer, onBack, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Real-time message listener
  useEffect(() => {
    if (!customer?.id) return;

    const messagesRef = collection(db, 'chats', customer.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [customer?.id]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const messagesRef = collection(db, 'chats', customer.id, 'messages');
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        sender: 'admin',
        senderName: 'Support Team',
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
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      if (message.timestamp) {
        const date = message.timestamp.toDate().toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      }
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px',
            fontSize: '1.2rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>

        {/* Customer Avatar */}
        <div style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          {getInitials(customer.name)}
        </div>

        {/* Customer Info */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            {customer.name || 'Unknown Customer'}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            opacity: 0.9
          }}>
            {customer.email || customer.mobile || 'No contact info'}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px',
            fontSize: '1.5rem',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>

      {/* Customer Details Panel */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '0.9rem'
        }}>
          {customer.mobile && (
            <div>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>Phone: </span>
              <span style={{ color: '#2c3e50' }}>{customer.mobile}</span>
            </div>
          )}
          {customer.email && (
            <div>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>Email: </span>
              <span style={{ color: '#2c3e50' }}>{customer.email}</span>
            </div>
          )}
          {customer.pinCode && (
            <div>
              <span style={{ fontWeight: '600', color: '#6b7280' }}>Pin Code: </span>
              <span style={{ color: '#2c3e50' }}>{customer.pinCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        backgroundColor: '#f8f9fa'
      }}>
        {Object.keys(messageGroups).length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '3rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
              Start the conversation
            </h3>
            <p style={{ margin: 0 }}>
              Send a message to {customer.name || 'this customer'}
            </p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div style={{
                textAlign: 'center',
                margin: '2rem 0 1rem 0'
              }}>
                <span style={{
                  backgroundColor: 'white',
                  color: '#6b7280',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: message.sender === 'admin' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '1rem 1.25rem',
                    borderRadius: message.sender === 'admin' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    backgroundColor: message.sender === 'admin' ? '#e74c3c' : 'white',
                    color: message.sender === 'admin' ? 'white' : '#2c3e50',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
                    wordBreak: 'break-word'
                  }}>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '1rem', 
                      lineHeight: 1.5 
                    }}>
                      {message.text}
                    </p>
                    <div style={{
                      fontSize: '0.75rem',
                      opacity: 0.8,
                      textAlign: 'right'
                    }}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '1rem 1.5rem',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-end'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${customer.name || 'customer'}...`}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '1rem 1.25rem',
            border: '1px solid #d1d5db',
            borderRadius: '25px',
            outline: 'none',
            fontSize: '1rem',
            backgroundColor: isLoading ? '#f9fafb' : 'white',
            minHeight: '50px',
            resize: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#e74c3c';
            e.target.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
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
            width: '50px',
            height: '50px',
            cursor: newMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            if (newMessage.trim() && !isLoading) {
              e.target.style.backgroundColor = '#c0392b';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            if (newMessage.trim() && !isLoading) {
              e.target.style.backgroundColor = '#e74c3c';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {isLoading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
};

export default ChatThread;