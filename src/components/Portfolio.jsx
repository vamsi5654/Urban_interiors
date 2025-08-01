import React, { useState, useEffect } from 'react';
import { Filter, Star, X, Eye, Calendar, MapPin, Layers, Search, Grid, List, ArrowRight, Zap, Sparkles, Home, Users, Image as ImageIcon, Building } from 'lucide-react';

// Mock Firebase data - replace with actual Firebase integration
const mockProjects = [
  {
    id: '1',
    project: 'Modern Villa',
    address: 'Juhu, Mumbai',
    clientCount: 3,
    rooms: {
      bedroom: [
        { imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', filename: 'master-bedroom-1.jpg' },
        { imageUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400', filename: 'guest-bedroom.jpg' }
      ],
      kitchen: [
        { imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', filename: 'modern-kitchen.jpg' }
      ],
      livingRoom: [
        { imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', filename: 'living-area.jpg' }
      ]
    }
  },
  {
    id: '2',
    project: 'Luxury Apartment',
    address: 'Bandra, Mumbai',
    clientCount: 5,
    rooms: {
      bedroom: [
        { imageUrl: 'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=400', filename: 'luxury-bedroom.jpg' }
      ],
      kitchen: [
        { imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', filename: 'luxury-kitchen.jpg' }
      ]
    }
  }
];

// Futuristic Button Component
const FuturisticButton = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) => {
  const baseStyle = {
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)'
    },
    accent: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)'
    },
    ghost: {
      background: 'rgba(102, 126, 234, 0.1)',
      color: '#667eea',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      backdropFilter: 'blur(10px)'
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
          e.target.style.transform = 'translateY(-2px) scale(1.05)';
          e.target.style.filter = 'brightness(1.1)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.filter = 'brightness(1)';
        }
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s'
      }} />
      {children}
    </button>
  );
};

// Project Card Component
// Enhanced Project Card Component with Image Preview
const ProjectCard = ({ project, onClick }) => {
  const totalImages = Object.values(project.rooms || {}).reduce((total, images) => total + (images?.length || 0), 0);
  const roomCount = Object.keys(project.rooms || {}).length;

  // Get entrance image specifically from the database
  const getPreviewImage = () => {
    // First, try to get entrance image from rooms
    if (project.rooms?.entrance && project.rooms.entrance.length > 0) {
      const entranceImage = project.rooms.entrance.find(img => img.imageUrl);
      if (entranceImage) {
        return entranceImage.imageUrl;
      }
    }

    // Alternative: if entrance images are stored differently in your DB
    // Check for entrance-specific field in project object
    if (project.entranceImage) {
      return project.entranceImage;
    }

    // Fallback: look for images with entrance-related names/tags
    const roomEntries = Object.entries(project.rooms || {});
    for (let [roomName, images] of roomEntries) {
      if (roomName.toLowerCase().includes('entrance') || 
          roomName.toLowerCase().includes('entry') ||
          roomName.toLowerCase().includes('front')) {
        if (images && images.length > 0 && images[0].imageUrl) {
          return images[0].imageUrl;
        }
      }
    }

    // Final fallback: look for images tagged as entrance
    for (let room of Object.values(project.rooms || {})) {
      if (room && room.length > 0) {
        const entranceTagged = room.find(img => 
          img.tags?.includes('entrance') || 
          img.category === 'entrance' ||
          img.type === 'entrance'
        );
        if (entranceTagged && entranceTagged.imageUrl) {
          return entranceTagged.imageUrl;
        }
      }
    }

    // Last resort: return first available image
    const allRooms = Object.values(project.rooms || {});
    for (let room of allRooms) {
      if (room && room.length > 0 && room[0].imageUrl) {
        return room[0].imageUrl;
      }
    }

    return null;
  };

  const previewImage = getPreviewImage();

  return (
    <div
      onClick={() => onClick(project)}
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        height: '480px',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 30px 80px rgba(102, 126, 234, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Hero Image Section */}
      <div style={{
        height: '220px',
        position: 'relative',
        overflow: 'hidden',
        background: previewImage 
          ? `url(${previewImage})`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Overlay Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.6) 100%)',
          backdropFilter: 'blur(1px)'
        }} />
        
        {/* Project Category Badge */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#667eea',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Interior Design
        </div>

        {/* Image Count Badge */}
        {totalImages > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a202c',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ImageIcon size={16} color="#667eea" />
            {totalImages} Photos
          </div>
        )}

        {/* Placeholder for no image */}
        {!previewImage && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '48px',
            opacity: 0.8
          }}>
            🏠
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={{
        padding: '28px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Project Title & Location */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            margin: 0,
            fontSize: '26px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            {project.project}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '16px'
          }}>
            <MapPin size={18} color="#94a3b8" />
            {project.address}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '16px',
            padding: '18px 12px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'skewX(-45deg) translateX(-100%)',
              transition: 'transform 0.6s ease'
            }} />
            <Users size={20} style={{ marginBottom: '8px', opacity: 0.9 }} />
            <div style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {project.clientCount || 1}
            </div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: 0.8
            }}>
              Clients
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            borderRadius: '16px',
            padding: '18px 12px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'skewX(-45deg) translateX(-100%)',
              transition: 'transform 0.6s ease'
            }} />
            <ImageIcon size={20} style={{ marginBottom: '8px', opacity: 0.9 }} />
            <div style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {totalImages}
            </div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: 0.8
            }}>
              Images
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            borderRadius: '16px',
            padding: '18px 12px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'skewX(-45deg) translateX(-100%)',
              transition: 'transform 0.6s ease'
            }} />
            <Home size={20} style={{ marginBottom: '8px', opacity: 0.9 }} />
            <div style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {roomCount}
            </div>
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: 0.8
            }}>
              Rooms
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto' }}>
          <FuturisticButton 
            variant="primary" 
            size="md" 
            style={{ 
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              justifyContent: 'center'
            }}
          >
            <Eye size={18} />
            Explore Project
            <ArrowRight size={18} />
          </FuturisticButton>
        </div>
      </div>
    </div>
  );
};

// Project Gallery Component
const ProjectGallery = ({ project, onBack }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const roomTypes = [
    { key: 'bedroom', label: 'Bedroom', icon: '🛏️', color: '#667eea' },
    { key: 'kitchen', label: 'Kitchen', icon: '🍳', color: '#f093fb' },
    { key: 'poojaRoom', label: 'Pooja Room', icon: '🕉️', color: '#4facfe' },
    { key: 'livingRoom', label: 'Living Room', icon: '🛋️', color: '#f5576c' },
    { key: 'bathroom', label: 'Bathroom', icon: '🚿', color: '#764ba2' },
    { key: 'diningRoom', label: 'Dining Room', icon: '🍽️', color: '#00f2fe' }
  ];

  const openImageViewer = (room, index) => {
    setSelectedRoom(room);
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <FuturisticButton variant="ghost" onClick={onBack}>
              ← Back to Portfolio
            </FuturisticButton>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#64748b'
            }}>
              <Sparkles size={24} color="#4facfe" />
              <span>
                {Object.values(project.rooms || {}).reduce((total, images) => total + (images?.length || 0), 0)} Total Images
              </span>
            </div>
          </div>
          
          <h1 style={{
            margin: 0,
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            {project.project}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '18px'
          }}>
            <MapPin size={20} />
            {project.address}
          </div>
        </div>

        {/* Room Categories */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}>
          {roomTypes.map(roomType => {
            const images = project.rooms?.[roomType.key] || [];
            if (images.length === 0) return null;

            return (
              <div
                key={roomType.key}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '32px',
                    background: `${roomType.color}15`,
                    borderRadius: '12px',
                    padding: '12px',
                    border: `1px solid ${roomType.color}30`
                  }}>
                    {roomType.icon}
                  </div>
                  <div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      {roomType.label}
                    </h3>
                    <p style={{
                      margin: '4px 0 0 0',
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      {images.length} image{images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '12px'
                }}>
                  {images.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      onClick={() => openImageViewer(images, index)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid #e2e8f0'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = roomType.color;
                        e.currentTarget.style.boxShadow = `0 8px 32px ${roomType.color}30`;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
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
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(135deg, ${roomType.color}, ${roomType.color}CC)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px'
                        }}>
                          📷
                        </div>
                      )}
                    </div>
                  ))}
                  {images.length > 6 && (
                    <div style={{
                      aspectRatio: '1',
                      borderRadius: '12px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      +{images.length - 6}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Image Viewer Modal */}
        {viewerOpen && selectedRoom && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(10px)'
          }}>
            <button
              onClick={() => setViewerOpen(false)}
              style={{
                position: 'absolute',
                top: '32px',
                right: '32px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
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
                maxWidth: '800px',
                maxHeight: '600px',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '24px',
                border: '2px solid rgba(255,255,255,0.1)'
              }}>
                {selectedRoom[currentImageIndex]?.imageUrl ? (
                  <img
                    src={selectedRoom[currentImageIndex].imageUrl}
                    alt={selectedRoom[currentImageIndex].filename}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '400px',
                    height: '300px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px'
                  }}>
                    📷
                  </div>
                )}
              </div>

              <div style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
                  {selectedRoom[currentImageIndex]?.filename}
                </h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                  {currentImageIndex + 1} of {selectedRoom.length}
                </p>
              </div>

              {selectedRoom.length > 1 && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <FuturisticButton
                    variant="ghost"
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                  >
                    Previous
                  </FuturisticButton>
                  <FuturisticButton
                    variant="ghost"
                    onClick={() => setCurrentImageIndex(Math.min(selectedRoom.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === selectedRoom.length - 1}
                  >
                    Next
                  </FuturisticButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Portfolio Component
const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and group projects
    setTimeout(() => {
      const groupedProjects = mockProjects.reduce((acc, project) => {
        const existingProject = acc.find(p => p.project === project.project);
        if (existingProject) {
          // Merge rooms and increment client count
          Object.keys(project.rooms || {}).forEach(roomType => {
            if (!existingProject.rooms[roomType]) {
              existingProject.rooms[roomType] = [];
            }
            existingProject.rooms[roomType] = [
              ...existingProject.rooms[roomType],
              ...(project.rooms[roomType] || [])
            ];
          });
          existingProject.clientCount = (existingProject.clientCount || 1) + (project.clientCount || 1);
        } else {
          acc.push({ ...project });
        }
        return acc;
      }, []);
      
      setProjects(groupedProjects);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique project categories
  const categories = ['All', ...new Set(projects.map(p => p.project).filter(Boolean))];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesFilter = filter === 'All' || project.project === filter;
      const matchesSearch = project.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'Date') return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      if (sortBy === 'Name') return a.project.localeCompare(b.project);
      if (sortBy === 'Images') {
        const imagesA = Object.values(a.rooms || {}).reduce((total, images) => total + (images?.length || 0), 0);
        const imagesB = Object.values(b.rooms || {}).reduce((total, images) => total + (images?.length || 0), 0);
        return imagesB - imagesA;
      }
      return 0;
    });

  // Calculate stats
  const totalProjects = projects.length;
  const totalClients = projects.reduce((sum, p) => sum + (p.clientCount || 1), 0);
  const totalImages = projects.reduce((sum, p) => 
    sum + Object.values(p.rooms || {}).reduce((roomSum, images) => roomSum + (images?.length || 0), 0), 0
  );
  const totalRooms = projects.reduce((sum, p) => sum + Object.keys(p.rooms || {}).length, 0);

  if (selectedProject) {
    return (
      <ProjectGallery 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px'
          }}>
            Urbann Portfolio
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore our collection of stunning interior design projects
          </p>
        </div>

        {/* Stats Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '24px'
              }}>
                <Building />
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                {totalProjects}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Projects Done
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '24px'
              }}>
                <Users />
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                {totalClients}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Happy Clients
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '24px'
              }}>
                <ImageIcon />
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                {totalImages}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Total Images
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #764ba2, #667eea)',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '24px'
              }}>
                <Home />
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                {totalRooms}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Rooms Designed
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#1a202c',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                color: '#1a202c',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              {categories.map(category => (
                <option key={category} value={category} style={{ background: 'white', color: '#1a202c' }}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                color: '#1a202c',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Date" style={{ background: 'white', color: '#1a202c' }}>Latest First</option>
              <option value="Name" style={{ background: 'white', color: '#1a202c' }}>By Name</option>
              <option value="Images" style={{ background: 'white', color: '#1a202c' }}>Most Images</option>
            </select>

            {/* View Mode */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <FuturisticButton
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </FuturisticButton>
              <FuturisticButton
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </FuturisticButton>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#64748b'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ fontSize: '18px', margin: 0 }}>Loading amazing projects...</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div style={{
            marginBottom: '32px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '16px'
          }}>
            <Zap size={20} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#667eea' }} />
            Found {filteredProjects.length} incredible project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Projects Grid/List */}
        {!loading && filteredProjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '20px',
            border: '2px dashed #e2e8f0'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              opacity: 0.5
            }}>
              🎨
            </div>
            <h3 style={{
              fontSize: '24px',
              color: '#1a202c',
              margin: '0 0 16px 0'
            }}>
              No projects found
            </h3>
            <p style={{
              color: '#64748b',
              margin: 0
            }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' 
                ? 'repeat(auto-fit, minmax(350px, 1fr))' 
                : '1fr',
              gap: viewMode === 'grid' ? '24px' : '16px'
            }}
          >
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        /* Custom select styling for better appearance */
        select option {
          background: white;
          color: #1a202c;
          padding: 8px;
        }

        /* Input placeholder styling */
        input::placeholder {
          color: #94a3b8;
        }

        /* Focus states */
        input:focus, select:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;