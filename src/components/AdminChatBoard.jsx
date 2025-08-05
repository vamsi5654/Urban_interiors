import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, limit, doc } from 'firebase/firestore';
import ChatThread from './ChatThread';

const AdminChatBoard = ({ onClose }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch customers
  useEffect(() => {
    const customersRef = collection(db, 'customers');
    const unsubscribe = onSnapshot(customersRef, (snapshot) => {
      const customerList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customerList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to last messages for each customer
  useEffect(() => {
    const unsubscribes = [];

    customers.forEach(customer => {
      const messagesRef = collection(db, 'chats', customer.id, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const lastMessage = snapshot.docs[0].data();
          setLastMessages(prev => ({
            ...prev,
            [customer.id]: lastMessage
          }));
        }
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [customers]);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile?.includes(searchTerm)
  );

  // Sort customers by last message timestamp
  const sortedCustomers = filteredCustomers.sort((a, b) => {
    const aLastMessage = lastMessages[a.id];
    const bLastMessage = lastMessages[b.id];
    
    if (!aLastMessage && !bLastMessage) return 0;
    if (!aLastMessage) return 1;
    if (!bLastMessage) return -1;
    
    return bLastMessage.timestamp?.toDate() - aLastMessage.timestamp?.toDate();
  });

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (selectedCustomer) {
    return (
      <ChatThread
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
            Customer Messages
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            {customers.length} customers
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

      {/* Search Bar */}
      <div style={{
        padding: '1rem 1.5rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '25px',
            outline: 'none',
            fontSize: '1rem',
            boxSizing: 'border-box'
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
      </div>

      {/* Customer List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#f8f9fa'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            color: '#6b7280'
          }}>
            Loading customers...
          </div>
        ) : sortedCustomers.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📪</div>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>
              {searchTerm ? 'No customers found' : 'No customers yet'}
            </p>
          </div>
        ) : (
          sortedCustomers.map(customer => {
            const lastMessage = lastMessages[customer.id];
            
            return (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  backgroundColor: 'white',
                  borderBottom: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  gap: '1rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {getInitials(customer.name)}
                </div>

                {/* Customer Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {customer.name || 'Unknown'}
                    </h4>
                    {lastMessage && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        flexShrink: 0
                      }}>
                        {formatTimestamp(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>

                  <p style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {customer.email || customer.mobile || 'No contact info'}
                  </p>

                  {lastMessage ? (
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{
                        fontWeight: lastMessage.sender === 'admin' ? 'normal' : '600'
                      }}>
                        {lastMessage.sender === 'admin' ? 'You: ' : ''}
                        {lastMessage.text}
                      </span>
                    </p>
                  ) : (
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#9ca3af',
                      fontStyle: 'italic'
                    }}>
                      No messages yet
                    </p>
                  )}
                </div>

                {/* Unread indicator */}
                {lastMessage && lastMessage.sender === 'customer' && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#e74c3c',
                    flexShrink: 0
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminChatBoard;
                