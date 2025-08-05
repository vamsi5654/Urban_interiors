import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Edit3, Trash2, Plus, FolderPlus, Eye, X, Check, AlertTriangle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthProvider';
import { signOut } from "firebase/auth";
import { auth } from '../components/firebase';
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc, Timestamp, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import ReviewUploadForm from './ReviewUploadForm';
import VideoUploadForm from './VideoUploadForm';
import LeadManagement from './LeadManagement';


// Mock data for demonstration
const mockCustomers = [];

const roomTypes = [
  { key: 'bedroom', label: 'Bedroom' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'poojaroom', label: 'Pooja Room' },
  { key: 'livingroom', label: 'Living Room' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'diningRoom', label: 'Dining Room' },
  { key: 'balcony', label: 'Balcony' },
  { key: 'gym', label: 'Gym' },
  { key: 'playarea', label: 'Play Area' },
  { key: 'garden', label: 'Garden' },
  { key: 'entranceImage', label: 'Entrance Image' },
];

// Utility function to format Firestore timestamps
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleDateString();
    }
    return 'N/A';
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'N/A';
  }
};

// Button Component
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) => {
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
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    success: {
      backgroundColor: '#10b981',
      color: 'white'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
      onMouseOver={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = variants[variant].boxShadow || '0 1px 3px rgba(0,0,0,0.1)';
        }
      }}
    >
      {children}
    </button>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Confirm Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '16px',
          backgroundColor: type === 'danger' ? '#fef2f2' : '#f0f9ff',
          borderRadius: '8px',
          border: `1px solid ${type === 'danger' ? '#fecaca' : '#bfdbfe'}`
        }}>
          <AlertTriangle 
            size={24} 
            color={type === 'danger' ? '#ef4444' : '#3b82f6'} 
          />
          <p style={{ margin: 0, color: '#374151' }}>{message}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={type} onClick={onConfirm}>
          {type === 'danger' ? 'Delete' : 'Confirm'}
        </Button>
      </div>
    </Modal>
  );
};

// Image Viewer Component
const ImageViewer = ({ isOpen, onClose, images, currentIndex, onNavigate }) => {
  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={24} />
      </button>

      <div style={{ 
        maxWidth: '90vw', 
        maxHeight: '90vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '400px',
          height: '300px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          overflow: 'hidden'
        }}>
          {currentImage.imageUrl ? (
            <img 
              src={currentImage.imageUrl} 
              alt={currentImage.filename}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <Camera size={48} color="#9ca3af" />
          )}
        </div>
        
        <p style={{ color: 'white', margin: '0 0 16px 0' }}>
          {currentImage.filename}
        </p>

        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              variant="secondary" 
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <span style={{ color: 'white', padding: '8px 16px' }}>
              {currentIndex + 1} / {images.length}
            </span>
            <Button 
              variant="secondary" 
              onClick={() => onNavigate(Math.min(images.length - 1, currentIndex + 1))}
              disabled={currentIndex === images.length - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Customer Edit Form Component
const CustomerEditForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: customer.name || '',
    phone: customer.phone || '',
    address: customer.address || '',
    project: customer.project || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(customer.id, formData);
      alert("Customer details updated successfully!");
      onCancel();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>
        Edit Customer Details
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Customer Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Project Name *
            </label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Customer Form Component
const CustomerForm = ({ onAddCustomer, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    project: ''
  });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (roomType, files) => {
    setSelectedFiles({
      ...selectedFiles,
      [roomType]: Array.from(files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCustomer = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        project: formData.project,
        createdAt: Timestamp.now(),
        rooms: {}
      };

      const cloudName = 'omsi';
      const uploadPreset = 'urbann_preset';

      for (const room of roomTypes) {
        const files = selectedFiles[room.key] || [];
        const roomImages = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const timestamp = Date.now();
          const fileName = `${formData.name}_${room.key}_${i}_${timestamp}`;

          const uploadData = new FormData();
          uploadData.append('file', file);
          uploadData.append('upload_preset', uploadPreset);
          uploadData.append('public_id', fileName);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: uploadData,
          });

          const data = await res.json();

          if (!data.secure_url) {
            console.error("Upload to Cloudinary failed:", data);
            throw new Error("Upload failed. Cloudinary did not return an image URL.");
          }

          roomImages.push({
            filename: file.name,
            imageUrl: data.secure_url,
            uploadedAt: Timestamp.now()
          });
        }

        if (roomImages.length > 0) {
          newCustomer.rooms[room.key] = roomImages;
        }
      }

      await addDoc(collection(db, "customers"), newCustomer);
      alert("Customer data uploaded successfully!");

      setFormData({ name: '', phone: '', address: '', project: '' });
      setSelectedFiles({});
      onCancel();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload data. See console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>
        Add New Customer
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Customer Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Project Name *
              </label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Upload Images by Category
        </h3>
        
        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
          {roomTypes.map(room => (
            <div key={room.key} style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                {room.label}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(room.key, e.target.files)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white'
                }}
              />
              {selectedFiles[room.key] && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                  {selectedFiles[room.key].length} file(s) selected
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            disabled={isSubmitting}
            style={{ flexGrow: 1 }}
          >
            {isSubmitting ? 'Creating Customer...' : (
              <>
                <Upload size={20} />
                Create Customer & Upload Images
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Room Gallery Component
const RoomGallery = ({ customer, roomKey, roomLabel, images, onBack, onAddImages, onEditRoom, onDeleteRoom }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              {customer.name} - {roomLabel}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {images.length} image(s)
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" size="sm" onClick={() => onAddImages(roomKey)}>
            <Plus size={16} />
            Add Images
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onEditRoom(roomKey, roomLabel)}>
            <Edit3 size={16} />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDeleteRoom(roomKey, roomLabel)}>
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '2px dashed #d1d5db'
        }}>
          <Camera size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>No images yet</h3>
          <p style={{ margin: '0 0 20px 0', color: '#9ca3af' }}>
            Add some images to get started
          </p>
          <Button variant="primary" onClick={() => onAddImages(roomKey)}>
            <Plus size={16} />
            Add First Image
          </Button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {images.map((image, index) => (
            <div
              key={image.id || index}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => openViewer(index)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                height: '200px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {image.imageUrl ? (
                  <img 
                    src={image.imageUrl} 
                    alt={image.filename}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Camera size={40} color="#9ca3af" />
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                  {image.filename}
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Uploaded: {formatTimestamp(image.uploadedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={images}
        currentIndex={currentImageIndex}
        onNavigate={setCurrentImageIndex}
      />
    </div>
  );
};

// Room Editor Modal Component
const RoomEditorModal = ({ isOpen, onClose, mode, roomKey, roomLabel, onSave, onUpload }) => {
  const [newRoomName, setNewRoomName] = useState(roomLabel || '');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newRoomType, setNewRoomType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    if (mode === 'edit' && newRoomName.trim()) {
      await onSave(roomKey, newRoomName.trim());
    } else if (mode === 'add' && newRoomType) {
      await onSave(newRoomType, newRoomType);
    } else if (mode === 'upload' && selectedFiles.length > 0) {
      setIsSubmitting(true);
      try {
        await onUpload(roomKey, selectedFiles);
      } finally {
        setIsSubmitting(false);
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setNewRoomName('');
    setSelectedFiles([]);
    setNewRoomType('');
    setIsSubmitting(false);
    onClose();
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={
      mode === 'edit' ? 'Edit Room Name' : 
      mode === 'add' ? 'Add New Room' : 
      'Add Images'
    }>
      {mode === 'edit' && (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Room Name
          </label>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter room name"
            autoFocus
          />
        </div>
      )}

      {mode === 'add' && (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select Room Type
          </label>
          <select
            value={newRoomType}
            onChange={(e) => setNewRoomType(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '20px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Choose a room type</option>
            {roomTypes.map(room => (
              <option key={room.key} value={room.label}>
                {room.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {mode === 'upload' && (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select Images
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              marginBottom: '12px',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
          {selectedFiles.length > 0 && (
            <div style={{
              padding: '12px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#1e40af' }}>
                {selectedFiles.length} file(s) selected:
              </p>
              {selectedFiles.slice(0, 3).map((file, index) => (
                <p key={index} style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}>
                  • {file.name}
                </p>
              ))}
              {selectedFiles.length > 3 && (
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>
                  ...and {selectedFiles.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={
            isSubmitting ||
            (mode === 'edit' && !newRoomName.trim()) ||
            (mode === 'add' && !newRoomType) ||
            (mode === 'upload' && selectedFiles.length === 0)
          }
        >
          <Check size={16} />
          {isSubmitting ? 'Processing...' : 
           mode === 'edit' ? 'Save Changes' : 
           mode === 'add' ? 'Add Room' : 'Upload Images'}
        </Button>
      </div>
    </Modal>
  );
};

// Outlet Folder Component
const OutletFolder = ({ customer, onBack, onViewRoom, onUpdateCustomer, onEditCustomer, onDeleteCustomer }) => {
  const [editorModal, setEditorModal] = useState({ isOpen: false, mode: '', roomKey: '', roomLabel: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, roomKey: '', roomLabel: '', type: 'room' });

  const handleAddNewRoom = () => {
    setEditorModal({ isOpen: true, mode: 'add', roomKey: '', roomLabel: '' });
  };

  const handleEditRoom = (roomKey, roomLabel) => {
    setEditorModal({ isOpen: true, mode: 'edit', roomKey, roomLabel });
  };

  const handleDeleteRoom = (roomKey, roomLabel) => {
    setConfirmDialog({ isOpen: true, roomKey, roomLabel, type: 'room' });
  };

  const handleAddImages = (roomKey) => {
    const roomLabel = roomTypes.find(r => r.key === roomKey)?.label || roomKey;
    setEditorModal({ isOpen: true, mode: 'upload', roomKey, roomLabel });
  };

  const confirmDeleteRoom = async () => {
    try {
      const updatedRooms = { ...customer.rooms };
      delete updatedRooms[confirmDialog.roomKey];
      
      const customerRef = doc(db, "customers", customer.id);
      await updateDoc(customerRef, { rooms: updatedRooms });
      
      const updatedCustomer = { ...customer, rooms: updatedRooms };
      onUpdateCustomer(updatedCustomer);
      setConfirmDialog({ isOpen: false, roomKey: '', roomLabel: '', type: 'room' });
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room. Please try again.");
    }
  };

  const handleSaveRoom = async (roomKey, newName) => {
    try {
      if (editorModal.mode === 'add') {
        const newRoomKey = newName.toLowerCase().replace(/\s+/g, '');
        const updatedRooms = {
          ...customer.rooms,
          [newRoomKey]: []
        };
        
        const customerRef = doc(db, "customers", customer.id);
        await updateDoc(customerRef, { rooms: updatedRooms });
        
        const updatedCustomer = { ...customer, rooms: updatedRooms };
        onUpdateCustomer(updatedCustomer);
      }
      setEditorModal({ isOpen: false, mode: '', roomKey: '', roomLabel: '' });
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Failed to save room. Please try again.");
    }
  };

  const handleUploadImages = async (roomKey, files) => {
    try {
      const cloudName = 'omsi';
      const uploadPreset = 'urbann_preset';
      const newImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const fileName = `${customer.name}_${roomKey}_${timestamp}_${i}`;

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', uploadPreset);
        uploadData.append('public_id', fileName);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: uploadData,
        });

        const data = await res.json();

        if (!data.secure_url) {
          throw new Error("Upload failed. Cloudinary did not return an image URL.");
        }

        newImages.push({
          filename: file.name,
          imageUrl: data.secure_url,
          uploadedAt: Timestamp.now()
        });
      }

      const updatedRooms = {
        ...customer.rooms,
        [roomKey]: [...(customer.rooms[roomKey] || []), ...newImages]
      };

      const customerRef = doc(db, "customers", customer.id);
      await updateDoc(customerRef, { rooms: updatedRooms });

      const updatedCustomer = { ...customer, rooms: updatedRooms };
      onUpdateCustomer(updatedCustomer);
      
      setEditorModal({ isOpen: false, mode: '', roomKey: '', roomLabel: '' });
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const getRoomDisplayName = (roomKey) => {
    const roomType = roomTypes.find(r => r.key === roomKey);
    return roomType ? roomType.label : roomKey;
  };

  const totalImages = Object.values(customer.rooms || {}).reduce((total, images) => total + (images?.length || 0), 0);

  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="secondary" onClick={onBack}>
              ← Back to Customers
            </Button>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                📁 {customer.name}'s Portfolio
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
                {customer.phone} • {customer.address} • {customer.project}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => onEditCustomer(customer)}>
              <User size={16} />
              Edit Customer
            </Button>
            <Button variant="danger" onClick={() => setConfirmDialog({ isOpen: true, type: 'customer' })}>
              <Trash2 size={16} />
              Delete Customer
            </Button>
            <Button variant="primary" onClick={handleAddNewRoom}>
              <FolderPlus size={16} />
              Add New Room
            </Button>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '24px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>Created: {formatTimestamp(customer.createdAt)}</span>
          <span>•</span>
          <span>Total Images: {totalImages}</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {Object.entries(customer.rooms || {}).map(([roomKey, images]) => {
          const roomLabel = getRoomDisplayName(roomKey);
          const imageCount = images?.length || 0;
          return (
            <div
              key={roomKey}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📁
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                    {roomLabel}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    {imageCount} image{imageCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewRoom(roomKey, roomLabel, images || []);
                  }}
                >
                  <Eye size={14} />
                  View ({imageCount})
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddImages(roomKey);
                  }}
                >
                  <Plus size={14} />
                  Add
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRoom(roomKey, roomLabel);
                  }}
                >
                  <Edit3 size={14} />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(roomKey, roomLabel);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              {imageCount > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px'
                }}>
                  {(images || []).slice(0, 3).map((image, index) => (
                    <div
                      key={image.id || index}
                      style={{
                        aspectRatio: '1',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      {image.imageUrl ? (
                        <img 
                          src={image.imageUrl} 
                          alt={image.filename}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Camera size={16} color="#9ca3af" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {imageCount === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db'
                }}>
                  <Camera size={32} color="#9ca3af" style={{ marginBottom: '8px' }} />
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    No images yet
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <RoomEditorModal
        isOpen={editorModal.isOpen}
        onClose={() => setEditorModal({ isOpen: false, mode: '', roomKey: '', roomLabel: '' })}
        mode={editorModal.mode}
        roomKey={editorModal.roomKey}
        roomLabel={editorModal.roomLabel}
        onSave={handleSaveRoom}
        onUpload={handleUploadImages}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, roomKey: '', roomLabel: '', type: 'room' })}
        onConfirm={confirmDialog.type === 'customer' ? () => onDeleteCustomer(customer.id) : confirmDeleteRoom}
        title={confirmDialog.type === 'customer' ? "Delete Customer" : "Delete Room Folder"}
        message={
          confirmDialog.type === 'customer' 
            ? `Are you sure you want to permanently delete "${customer.name}" and all their data? This action cannot be undone.`
            : `Are you sure you want to delete the "${confirmDialog.roomLabel}" folder? This will permanently remove all ${(customer.rooms && customer.rooms[confirmDialog.roomKey]) ? customer.rooms[confirmDialog.roomKey].length : 0} images in this room.`
        }
        type="danger"
      />
    </div>
  );
};

// Category Gallery Component
const CategoryGallery = ({ category, allCustomers, onBack }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Debug: Log the category and room types
  console.log('Selected category:', category);
  console.log('Available room types:', roomTypes);
  
  const categoryKey = roomTypes.find(r => r.label === category)?.key;
  console.log('Found category key:', categoryKey);
  
  const allCategoryImages = [];
  
  allCustomers.forEach(customer => {
    console.log(`Customer: ${customer.name}, Rooms:`, Object.keys(customer.rooms || {}));
    
    if (categoryKey && customer.rooms && customer.rooms[categoryKey]) {
      console.log(`Found ${customer.rooms[categoryKey].length} images for ${customer.name} in ${category}`);
      customer.rooms[categoryKey].forEach(image => {
        allCategoryImages.push({
          ...image,
          customerName: customer.name,
          customerId: customer.id
        });
      });
    }
  });

  console.log('Total category images found:', allCategoryImages.length);

  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              All {category} Images
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {allCategoryImages.length} image(s) across all customers
            </p>
            {/* Debug info */}
            <p style={{ margin: '4px 0 0 0', color: '#ef4444', fontSize: '12px' }}>
              Debug: Looking for key "{categoryKey}" in customer rooms
            </p>
          </div>
        </div>
      </div>

      {/* Debug section - Remove this after fixing */}
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#dc2626' }}>Debug Information:</h4>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>Category: {category}</p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>Category Key: {categoryKey || 'NOT FOUND'}</p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>Total Customers: {allCustomers.length}</p>
        
        <details style={{ marginTop: '12px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Customer Room Keys</summary>
          {allCustomers.map(customer => (
            <div key={customer.id} style={{ margin: '8px 0', fontSize: '12px' }}>
              <strong>{customer.name}:</strong> {Object.keys(customer.rooms || {}).join(', ') || 'No rooms'}
            </div>
          ))}
        </details>
      </div>

      {allCategoryImages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '2px dashed #d1d5db'
        }}>
          <Camera size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>No {category.toLowerCase()} images yet</h3>
          <p style={{ margin: 0, color: '#9ca3af' }}>
            Images will appear here once customers upload {category.toLowerCase()} photos
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {allCategoryImages.map((image, index) => (
            <div
              key={image.id || index}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => openViewer(index)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                height: '200px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {image.imageUrl ? (
                  <img 
                    src={image.imageUrl} 
                    alt={image.filename}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Camera size={40} color="#9ca3af" />
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                  {image.filename}
                </h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#3b82f6' }}>
                  Customer: {image.customerName}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Uploaded: {formatTimestamp(image.uploadedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={allCategoryImages}
        currentIndex={currentImageIndex}
        onNavigate={setCurrentImageIndex}
      />
    </div>
  );
};

// Main App Component
const ImageManagementSystem = () => {
  const [customers, setCustomers] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [showEditCustomerForm, setShowEditCustomerForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "customers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCustomers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(fetchedCustomers);
    });

    return () => unsubscribe();
  }, []);

  const addCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
  };

  const editCustomer = async (customerId, formData) => {
    try {
      const customerRef = doc(db, "customers", customerId);
      await updateDoc(customerRef, formData);
      
      const updatedCustomer = { ...selectedCustomer, ...formData };
      updateCustomer(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await deleteDoc(doc(db, "customers", customerId));
      setCustomers(customers.filter(c => c.id !== customerId));
      goToDashboard();
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  const showCustomerFolder = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('customer-folder');
  };

  const showRoom = (customer, roomKey, roomLabel, images) => {
    setSelectedCustomer(customer);
    setSelectedRoom({ key: roomKey, label: roomLabel, images });
    setCurrentView('room-gallery');
  };

  const showCategoryGallery = (category) => {
    setSelectedCategory(category);
    setCurrentView('category-gallery');
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCustomer(null);
    setSelectedRoom(null);
    setSelectedCategory(null);
    setShowAddCustomerForm(false);
    setShowEditCustomerForm(false);
  };

  const goToCustomerFolder = () => {
    setCurrentView('customer-folder');
    setSelectedRoom(null);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditCustomerForm(true);
    setCurrentView('edit-customer');
  };

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (

    

    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '20px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
                Interior Design Portfolio Manager
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
                Manage customer images and portfolios efficiently
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {customers.length} Customer{customers.length !== 1 ? 's' : ''}
              </span>
              <Button variant="primary" onClick={() => setCurrentView("lead-management")}>
                📋 Manage Leads
              </Button>
              
              <Button variant="primary" onClick={() => setCurrentView("upload-text-review")}>
                📝 Upload Review
              </Button>

              <Button variant="primary" onClick={() => setCurrentView("upload-video-review")}>
                📹 Upload Video
              </Button>

              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>

            </div>
          </div>
        </header>

        {/* Category Navigation */}
        {(currentView === 'dashboard' || currentView === 'category-gallery') && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              Browse by Category
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {roomTypes.map(room => {
                const totalImages = customers.reduce((total, customer) => {
                  return total + ((customer.rooms && customer.rooms[room.key]) ? customer.rooms[room.key].length : 0);
                }, 0);
                
                return (
                  <Button
                    key={room.key}
                    variant={selectedCategory === room.label ? 'primary' : 'secondary'}
                    onClick={() => showCategoryGallery(room.label)}
                  >
                    {room.label} ({totalImages})
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'dashboard' && (
          <div>
            {!showAddCustomerForm && (
              <Button variant="primary" size="lg" onClick={() => setShowAddCustomerForm(true)} style={{ marginBottom: '24px' }}>
                <Plus size={20} />
                Add New Customer
              </Button>
            )}

            {showAddCustomerForm && (
              <CustomerForm 
                onAddCustomer={addCustomer} 
                onCancel={() => setShowAddCustomerForm(false)} 
              />
            )}
            
            {!showAddCustomerForm && (
              <div style={{ marginTop: '32px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: '600' }}>
                  Existing Customers
                </h2>
                
                {customers.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '2px dashed #d1d5db'
                  }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>No customers yet</h3>
                    <p style={{ margin: 0, color: '#9ca3af' }}>
                      Add your first customer using the form above
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                  }}>
                    {customers.map(customer => {
                      const totalImages = Object.values(customer.rooms || {}).reduce((total, images) => total + (images?.length || 0), 0);
                      const roomsWithImages = Object.keys(customer.rooms || {}).filter(key => (customer.rooms[key]?.length || 0) > 0).length;
                      
                      return (
                        <div
                          key={customer.id}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          onClick={() => showCustomerFolder(customer)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                          }}
                        >
                          <div style={{ marginBottom: '12px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                              📁 {customer.name}
                            </h3>
                            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>
                              📞 {customer.phone}
                            </p>
                            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>
                              📍 {customer.address}
                            </p>
                            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>
                              🏢 {customer.project}
                            </p>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            marginBottom: '16px'
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6' }}>
                                {totalImages}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Total Images
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>
                                {roomsWithImages}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Active Rooms
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '20px', fontWeight: '600', color: '#f59e0b' }}>
                                {formatTimestamp(customer.createdAt)}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Created
                              </div>
                            </div>
                          </div>

                          <Button variant="primary" size="sm" style={{ width: '100%' }}>
                            <Eye size={16} />
                            Open Portfolio
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'edit-customer' && selectedCustomer && (
          <CustomerEditForm
            customer={selectedCustomer}
            onSave={editCustomer}
            onCancel={goToDashboard}
          />
        )}

        {currentView === 'customer-folder' && selectedCustomer && (
          <OutletFolder
            customer={selectedCustomer}
            onBack={goToDashboard}
            onViewRoom={(roomKey, roomLabel, images) => showRoom(selectedCustomer, roomKey, roomLabel, images)}
            onUpdateCustomer={updateCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={deleteCustomer}
          />
        )}

        {currentView === 'room-gallery' && selectedCustomer && selectedRoom && (
          <RoomGallery
            customer={selectedCustomer}
            roomKey={selectedRoom.key}
            roomLabel={selectedRoom.label}
            images={selectedRoom.images}
            onBack={goToCustomerFolder}
            onAddImages={(roomKey) => {
              const updatedCustomer = customers.find(c => c.id === selectedCustomer.id);
              if (updatedCustomer) {
                setSelectedCustomer(updatedCustomer);
                setSelectedRoom({
                  ...selectedRoom,
                  images: (updatedCustomer.rooms && updatedCustomer.rooms[roomKey]) ? updatedCustomer.rooms[roomKey] : []
                });
              }
            }}
            onEditRoom={(roomKey, roomLabel) => {
              console.log('Edit room:', roomKey, roomLabel);
            }}
            onDeleteRoom={(roomKey, roomLabel) => {
              const updatedCustomer = {
                ...selectedCustomer,
                rooms: {
                  ...selectedCustomer.rooms,
                  [roomKey]: []
                }
              };
              updateCustomer(updatedCustomer);
              goToCustomerFolder();
            }}
          />
        )}

        {currentView === 'category-gallery' && selectedCategory && (
          <CategoryGallery
            category={selectedCategory}
            allCustomers={customers}
            onBack={goToDashboard}
          />
        )}

        {currentView === 'upload-text-review' && (
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
              <h2>Upload Customer Review</h2>
              <ReviewUploadForm />
              <Button onClick={goToDashboard} variant="secondary" style={{ marginTop: '12px' }}>
                ← Back to Dashboard
              </Button>
            </div>
          )}

          {currentView === 'upload-video-review' && (
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
              <h2>Upload Customer Video Review</h2>
              <VideoUploadForm />
              <Button onClick={goToDashboard} variant="secondary" style={{ marginTop: '12px' }}>
                ← Back to Dashboard
              </Button>
            </div>
          )}

          {currentView === 'lead-management' && (
            <div>
              <LeadManagement />
              <Button onClick={goToDashboard} variant="secondary" style={{ marginTop: '12px' }}>
                ← Back to Dashboard
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ImageManagementSystem;