import React, { useState, useEffect } from 'react';
import { Camera, Upload, Folder, Image, User, Phone, MapPin, Calendar, Search, Download, Filter, X, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';

// Mock data for demonstration
const mockCustomers = [
  {
    _id: "customer123",
    name: "Ravi Kumar", 
    phone: "9876543210",
    address: "Hyderabad, India",
    createdAt: "2025-07-21"
  },
  {
    _id: "customer124",
    name: "Priya Sharma",
    phone: "9876543211", 
    address: "Secunderabad, India",
    createdAt: "2025-07-20"
  }
];

const mockImages = [
  {
    _id: "img001",
    customerId: "customer123",
    category: "kitchen",
    filename: "kitchen1.jpg",
    path: "/uploads/customer123/kitchen/kitchen1.jpg",
    uploadedAt: "2025-07-21",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
  },
  {
    _id: "img002", 
    customerId: "customer123",
    category: "bedroom",
    filename: "bedroom1.jpg",
    path: "/uploads/customer123/bedroom/bedroom1.jpg",
    uploadedAt: "2025-07-21",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop"
  },
  {
    _id: "img003",
    customerId: "customer124", 
    category: "living room",
    filename: "living1.jpg",
    path: "/uploads/customer124/living room/living1.jpg",
    uploadedAt: "2025-07-20",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
  },
  {
    _id: "img004",
    customerId: "customer123",
    category: "pooja room", 
    filename: "pooja1.jpg",
    path: "/uploads/customer123/pooja room/pooja1.jpg",
    uploadedAt: "2025-07-21",
    url: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop"
  }
];

const categories = ["Bedroom", "Kitchen", "Pooja Room", "Living Room", "Bathroom", "Dining Room"];

// Customer Form Component
const CustomerForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    images: {}
  });

  const [selectedFiles, setSelectedFiles] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (category, files) => {
    setSelectedFiles({
      ...selectedFiles,
      [category]: Array.from(files)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const customerId = `customer_${Date.now()}`;
    
    // Create customer object
    const newCustomer = {
      _id: customerId,
      name: formData.name.trim(),
      phone: formData.phone.trim(), 
      address: formData.address.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Create images array
    const newImages = [];
    Object.entries(selectedFiles).forEach(([category, files]) => {
      files.forEach((file, index) => {
        newImages.push({
          _id: `img_${Date.now()}_${category}_${index}`,
          customerId: customerId,
          category: category.toLowerCase(),
          filename: file.name,
          path: `/uploads/${customerId}/${category.toLowerCase()}/${file.name}`,
          uploadedAt: new Date().toISOString().split('T')[0],
          url: URL.createObjectURL(file)
        });
      });
    });

    console.log('Creating customer:', newCustomer);
    console.log('Creating images:', newImages);
    
    // Submit the data
    onSubmit({ customer: newCustomer, images: newImages });
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      address: '',
      images: {}
    });
    setSelectedFiles({});
  };

  return (
    <div style={{ 
      padding: '30px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <div style={{
          backgroundColor: '#667eea',
          padding: '12px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <User size={24} />
        </div>
        <h2 style={{ 
          margin: 0,
          color: '#2d3748',
          fontSize: '28px',
          fontWeight: '700'
        }}>Add New Customer</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '25px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontWeight: '600',
                fontSize: '14px'
              }}>Customer Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                color: '#4a5568',
                fontWeight: '600',
                fontSize: '14px'
              }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontWeight: '600',
              fontSize: '14px'
            }}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                outline: 'none',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div>
            <h3 style={{ 
              color: '#4a5568',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>Upload Images by Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {categories.map(category => (
                <div key={category} style={{
                  padding: '20px',
                  border: '2px dashed #cbd5e0',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <Folder size={20} style={{ color: '#667eea' }} />
                    <label style={{
                      fontWeight: '600',
                      color: '#4a5568',
                      fontSize: '16px'
                    }}>{category}</label>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(category, e.target.files)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {selectedFiles[category] && (
                    <div style={{ 
                      marginTop: '10px',
                      fontSize: '14px',
                      color: '#68d391'
                    }}>
                      {selectedFiles[category].length} files selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
            paddingTop: '20px'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f7fafc',
                color: '#4a5568',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#edf2f7'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f7fafc'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a67d8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
            >
              <Upload size={18} />
              Create Customer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Image Viewer Component
const ImageViewer = ({ image, isOpen, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  if (!isOpen || !image) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '24px'
        }}
      >
        <X size={24} />
      </button>

      {hasPrev && (
        <button
          onClick={onPrev}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div style={{ textAlign: 'center', maxWidth: '90vw', maxHeight: '90vh' }}>
        <img
          src={image.url}
          alt={image.filename}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '10px'
          }}
        />
        <div style={{ 
          color: 'white',
          marginTop: '20px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {image.filename}
        </div>
        <div style={{
          color: '#cbd5e0',
          fontSize: '14px',
          marginTop: '5px'
        }}>
          {image.category} • {image.uploadedAt}
        </div>
      </div>
    </div>
  );
};

// Room Gallery Component
const RoomGallery = ({ customer, category, images, onBack, onImageClick }) => {
  const roomImages = images.filter(img => 
    img.customerId === customer._id && 
    img.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 style={{ 
            margin: 0,
            color: '#2d3748',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            {category} Gallery
          </h2>
          <p style={{ 
            margin: '5px 0 0 0',
            color: '#718096',
            fontSize: '16px'
          }}>
            {customer.name} • {roomImages.length} images
          </p>
        </div>
      </div>

      {roomImages.length === 0 ? (
        <div style={{ 
          textAlign: 'center',
          padding: '60px 20px',
          color: '#a0aec0'
        }}>
          <Image size={64} style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No images found</h3>
          <p>No images have been uploaded for this room yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {roomImages.map(image => (
            <div
              key={image._id}
              onClick={() => onImageClick(image)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ 
                height: '200px',
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{ padding: '15px' }}>
                <h4 style={{ 
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  {image.filename}
                </h4>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  Uploaded on {image.uploadedAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Outlet Folder Component
const OutletFolder = ({ customer, onSelectRoom, onBack }) => {
  const [images] = useState(mockImages);
  
  const getRoomImageCount = (category) => {
    return images.filter(img => 
      img.customerId === customer._id && 
      img.category.toLowerCase() === category.toLowerCase()
    ).length;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{
          backgroundColor: '#667eea',
          padding: '12px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <Folder size={24} />
        </div>
        <div>
          <h2 style={{ 
            margin: 0,
            color: '#2d3748',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            📁 {customer.name}'s Portfolio
          </h2>
          <div style={{ 
            display: 'flex',
            gap: '20px',
            marginTop: '8px',
            fontSize: '14px',
            color: '#718096'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={14} /> {customer.phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} /> {customer.address}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} /> {customer.createdAt}
            </span>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {categories.map(category => {
          const imageCount = getRoomImageCount(category);
          return (
            <div
              key={category}
              onClick={() => onSelectRoom(category)}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                e.target.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.target.style.borderColor = 'transparent';
              }}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div style={{
                  backgroundColor: imageCount > 0 ? '#48bb78' : '#cbd5e0',
                  padding: '12px',
                  borderRadius: '10px',
                  color: 'white'
                }}>
                  <Folder size={20} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2d3748'
                  }}>
                    📁 {category}
                  </h3>
                  <p style={{ 
                    margin: '5px 0 0 0',
                    fontSize: '14px',
                    color: imageCount > 0 ? '#48bb78' : '#a0aec0'
                  }}>
                    {imageCount} images
                  </p>
                </div>
              </div>
              <div style={{
                height: '4px',
                backgroundColor: '#f0f0f0',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: imageCount > 0 ? '#48bb78' : '#e2e8f0',
                  width: `${Math.min(imageCount * 20, 100)}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Category Gallery Component
const CategoryGallery = ({ category, images, customers, onImageClick, onBack }) => {
  const categoryImages = images.filter(img => 
    img.category.toLowerCase() === category.toLowerCase()
  );

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c._id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{
          backgroundColor: '#667eea',
          padding: '12px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <Image size={24} />
        </div>
        <div>
          <h2 style={{ 
            margin: 0,
            color: '#2d3748',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            All {category} Designs
          </h2>
          <p style={{ 
            margin: '5px 0 0 0',
            color: '#718096',
            fontSize: '16px'
          }}>
            {categoryImages.length} images across all customers
          </p>
        </div>
      </div>

      {categoryImages.length === 0 ? (
        <div style={{ 
          textAlign: 'center',
          padding: '60px 20px',
          color: '#a0aec0'
        }}>
          <Image size={64} style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No {category.toLowerCase()} images found</h3>
          <p>No images have been uploaded for this category yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {categoryImages.map(image => (
            <div
              key={image._id}
              onClick={() => onImageClick(image)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ 
                height: '200px',
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{ padding: '15px' }}>
                <h4 style={{ 
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  {image.filename}
                </h4>
                <p style={{ 
                  margin: '0 0 5px 0',
                  fontSize: '14px',
                  color: '#667eea',
                  fontWeight: '500'
                }}>
                  {getCustomerName(image.customerId)}
                </p>
                <p style={{ 
                  margin: 0,
                  fontSize: '12px',
                  color: '#718096'
                }}>
                  {image.uploadedAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
const InteriorDesignSystem = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [images, setImages] = useState(mockImages);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerImages, setViewerImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCustomer = ({ customer, images: newImages }) => {
    console.log('Adding customer to state:', customer);
    console.log('Adding images to state:', newImages);
    
    // Update customers state
    setCustomers(prevCustomers => {
      const updated = [...prevCustomers, customer];
      console.log('Updated customers:', updated);
      return updated;
    });
    
    // Update images state
    setImages(prevImages => {
      const updated = [...prevImages, ...newImages];
      console.log('Updated images:', updated);
      return updated;
    });
    
    // Navigate back to dashboard
    setCurrentView('dashboard');
    
    // Show success message
    setTimeout(() => {
      alert(`Customer "${customer.name}" has been successfully added with ${newImages.length} images!`);
    }, 100);
  };

  const handleImageClick = (image) => {
    let relevantImages = [];
    
    if (selectedRoom && selectedCustomer) {
      relevantImages = images.filter(img => 
        img.customerId === selectedCustomer._id && 
        img.category.toLowerCase() === selectedRoom.toLowerCase()
      );
    } else if (selectedCategory) {
      relevantImages = images.filter(img => 
        img.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    } else {
      relevantImages = images;
    }
    
    const imageIndex = relevantImages.findIndex(img => img._id === image._id);
    setViewerImages(relevantImages);
    setViewerIndex(imageIndex);
    setViewerImage(image);
  };

  const handleNextImage = () => {
    if (viewerIndex < viewerImages.length - 1) {
      const nextIndex = viewerIndex + 1;
      setViewerIndex(nextIndex);
      setViewerImage(viewerImages[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    if (viewerIndex > 0) {
      const prevIndex = viewerIndex - 1;
      setViewerIndex(prevIndex);
      setViewerImage(viewerImages[prevIndex]);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (currentView) {
      case 'add-customer':
        return (
          <CustomerForm 
            onSubmit={handleAddCustomer}
            onCancel={() => setCurrentView('dashboard')}
          />
        );

      case 'outlet-folder':
        return (
          <OutletFolder
            customer={selectedCustomer}
            onSelectRoom={(room) => {
              setSelectedRoom(room);
              setCurrentView('room-gallery');
            }}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedCustomer(null);
            }}
          />
        );

      case 'room-gallery':
        return (
          <RoomGallery
            customer={selectedCustomer}
            category={selectedRoom}
            images={images}
            onBack={() => {
              setCurrentView('outlet-folder');
              setSelectedRoom(null);
            }}
            onImageClick={handleImageClick}
          />
        );

      case 'category-gallery':
        return (
          <CategoryGallery
            category={selectedCategory}
            images={images}
            customers={customers}
            onImageClick={handleImageClick}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedCategory(null);
            }}
          />
        );

      default:
        return (
          <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <div>
                <h1 style={{ 
                  margin: 0,
                  color: '#2d3748',
                  fontSize: '36px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Interior Design Portfolio
                </h1>
                <p style={{ 
                  margin: '8px 0 0 0',
                  color: '#718096',
                  fontSize: '18px'
                }}>
                  Manage customer projects and showcase your work
                </p>
              </div>
              <button
                onClick={() => setCurrentView('add-customer')}
                style={{
                  padding: '15px 25px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5a67d8';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#667eea';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                <User size={20} />
                Add New Customer
              </button>
            </div>

            {/* Global Category Buttons */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ 
                color: '#4a5568',
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                Browse by Category
              </h3>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                {categories.map(category => {
                  const categoryCount = images.filter(img => 
                    img.category.toLowerCase() === category.toLowerCase()
                  ).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentView('category-gallery');
                      }}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: categoryCount > 0 ? '#667eea' : '#f7fafc',
                        color: categoryCount > 0 ? 'white' : '#718096',
                        border: categoryCount > 0 ? 'none' : '2px solid #e2e8f0',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (categoryCount > 0) {
                          e.target.style.backgroundColor = '#5a67d8';
                          e.target.style.transform = 'translateY(-2px)';
                        } else {
                          e.target.style.borderColor = '#cbd5e0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (categoryCount > 0) {
                          e.target.style.backgroundColor = '#667eea';
                          e.target.style.transform = 'translateY(0)';
                        } else {
                          e.target.style.borderColor = '#e2e8f0';
                        }
                      }}
                    >
                      {category}
                      {categoryCount > 0 && (
                        <span style={{
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {categoryCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search 
                  size={20} 
                  style={{ 
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a0aec0'
                  }} 
                />
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px 12px 50px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Customer List */}
            <div>
              <h3 style={{ 
                color: '#4a5568',
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                Customer Portfolios ({filteredCustomers.length})
              </h3>
              
              {filteredCustomers.length === 0 ? (
                <div style={{ 
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#a0aec0'
                }}>
                  <User size={64} style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
                    {searchTerm ? 'No customers found' : 'No customers yet'}
                  </h3>
                  <p>
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Start by adding your first customer to build your portfolio'
                    }
                  </p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '25px'
                }}>
                  {filteredCustomers.map(customer => {
                    const customerImages = images.filter(img => img.customerId === customer._id);
                    const totalImages = customerImages.length;
                    
                    return (
                      <div
                        key={customer._id}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCurrentView('outlet-folder');
                        }}
                        style={{
                          backgroundColor: 'white',
                          padding: '25px',
                          borderRadius: '15px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '2px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-8px)';
                          e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                          e.target.style.borderColor = '#667eea';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                          e.target.style.borderColor = 'transparent';
                        }}
                      >
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '15px',
                          marginBottom: '20px'
                        }}>
                          <div style={{
                            backgroundColor: totalImages > 0 ? '#48bb78' : '#cbd5e0',
                            padding: '15px',
                            borderRadius: '12px',
                            color: 'white',
                            minWidth: '50px'
                          }}>
                            <Folder size={24} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              margin: '0 0 8px 0',
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#2d3748'
                            }}>
                              📁 {customer.name}
                            </h4>
                            <div style={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '5px',
                              fontSize: '14px',
                              color: '#718096'
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Phone size={14} /> {customer.phone}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={14} /> {customer.address}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} /> Created {customer.createdAt}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '15px',
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <span style={{ 
                            fontSize: '16px',
                            fontWeight: '600',
                            color: totalImages > 0 ? '#48bb78' : '#a0aec0'
                          }}>
                            {totalImages} images total
                          </span>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#667eea',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            View Portfolio
                            <ChevronRight size={16} />
                          </div>
                        </div>

                        {/* Category breakdown */}
                        <div style={{ marginTop: '15px' }}>
                          <div style={{ 
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            {categories.map(category => {
                              const categoryCount = customerImages.filter(img => 
                                img.category.toLowerCase() === category.toLowerCase()
                              ).length;
                              
                              if (categoryCount === 0) return null;
                              
                              return (
                                <span
                                  key={category}
                                  style={{
                                    backgroundColor: '#f0f4f8',
                                    color: '#4a5568',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                  }}
                                >
                                  {category}: {categoryCount}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {renderContent()}
      
      <ImageViewer
        image={viewerImage}
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        hasNext={viewerIndex < viewerImages.length - 1}
        hasPrev={viewerIndex > 0}
      />
    </div>
  );
};



export default InteriorDesignSystem;