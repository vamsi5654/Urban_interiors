import { useState } from 'react';

export const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      title: 'Residential Design',
      subtitle: 'Transform your home into a personalized sanctuary',
      description: 'Start your home transformation journey with us. Visit our design studios and explore our comprehensive residential range.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'linear-gradient(135deg, rgba(44, 62, 80, 0.8), rgba(52, 73, 94, 0.6))',
      detailedContent: {
        fullDescription: 'Our residential design service transforms your living space into a personalized sanctuary that reflects your unique style and meets your family\'s needs. We work closely with homeowners to create spaces that are both beautiful and functional.',
        features: [
          'Custom space planning and layout optimization',
          'Color scheme development and material selection',
          'Furniture selection and placement guidance',
          'Lighting design for ambiance and functionality',
          'Storage solutions and organization systems'
        ],
        process: 'We begin with an in-depth consultation to understand your lifestyle, preferences, and budget. Our team then creates detailed design plans, 3D visualizations, and guides you through every step of the transformation process.',
        timeline: '4-8 weeks depending on project scope',
        startingPrice: 'Starting from ₹1.5L'
      }
    },
    {
      title: 'Commercial Spaces',
      subtitle: 'Professional environments that inspire productivity',
      description: 'Transform your office into a masterpiece. Our commercial solutions blend smart design with professional elegance— where functionality meets luxury.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'linear-gradient(135deg, rgba(41, 128, 185, 0.8), rgba(52, 152, 219, 0.6))',
      detailedContent: {
        fullDescription: 'Create inspiring work environments that boost productivity and reflect your company\'s brand identity. Our commercial design solutions cater to offices, retail spaces, restaurants, and hospitality venues.',
        features: [
          'Brand-aligned interior design concepts',
          'Ergonomic workspace planning',
          'Traffic flow optimization',
          'Acoustic solutions for noise control',
          'Sustainable and eco-friendly material options'
        ],
        process: 'Our commercial design process includes site analysis, stakeholder interviews, concept development, and phased implementation to minimize business disruption.',
        timeline: '6-12 weeks for complete commercial projects',
        startingPrice: 'Starting from ₹1.5L'
      }
    },
    {
      title: 'Renovations',
      subtitle: 'Breathe new life into existing spaces',
      description: 'Bring beauty and innovation to your space with renovations crafted just for you. Designed with precision, built with care.',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gradient: 'linear-gradient(135deg, rgba(200, 198, 215, 0.85), rgba(255, 255, 255, 0.65))',
      detailedContent: {
        fullDescription: 'Transform outdated spaces into modern, functional areas that meet today\'s lifestyle demands. Our renovation services cover everything from minor updates to complete space makeovers.',
        features: [
          'Structural assessment and space reconfiguration',
          'Kitchen and bathroom modernization',
          'Flooring, lighting, and fixture updates',
          'Smart home technology integration',
          'Energy-efficient upgrades and improvements'
        ],
        process: 'We handle all aspects of renovation from initial design through construction coordination, ensuring quality results with minimal disruption to your daily life.',
        timeline: '8-16 weeks depending on renovation scope',
        startingPrice: 'Starting from ₹1.5L'
      }
    }
  ];

  const additionalServices = [
    {
      title: '3D Visualization',
      description: 'See your space before it becomes reality',
      icon: '📐',
      color: '#e74c3c',
      detailedContent: {
        fullDescription: 'Experience your future space through photorealistic 3D renderings and virtual walkthroughs. Our advanced visualization technology helps you make confident design decisions before any construction begins.',
        features: [
          'Photorealistic 3D renderings',
          'Virtual reality walkthroughs',
          'Multiple design option comparisons',
          'Material and color variations',
          'Lighting simulation for different times of day'
        ],
        process: 'Using cutting-edge software, we create detailed 3D models based on your space measurements and design preferences, allowing you to virtually explore every angle.',
        timeline: '1-2 weeks for complete visualization package',
        startingPrice: 'Starting from ₹2k'
      }
    },
    {
      title: 'Furniture Selection',
      description: 'Curated pieces that complete your vision',
      icon: '🛋️',
      color: '#f39c12',
      detailedContent: {
        fullDescription: 'Discover the perfect furniture pieces that complement your design vision and fit your lifestyle. Our curated selection process ensures every piece serves both form and function.',
        features: [
          'Personalized furniture sourcing',
          'Budget-conscious alternatives',
          'Custom furniture design options',
          'Space optimization guidance',
          'Delivery and placement coordination'
        ],
        process: 'We assess your space, understand your needs, and present carefully selected furniture options that align with your style preferences and budget requirements.',
        timeline: '2-4 weeks for complete furniture selection',
        startingPrice: 'Starting from ₹15k'
      }
    },
    {
      title: 'Color Consultation',
      description: 'Perfect palettes for every mood and style',
      icon: '🎨',
      color: '#9b59b6',
      detailedContent: {
        fullDescription: 'Transform your space with expertly chosen color schemes that enhance mood, create visual flow, and reflect your personality. Our color consultations consider lighting, architecture, and your lifestyle.',
        features: [
          'Personalized color palette development',
          'Paint brand and finish recommendations',
          'Color psychology guidance',
          'Lighting impact assessment',
          'Accent color and pattern suggestions'
        ],
        process: 'We analyze your space\'s natural light, existing elements, and your preferences to create harmonious color schemes that enhance your environment.',
        timeline: '1 week for comprehensive color consultation',
        startingPrice: 'Starting from ₹30k'
      }
    }
  ];

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '4rem',
            color: '#2c3e50',
            fontWeight: '700'
          }}>
            Our Services
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {services.map((service, index) => (
              <div 
                key={index}
                style={{
                  position: 'relative',
                  height: '500px',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s ease'
                }} />
                
                <div style={{
                  position: 'absolute',
                  height: '70%',
                  width: '75%',
                  bottom: 0,
                  left: 0,
                  background: service.gradient,
                  borderRadius: '0 15px 0 15px'
                }} />
                
                <div style={{
                  position: 'absolute',
                  height: '70%',
                  width: '75%',
                  bottom: 0,
                  left: 0,
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'white',
                  zIndex: 2,
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    paddingTop: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.8rem',
                      fontWeight: '600',
                      marginBottom: '0.8rem',
                      lineHeight: '1.2',
                      wordWrap: 'break-word',
                      maxWidth: '100%'
                    }}>
                      {service.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '300',
                      marginBottom: '1rem',
                      opacity: 0.9,
                      lineHeight: '1.4',
                      wordWrap: 'break-word',
                      maxWidth: '100%'
                    }}>
                      {service.subtitle}
                    </p>
                    
                    <p style={{
                      fontSize: '0.85rem',
                      lineHeight: '1.4',
                      opacity: 0.8,
                      marginBottom: '1rem',
                      wordWrap: 'break-word',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {service.description}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => openModal(service)}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '0.7rem 1.3rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: '400',
                      backdropFilter: 'blur(10px)',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    Explore More
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {additionalServices.map((service, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5'
                }}>
                  {service.description}
                </p>
                <button 
                  onClick={() => openModal(service)}
                  style={{
                    padding: '0.8rem 1.5rem',
                    backgroundColor: service.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={closeModal}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            animation: 'modalSlideIn 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header with image */}
            <div style={{
              position: 'relative',
              height: '300px',
              borderRadius: '20px 20px 0 0',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: selectedService.image ? `url(${selectedService.image})` : 'none',
                backgroundColor: selectedService.color || '#f0f0f0',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: selectedService.gradient || `linear-gradient(135deg, ${selectedService.color}80, ${selectedService.color}60)`
              }} />
              <button 
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ×
              </button>
              <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                color: 'white'
              }}>
                <h2 style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '700'
                }}>
                  {selectedService.title}
                </h2>
                {selectedService.subtitle && (
                  <p style={{
                    fontSize: '1.2rem',
                    opacity: 0.9,
                    fontWeight: '300'
                  }}>
                    {selectedService.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  About This Service
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: '#555',
                  marginBottom: '1.5rem'
                }}>
                  {selectedService.detailedContent.fullDescription}
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  What's Included
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {selectedService.detailedContent.features.map((feature, index) => (
                    <li key={index} style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                      color: '#555'
                    }}>
                      <span style={{
                        color: selectedService.color || '#3498db',
                        marginRight: '0.5rem',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    color: '#2c3e50',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    Timeline
                  </h4>
                  <p style={{
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>
                    {selectedService.detailedContent.timeline}
                  </p>
                </div>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    color: '#2c3e50',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    Investment
                  </h4>
                  <p style={{
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>
                    {selectedService.detailedContent.startingPrice}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Our Process
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#555'
                }}>
                  {selectedService.detailedContent.process}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  padding: '1rem 2rem',
                  backgroundColor: selectedService.color || '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  Get Started
                </button>
                <button style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'transparent',
                  color: selectedService.color || '#3498db',
                  border: `2px solid ${selectedService.color || '#3498db'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = selectedService.color || '#3498db';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = selectedService.color || '#3498db';
                }}
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Services;