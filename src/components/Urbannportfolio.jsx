import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, X, ChevronLeft, ChevronRight, MapPin, Eye, Loader } from 'lucide-react';
import { db } from '../components/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const UrbanPortfolio = () => {
  const [view, setView] = useState('overview');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cloudinary configuration
  const cloudName = 'omsi';
  const uploadPreset = 'urbann_preset';

  // Room types mapping from your existing system
  const roomTypes = [
    { key: 'bedroom', label: 'Bedroom' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'poojaRoom', label: 'Pooja Room' },
    { key: 'livingRoom', label: 'Living Room' },
    { key: 'bathroom', label: 'Bathroom' },
    { key: 'diningRoom', label: 'Dining Room' }
  ];

  useEffect(() => {
    fetchFirestoreCustomers();
  }, []);

  const fetchFirestoreCustomers = () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(db, "customers"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const customers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const processedProjects = processCustomerData(customers);
        setProjects(processedProjects);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Error fetching from Firestore:', err);
      setError('Failed to load customer data from Firestore');
      setLoading(false);
    }
  };

 const processCustomerData = (customers) => {
  const projectsMap = {};
  
  customers.forEach(customer => {
    const projectName = customer.project || customer.name + "'s Project";
    
    if (!projectsMap[projectName]) {
      projectsMap[projectName] = {
        name: projectName,
        address: customer.address || 'Address not provided',
        entranceImage: null,
        categoryImages: {},
        totalImages: 0,
        createdAt: customer.createdAt,
        customers: []
      };
    }
    
    // Add customer to project
    projectsMap[projectName].customers.push(customer);
    
    // Process room images
    if (customer.rooms) {
      Object.entries(customer.rooms).forEach(([roomKey, images]) => {
        if (images && Array.isArray(images) && images.length > 0) {
          // Handle entranceimage specifically (keep original key for entrance images)
          let roomLabel;
          if (roomKey === 'entranceimage' || roomKey === 'entrance' || roomKey === 'Entrance') {
            roomLabel = 'entranceimage'; // Keep as entranceimage for easy identification
          } else {
            // Get room display name for other rooms
            const roomType = roomTypes.find(r => r.key === roomKey);
            roomLabel = roomType ? roomType.label : roomKey.charAt(0).toUpperCase() + roomKey.slice(1);
          }
          
          if (!projectsMap[projectName].categoryImages[roomLabel]) {
            projectsMap[projectName].categoryImages[roomLabel] = [];
          }
          
          // Add images with customer context
          images.forEach(image => {
            if (image.imageUrl) {
              projectsMap[projectName].categoryImages[roomLabel].push({
                url: image.imageUrl,
                filename: image.filename,
                uploadedAt: image.uploadedAt,
                customerName: customer.name,
                customerId: customer.id
              });
              projectsMap[projectName].totalImages++;
            }
          });
        }
      });
    }
  });
  
  // UPDATED: Set entrance images - prioritize entranceimage folder first
  Object.values(projectsMap).forEach(project => {
    if (!project.entranceImage) {
      console.log(`Processing entrance image for project: ${project.name}`);
      console.log('Available categories:', Object.keys(project.categoryImages));
      
      // First priority: Look for images in 'entranceimage' folder
      const entranceImages = project.categoryImages['entranceimage'] || 
                            project.categoryImages['entrance'] ||
                            project.categoryImages['Entrance'] ||
                            project.categoryImages['EntranceImage'];
      
      if (entranceImages && entranceImages.length > 0) {
        console.log(`Found ${entranceImages.length} entrance images`);
        // Pick the first entrance image (or you can pick random)
        project.entranceImage = entranceImages[0].url;
        console.log(`Set entrance image: ${project.entranceImage}`);
      } else {
        console.log('No entrance images found, using fallback');
        
        // Fallback: Try to find other room images in priority order
        const fallbackImages = project.categoryImages['Living Room'] ||
                              project.categoryImages['Bedroom'] ||
                              project.categoryImages['Kitchen'] ||
                              project.categoryImages['Dining Room'] ||
                              Object.values(project.categoryImages)[0];
                              
        if (fallbackImages && fallbackImages.length > 0) {
          project.entranceImage = fallbackImages[0].url;
          console.log(`Using fallback image: ${project.entranceImage}`);
        } else {
          // Final fallback to a placeholder
          project.entranceImage = `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format&q=80`;
          console.log('Using placeholder image');
        }
      }
    }
  });
  
  return Object.values(projectsMap);
};

  // Calculate stats
  const calculateStats = () => {
    const totalClients = projects.reduce((total, project) => total + project.customers.length, 0);
    let totalImages = 0;
    const uniqueRooms = new Set();
    
    projects.forEach(project => {
      totalImages += project.totalImages;
      Object.keys(project.categoryImages).forEach(roomType => {
        uniqueRooms.add(roomType);
      });
    });

    return {
      totalProjects: projects.length,
      totalClients,
      totalImages,
      totalRooms: uniqueRooms.size
    };
  };

  const stats = calculateStats();

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'images') return b.totalImages - a.totalImages;
      if (sortBy === 'date') return new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - new Date(a.createdAt?.toDate?.() || a.createdAt || 0);
      return 0;
    });

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

  const InfoCard = ({ title, value, icon }) => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      borderRadius: '12px',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', opacity: 0.9 }}>
        {title}
      </div>
    </div>
  );

  const ProjectCard = ({ project }) => (
    <div 
      onClick={() => {
        setSelectedProject(project);
        setView('project');
      }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        background: 'white',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        height: '200px',
        backgroundImage: `url(${project.entranceImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Eye size={12} />
          {project.totalImages}
        </div>
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(102, 126, 234, 0.9)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {project.customers.length} client{project.customers.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '18px', 
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          {project.name}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#666',
          fontSize: '14px',
          marginBottom: '8px'
        }}>
          <MapPin size={14} />
          {project.address}
        </div>
        <div style={{
            fontSize: '12px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between'
            }}>
            {/*<span>
                {Object.keys(project.categoryImages).filter(roomType => 
                roomType !== 'entranceimage' && 
                roomType !== 'entrance' && 
                roomType !== 'Entrance' &&
                roomType !== 'EntranceImage'
                ).length} room types
            </span>*/}
            <span>
                {project.customers.length} client{project.customers.length !== 1 ? 's' : ''}
            </span>
            <span>{formatTimestamp(project.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  const RoomCard = ({ roomType, images }) => (
    <div 
      onClick={() => {
        setSelectedRoom({ roomType, images });
        setCurrentImageIndex(0);
      }}
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        height: '150px',
        backgroundImage: `url(${images[0]?.url || images[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {images.length} images
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#1a1a1a'
        }}>
          {roomType}
        </h4>
        <div style={{ fontSize: '12px', color: '#666' }}>
          From {new Set(images.map(img => img.customerName)).size} customer{new Set(images.map(img => img.customerName)).size !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );

  const ImageModal = () => {
    if (!selectedRoom) return null;

    const nextImage = () => {
      setCurrentImageIndex((prev) => 
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    };

    const currentImage = selectedRoom.images[currentImageIndex];
    const imageUrl = currentImage?.url || currentImage;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setSelectedRoom(null)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '12px',
            borderRadius: '50%',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          <X size={24} />
        </button>
        
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          {selectedRoom.roomType}
        </div>

        <div style={{
          position: 'absolute',
          top: '60px',
          left: '20px',
          color: 'white',
          fontSize: '14px',
          opacity: 0.8
        }}>
          {currentImage?.customerName && `Customer: ${currentImage.customerName}`}
        </div>

        {selectedRoom.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <img
          src={imageUrl}
          alt={`${selectedRoom.roomType} ${currentImageIndex + 1}`}
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />

        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          <div>{currentImageIndex + 1} / {selectedRoom.images.length}</div>
          {currentImage?.filename && (
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              {currentImage.filename}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <Loader size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <h2 style={{ color: '#666', fontSize: '18px', margin: 0 }}>
          Loading portfolio from Firestore...
        </h2>
      </div>
    );
  }

  if (view === 'overview') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              color: '#1a1a1a',
              margin: '0 0 12px 0'
            }}>
              Urban Portfolio
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              margin: 0
            }}>
              Showcasing our finest interior design projects
            </p>
            {error && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#fff3cd',
                color: '#856404',
                borderRadius: '8px',
                border: '1px solid #ffeaa7',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <InfoCard title="Projects Done" value={stats.totalClients + 800} />
            <InfoCard title="Happy Clients" value={stats.totalClients + 800} />
            <InfoCard title="Total Images" value={stats.totalImages + 1800} />
            <InfoCard title="Rooms Designed" value={stats.totalRooms + 700} />
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Search 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="name">Sort by Name</option>
              <option value="images">Sort by Images</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* Project Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.name + index} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>No projects found</h3>
              <p style={{ margin: 0 }}>Try adjusting your search terms or add some customers first</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'project' && selectedProject) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => setView('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              border: '1px solid #e1e5e9',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#666'
            }}
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </button>

          {/* Project Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#1a1a1a',
              margin: '0 0 12px 0'
            }}>
              {selectedProject.name}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#666',
                fontSize: '16px'
              }}>
                <MapPin size={16} />
                {selectedProject.address}
              </div>
              <div style={{
                background: '#667eea',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px'
                }}>
                {selectedProject.totalImages - (selectedProject.categoryImages['entranceimage']?.length || 0)} Total Images
              </div>
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                {selectedProject.customers.length} Client{selectedProject.customers.length !== 1 ? 's' : ''}
              </div>
            </div>
            {selectedProject.customers.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                Clients: {selectedProject.customers.map(c => c.name).join(', ')}
              </div>
            )}
          </div>

          {/* Room Categories Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
            }}>
            {Object.entries(selectedProject.categoryImages)
                .filter(([roomType]) => {
                // Hide entrance image folder from display
                return roomType !== 'entranceimage' && 
                        roomType !== 'entrance' && 
                        roomType !== 'Entrance' &&
                        roomType !== 'EntranceImage';
                })
                .map(([roomType, images]) => (
                <RoomCard key={roomType} roomType={roomType} images={images} />
                ))}
            </div>
        </div>

        <ImageModal />
      </div>
    );
  }

  return null;
};

export default UrbanPortfolio;