import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query } from "firebase/firestore";
import Services from './Services';
import Testimonials from './Testimonials';  

// Room types configuration
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

// Default images for each category
const defaultImages = {
  bedroom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Crect fill='%23d0d0d0' x='50' y='120' width='300' height='120' rx='10'/%3E%3Crect fill='%23e0e0e0' x='70' y='100' width='260' height='20' rx='10'/%3E%3Crect fill='%23c0c0c0' x='30' y='60' width='40' height='80' rx='5'/%3E%3Crect fill='%23c0c0c0' x='330' y='60' width='40' height='80' rx='5'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EBedroom%3C/text%3E%3C/svg%3E",
  kitchen: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f5f5' width='400' height='300'/%3E%3Crect fill='%23d0d0d0' x='20' y='50' width='360' height='30' rx='5'/%3E%3Crect fill='%23e0e0e0' x='30' y='90' width='100' height='80' rx='5'/%3E%3Crect fill='%23e0e0e0' x='150' y='90' width='100' height='80' rx='5'/%3E%3Crect fill='%23e0e0e0' x='270' y='90' width='100' height='80' rx='5'/%3E%3Crect fill='%23c0c0c0' x='50' y='200' width='300' height='50' rx='5'/%3E%3Ctext x='200' y='280' text-anchor='middle' font-size='16' fill='%23888'%3EKitchen%3C/text%3E%3C/svg%3E",
  poojaRoom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23fdf6e3' width='400' height='300'/%3E%3Crect fill='%23d4af37' x='150' y='80' width='100' height='120' rx='10'/%3E%3Crect fill='%23b8860b' x='170' y='60' width='60' height='40' rx='5'/%3E%3Ccircle fill='%23ff6b35' cx='200' cy='150' r='15'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EPooja Room%3C/text%3E%3C/svg%3E",
  livingRoom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Crect fill='%23d0d0d0' x='50' y='150' width='300' height='80' rx='10'/%3E%3Crect fill='%23e0e0e0' x='70' y='130' width='260' height='20' rx='10'/%3E%3Crect fill='%23c0c0c0' x='150' y='80' width='100' height='70' rx='5'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3ELiving Room%3C/text%3E%3C/svg%3E",
  bathroom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e6f3ff' width='400' height='300'/%3E%3Crect fill='%23b3d9ff' x='50' y='120' width='120' height='80' rx='10'/%3E%3Crect fill='%2366b3ff' x='230' y='100' width='120' height='100' rx='10'/%3E%3Crect fill='%234da6ff' x='80' y='80' width='60' height='40' rx='5'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EBathroom%3C/text%3E%3C/svg%3E",
  diningRoom: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23fff8dc' width='400' height='300'/%3E%3Cellipse fill='%23deb887' cx='200' cy='150' rx='120' ry='40'/%3E%3Crect fill='%23cd853f' x='190' y='150' width='20' height='60'/%3E%3Crect fill='%23d2b48c' x='120' y='120' width='30' height='80'/%3E%3Crect fill='%23d2b48c' x='250' y='120' width='30' height='80'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EDining Room%3C/text%3E%3C/svg%3E",
  balcony: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e6ffe6' width='400' height='300'/%3E%3Crect fill='%23b3ffb3' x='20' y='200' width='360' height='80'/%3E%3Crect fill='%2380ff80' x='50' y='50' width='300' height='20'/%3E%3Crect fill='%2366ff66' x='100' y='100' width='200' height='100' rx='10'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EBalcony%3C/text%3E%3C/svg%3E",
  gym: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Crect fill='%23666' x='150' y='140' width='100' height='20' rx='10'/%3E%3Ccircle fill='%23333' cx='130' cy='150' r='20'/%3E%3Ccircle fill='%23333' cx='270' cy='150' r='20'/%3E%3Crect fill='%23999' x='80' y='200' width='240' height='40' rx='5'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EGym%3C/text%3E%3C/svg%3E",
  playArea: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23fff0f5' width='400' height='300'/%3E%3Ccircle fill='%23ff69b4' cx='150' cy='120' r='30'/%3E%3Crect fill='%23ffc0cb' x='220' y='90' width='60' height='60' rx='10'/%3E%3Ctriangle fill='%23ff1493' points='200,180 180,220 220,220'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EPlay Area%3C/text%3E%3C/svg%3E",
  garden: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0fff0' width='400' height='300'/%3E%3Crect fill='%2390ee90' x='0' y='220' width='400' height='80'/%3E%3Ccircle fill='%23228b22' cx='120' cy='180' r='40'/%3E%3Ccircle fill='%2332cd32' cx='280' cy='160' r='35'/%3E%3Crect fill='%238b4513' x='195' y='180' width='10' height='40'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EGarden%3C/text%3E%3C/svg%3E",
  entranceImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f5dc' width='400' height='300'/%3E%3Crect fill='%23daa520' x='150' y='60' width='100' height='180' rx='5'/%3E%3Crect fill='%23b8860b' x='160' y='80' width='80' height='120' rx='5'/%3E%3Ccircle fill='%23ff6347' cx='220' cy='140' r='5'/%3E%3Ctext x='200' y='270' text-anchor='middle' font-size='16' fill='%23888'%3EEntrance%3C/text%3E%3C/svg%3E"
};

// Gallery Component (instead of modal)
const Gallery = ({ category, images, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Gallery Header */}
      <section style={{
        padding: '2rem 0',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <button
              onClick={onBack}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
            >
              ← Back to Projects
            </button>
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            color: '#2c3e50',
            margin: '0',
            textAlign: 'center'
          }}>
            {category} Gallery
          </h1>
        </div>
      </section>

      {/* Gallery Content */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {images.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem',
                color: '#bdc3c7'
              }}>📷</div>
              <h3 style={{ 
                margin: '0 0 1rem 0',
                color: '#2c3e50',
                fontSize: '1.5rem'
              }}>
                No {category.toLowerCase()} images available
              </h3>
              <p style={{ 
                margin: 0,
                color: '#7f8c8d',
                fontSize: '1.1rem'
              }}>
                Images will appear here once they are uploaded to this category
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {images.map((image, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    height: '250px',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={image.imageUrl} 
                      alt={`${category} image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ 
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ 
                      margin: '0',
                      color: '#2c3e50',
                      fontSize: '1rem'
                    }}>
                      {category} Design {index + 1}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Viewer Modal */}
      {currentImageIndex !== null && images.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '2rem'
        }}>
          <button
            onClick={() => setCurrentImageIndex(null)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              fontSize: '1.5rem',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div style={{ 
            maxWidth: '90vw', 
            maxHeight: '90vh', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img 
              src={images[currentImageIndex].imageUrl} 
              alt={`${category} image ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                marginBottom: '1rem',
                borderRadius: '10px'
              }}
            />

            {images.length > 1 && (
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center'
              }}>
                <button 
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    opacity: currentImageIndex === 0 ? 0.5 : 1,
                    fontSize: '1rem'
                  }}
                >
                  ← Previous
                </button>
                <span style={{ 
                  color: 'white', 
                  padding: '0.5rem 1rem',
                  fontSize: '1rem'
                }}>
                  {currentImageIndex + 1} / {images.length}
                </span>
                <button 
                  onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === images.length - 1}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    cursor: currentImageIndex === images.length - 1 ? 'not-allowed' : 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    opacity: currentImageIndex === images.length - 1 ? 0.5 : 1,
                    fontSize: '1rem'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [customers, setCustomers] = useState([]);
  const [showGallery, setShowGallery] = useState({ isOpen: false, category: '', images: [] });
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pinCode: '',
    whatsappUpdates: true
  });

  // Fetch customers data from Firebase
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      whatsappUpdates: e.target.checked
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  // Function to get category images from all customers
  const getCategoryImages = (categoryKey) => {
  const categoryImages = [];
  customers.forEach(customer => {
    if (customer.rooms && customer.rooms[categoryKey]) {
      customer.rooms[categoryKey].forEach(image => {
        categoryImages.push({
          ...image,
          customerName: customer.name,
          customerId: customer.id
        });
      });
    }
  });
  return categoryImages;
};

  // Function to get background image for a category
  const getCategoryBackgroundImage = (categoryKey) => {
  const categoryImages = getCategoryImages(categoryKey);
  if (categoryImages.length > 0) {
    // Return the first image from the category
    return categoryImages[0].imageUrl;
  }
  // Return default image if no images available
  return defaultImages[categoryKey] || defaultImages.bedroom;
};

  // Function to handle category click
  const handleCategoryClick = (roomType) => {
    const categoryImages = getCategoryImages(roomType.key);
    setShowGallery({
      isOpen: true,
      category: roomType.label,
      images: categoryImages
    });
  };

  // Get categories to display (first 8 excluding entranceImage)
  const getDisplayCategories = () => {
    const availableCategories = roomTypes.filter(room => room.key !== 'entranceImage');
    return showAllCategories ? availableCategories : availableCategories.slice(0, 8);
  };

  const isMediumAndAbove = windowWidth >= 768;

  // If gallery is open, show gallery component
  if (showGallery.isOpen) {
    return (
      <Gallery
        category={showGallery.category}
        images={showGallery.images}
        onBack={() => setShowGallery({ isOpen: false, category: '', images: [] })}
      />
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden'
      }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 800%27%3E%3Crect fill=%27%23f0f0f0%27 width=%271200%27 height=%27800%27/%3E%3Cg fill=%27%23d0d0d0%27%3E%3Crect x=%27100%27 y=%27100%27 width=%27400%27 height=%27300%27 rx=%2715%27/%3E%3Crect x=%27520%27 y=%27100%27 width=%27580%27 height=%27200%27 rx=%2715%27/%3E%3Crect x=%27100%27 y=%27420%27 width=%27300%27 height=%27280%27 rx=%2715%27/%3E%3Crect x=%27420%27 y=%27320%27 width=%27350%27 height=%27200%27 rx=%2715%27/%3E%3Crect x=%27790%27 y=%27320%27 width=%27310%27 height=%27380%27 rx=%2715%27/%3E%3Crect x=%27420%27 y=%27540%27 width=%27350%27 height=%27160%27 rx=%2715%27/%3E%3C/g%3E%3Ctext x=%27600%27 y=%27750%27 text-anchor=%27middle%27 font-size=%2730%27 fill=%27%23999%27%3EBeautiful Interior Design%3C/text%3E%3C/svg%3E')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        </div>
        
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: isMediumAndAbove ? 'row' : 'column',
          minHeight: '100vh'
        }}>
          {/* Left Content Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMediumAndAbove ? '4rem' : '2rem'
          }}>
            <div style={{
              maxWidth: '32rem',
              textAlign: isMediumAndAbove ? 'left' : 'center'
            }}>
              {/* Main Heading */}
              <h1 style={{
                fontSize: isMediumAndAbove ? '4rem' : '3rem',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                marginBottom: '2rem'
              }}>
                One Place,
                <br />
                <span style={{ color: '#f3f4f6' }}>For Every Space</span>
              </h1>
              
              {/* Subheading */}
              <p style={{
                fontSize: isMediumAndAbove ? '1.5rem' : '1.25rem',
                color: '#f3f4f6',
                marginBottom: '3rem',
                lineHeight: 1.6
              }}>
                We've got everything your home needs.
              </p>
              
              {/* CTA Button */}
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#d97706';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f59e0b';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}>
                Get in touch
                <svg style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Form Area - Medium screens and above */}
          {isMediumAndAbove && (
            <div style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '2rem',
                width: windowWidth >= 1024 ? '24rem' : '20rem',
                maxWidth: '100%'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '1.5rem'
                }}>Let our experts help you!</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email id"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Mobile and Pin Code Row */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0 0.75rem',
                          borderRadius: '0.5rem 0 0 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRight: 'none',
                          backgroundColor: '#f9fafb',
                          color: '#6b7280',
                          fontSize: '0.875rem'
                        }}>
                          +91
                        </span>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="Enter mobile no"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0 0.5rem 0.5rem 0',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            fontSize: '1rem'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#f59e0b';
                            e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="pinCode"
                        placeholder="Enter pin code"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#f59e0b';
                          e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* WhatsApp Updates Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0'
                  }}>
                    <label style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.whatsappUpdates}
                        onChange={handleCheckboxChange}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: '2.75rem',
                        height: '1.5rem',
                        borderRadius: '9999px',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: formData.whatsappUpdates ? '#10b981' : '#d1d5db',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                          transform: formData.whatsappUpdates ? 'translateX(1.25rem)' : 'translateX(0)',
                          transition: 'transform 0.2s ease',
                          position: 'absolute',
                          top: '0.125rem',
                          left: '0.125rem'
                        }}></div>
                      </div>
                    </label>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>Update me on WhatsApp</span>
                  </div>
                  
                  {/* Privacy Text */}
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.6
                  }}>
                    By proceeding, you are authorizing Urbann Interiors and its suggested contractors to get in touch with you through calls, sms, or e-mail.
                  </p>
                  
                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transform: 'scale(1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#d97706';
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#f59e0b';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile/Small Screen Form Section */}
        {!isMediumAndAbove && (
          <div style={{
            position: 'relative',
            zIndex: 10,
            backgroundColor: 'white',
            padding: '2rem'
          }}>
            <div style={{
              maxWidth: '28rem',
              margin: '0 auto'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>Let our experts help you!</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email id"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                {/* Mobile and Pin Code Row */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0 0.75rem',
                        borderRadius: '0.5rem 0 0 0.5rem',
                        border: '1px solid #d1d5db',
                        borderRight: 'none',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="Enter mobile no"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0 0.5rem 0.5rem 0',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          fontSize: '1rem'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#f59e0b';
                          e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      name="pinCode"
                      placeholder="Enter pin code"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.boxShadow = '0 0 0 2px rgba(245, 158, 11, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                
                {/* WhatsApp Updates Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0'
                }}>
                  <label style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.whatsappUpdates}
                      onChange={handleCheckboxChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '2.75rem',
                      height: '1.5rem',
                      borderRadius: '9999px',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: formData.whatsappUpdates ? '#10b981' : '#d1d5db',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transform: formData.whatsappUpdates ? 'translateX(1.25rem)' : 'translateX(0)',
                        transition: 'transform 0.2s ease',
                        position: 'absolute',
                        top: '0.125rem',
                        left: '0.125rem'
                      }}></div>
                    </div>
                  </label>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>Update me on WhatsApp</span>
                </div>
                
                {/* Privacy Text */}
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.6
                }}>
                  By proceeding, you are authorizing Urbann Interiors and its suggested contractors to get in touch with you through calls, sms, or e-mail.
                </p>
                
                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#d97706';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f59e0b';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Services section */}
      <Services/>

      {/* Recent Projects Section */}
      <section id="portfolio" style={{
  padding: '5rem 0',
  background: '#f8f9fa'
}}>
  <style>{`
    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;
      padding: 0 2rem;
      max-width: 1300px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 1024px) {
      .portfolio-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .portfolio-grid {
        grid-template-columns: 1fr;
      }
    }

    .portfolio-item {
      position: relative;
      overflow: hidden;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      height: 250px;
      cursor: pointer;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
    }

    .portfolio-item:hover {
      transform: scale(1.05);
    }

    .portfolio-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
      opacity: 0;
      z-index: 1;
      transition: opacity 0.3s ease;
    }

    .portfolio-item:hover::before {
      opacity: 1;
    }

    .portfolio-item::after {
      content: attr(data-title);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      z-index: 2;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
    }

    .portfolio-item:hover::after {
      content: 'View ' attr(data-title) ' Gallery';
      font-size: 1.1rem;
      font-weight: 600;
    }

    .portfolio-background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4));
      z-index: 0;
    }
  `}</style>

  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
    <h2 style={{
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '3rem'
    }}>
      Recent Projects
    </h2>
    
    <div className="portfolio-grid">
      {getDisplayCategories().slice(0, showAllCategories ? undefined : 6).map((roomType, idx) => {
        const backgroundImage = getCategoryBackgroundImage(roomType.key);
        
        return (
          <div
            key={idx}
            className="portfolio-item"
            data-title={roomType.label}
            onClick={() => handleCategoryClick(roomType)}
            style={{
              backgroundImage: `url(${backgroundImage})`
            }}
          >
            <div className="portfolio-background-overlay"></div>
          </div>
        );
      })}
    </div>

    {/* Show All / Show Less Button */}
    {roomTypes.filter(room => room.key !== 'entranceImage').length > 8 && (
      <div style={{
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
            transform: 'scale(1)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c0392b';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#e74c3c';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
          }}
        >
          {showAllCategories ? 'Show Less' : 'Show All Categories'}
        </button>
      </div>
    )}
  </div>
</section>

      {/* TESTIMONIALS COMPONENT SPACE - PASTE YOUR TESTIMONIALS COMPONENT HERE */}
      <Testimonials />
      
    </>
  );
};

export default HeroSection;
