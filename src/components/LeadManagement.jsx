import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Trash2, Edit3, Phone, Mail, MapPin, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Button Component (reused from ImageManagementSystem)
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
  const baseStyle = {
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: size === 'sm' ? '14px' : '16px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1
  };

  const variants = {
    primary: { backgroundColor: '#3b82f6', color: 'white' },
    secondary: { backgroundColor: '#e5e7eb', color: '#374151' },
    danger: { backgroundColor: '#ef4444', color: 'white' },
    success: { backgroundColor: '#10b981', color: 'white' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </button>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: { color: '#3b82f6', bg: '#dbeafe', icon: Clock, label: 'New' },
    contacted: { color: '#f59e0b', bg: '#fef3c7', icon: Phone, label: 'Contacted' },
    converted: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle, label: 'Converted' },
    closed: { color: '#6b7280', bg: '#f3f4f6', icon: AlertCircle, label: 'Closed' }
  };

  const config = statusConfig[status] || statusConfig.new;
  const Icon = config.icon;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: config.bg,
      color: config.color
    }}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

// Format timestamp utility
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  } catch (error) {
    return 'N/A';
  }
};

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch leads from Firebase
  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLeads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(fetchedLeads);
    });

    return () => unsubscribe();
  }, []);

  // Update lead status
  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
      alert("Failed to update lead status");
    }
  };

  // Delete lead
  const deleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteDoc(doc(db, "leads", leadId));
        setShowDetails(false);
        setSelectedLead(null);
      } catch (error) {
        console.error("Error deleting lead:", error);
        alert("Failed to delete lead");
      }
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => 
    filterStatus === 'all' || lead.status === filterStatus
  );

  // Get stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new' || !l.status).length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    closed: leads.filter(l => l.status === 'closed').length
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h1 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: '700' }}>
            Lead Management
          </h1>
          
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>{stats.total}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Leads</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#3b82f6' }}>{stats.new}</div>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>New</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#f59e0b' }}>{stats.contacted}</div>
              <div style={{ fontSize: '14px', color: '#d97706' }}>Contacted</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>{stats.converted}</div>
              <div style={{ fontSize: '14px', color: '#059669' }}>Converted</div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'new', 'contacted', 'converted', 'closed'].map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && ` (${stats[status] || 0})`}
              </Button>
            ))}
          </div>
        </div>

        {/* Leads List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {filteredLeads.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>No leads found</h3>
              <p style={{ margin: 0, color: '#9ca3af' }}>
                {filterStatus === 'all' ? 'No leads have been submitted yet' : `No ${filterStatus} leads found`}
              </p>
            </div>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Contact</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Location</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{lead.fullName}</div>
                        {lead.whatsappUpdates && (
                          <span style={{ fontSize: '12px', color: '#10b981' }}>📱 WhatsApp OK</span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                            <Phone size={12} />
                            +91 {lead.mobile}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                            <Mail size={12} />
                            {lead.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                          <MapPin size={12} />
                          {lead.pinCode}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <StatusBadge status={lead.status || 'new'} />
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {formatTimestamp(lead.createdAt)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select
                            value={lead.status || 'new'}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;