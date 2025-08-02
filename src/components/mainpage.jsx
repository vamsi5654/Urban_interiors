import React, { useState, useEffect } from 'react';
import { Star, Menu, X, ChevronLeft, ChevronRight, Filter, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LoginForm from './LoginForm';
//import Portfolio from './Portfolio';
import UrbanPortfolio from './Urbannportfolio';
import Services from './Services';


// Header Component
const Header = ({ activeSection, setActiveSection, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = ['Home', 'About', 'Services', 'Portfolio', 'Testimonials', 'Blog', 'Contact'];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      padding: '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          letterSpacing: '1px'
        }}>
          Urbann <span style={{color:"orange"}}>Interior</span> Works
        </div>
        
        <nav style={{ display: window.innerWidth > 768 ? 'flex' : 'none', gap: '2rem' }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '1rem',
                color: activeSection === item ? '#e74c3c' : '#2c3e50',
                borderBottom: activeSection === item ? '2px solid #e74c3c' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: window.innerWidth <= 768 ? 'block' : 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          padding: '1rem'
        }}>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => {
                setActiveSection(item);
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                color: activeSection === item ? '#e74c3c' : '#2c3e50'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  const projects = [
    'Modern Living Room',
    'Luxury Bedroom',
    'Contemporary Kitchen',
    'Executive Office',
    'Minimalist Dining',
    'Spa Bathroom',
  ];
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pinCode: '',
    whatsappUpdates: true
  });

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

  const isMediumAndAbove = windowWidth >= 768;
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
                  By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail.
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
                By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail.
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

      {/*services section*/}
      <Services/>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <style>{`
          .portfolio {
            padding: 5rem 0;
            background: #f8f9fa;
          }

          .section-title {
            text-align: center;
            font-size: 2rem;
            font-weight: bold;
            color: #2c3e50;
          }

          .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
            padding: 0 2rem;
          }

          .portfolio-item {
            position: relative;
            overflow: hidden;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
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
            background: linear-gradient(45deg, #667eea, #764ba2);
            opacity: 0.8;
            z-index: 1;
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
          }

          .portfolio-placeholder {
            width: 100%;
            height: 250px;
            background: #ddd;
          }
        `}</style>

        <div className="container">
          <h2 className="section-title">Recent Projects</h2>
          <div className="portfolio-grid">
            {projects.map((title, idx) => (
              <div className="portfolio-item" key={idx} data-title={title}>
                <div className="portfolio-placeholder"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Testimonials*/}
      <Testimonials/>
    </>
  );
};


// About Component
const About = () => {
  const teamMembers = [
    {
      name: 'Design Team',
      role: 'Creative Designers',
      bio: 'Our talented design team specializes in creating innovative interior concepts, space planning, and aesthetic solutions that transform your vision into stunning reality.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Construction Team',
      role: 'Skilled Craftsmen',
      bio: 'Our expert construction team includes carpenters, electricians, painters, plumbers, and other skilled tradesmen who bring precision and quality to every aspect of your project.',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&h=300&fit=crop'
    },
    {
      name: 'Supervision Team',
      role: 'Project Supervisors',
      bio: 'Our experienced supervision team ensures quality workmanship, timely project completion, and seamless coordination between all trades for exceptional results.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
    }
  ];

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2c3e50'
        }}>
          About Us
        </h2>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          maxWidth: '800px',
          margin: '0 auto 4rem'
        }}>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: '#7f8c8d',
            marginBottom: '2rem'
          }}>
            At Urbenn Interiors, we believe that every space has the potential to inspire and transform lives. 
            Our mission is to create beautiful, functional environments that reflect your unique personality and lifestyle.
          </p>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#7f8c8d'
          }}>
            With over a decade of experience in the interior design industry, we've helped hundreds of clients 
            transform their spaces into stunning, functional environments that they love to call home.
          </p>
        </div>

        <h3 style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#2c3e50'
        }}>
          Our Team
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {teamMembers.map((member, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  display: 'block'
                }}
              />
              <h4 style={{
                fontSize: '1.3rem',
                marginBottom: '0.5rem',
                color: '#2c3e50'
              }}>
                {member.name}
              </h4>
              <p style={{
                color: '#e74c3c',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                {member.role}
              </p>
              <p style={{
                color: '#7f8c8d',
                lineHeight: '1.6'
              }}>
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Component
const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Priyanka Sharma',
      location: 'Hyderabed',
      rating: 5,
      text: 'Urbann Interiors completely transformed our home. The attention to detail and creative vision exceeded our expectations.',
      project: 'Complete Home Renovation',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23f0f8ff\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'100\' text-anchor=\'middle\' font-size=\'16\' fill=\'%23666\'%3EProject Image%3C/text%3E%3C/svg%3E'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Hyderabed',
      rating: 5,
      text: 'Professional, creative, and incredibly skilled. Our office space now inspires productivity and creativity.',
      project: 'Corporate Office Design',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23fff8f0\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'100\' text-anchor=\'middle\' font-size=\'16\' fill=\'%23666\'%3EOffice Project%3C/text%3E%3C/svg%3E'
    },
    {
      name: 'Sukesh',
      location: 'Hyderabed',
      rating: 5,
      text: 'From concept to completion, the team was amazing. Our new kitchen is both beautiful and functional.',
      project: 'Kitchen Renovation',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23f8fff0\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'100\' text-anchor=\'middle\' font-size=\'16\' fill=\'%23666\'%3EKitchen Project%3C/text%3E%3C/svg%3E'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2c3e50'
        }}>
          What Our Clients Say
        </h2>

        <div style={{
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '3rem',
            borderRadius: '15px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill="#f39c12"
                  color="#f39c12"
                />
              ))}
            </div>

            <p style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: '#2c3e50',
              marginBottom: '2rem',
              lineHeight: '1.8'
            }}>
              "{testimonials[currentTestimonial].text}"
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <h4 style={{
                  fontSize: '1.1rem',
                  color: '#2c3e50',
                  marginBottom: '0.3rem'
                }}>
                  {testimonials[currentTestimonial].name}
                </h4>
                <p style={{
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>
                  {testimonials[currentTestimonial].location} • {testimonials[currentTestimonial].project}
                </p>
              </div>
              <img
                src={testimonials[currentTestimonial].image}
                alt="Project"
                style={{
                  width: '100px',
                  height: '80px',
                  borderRadius: '10px',
                  objectFit: 'cover'
                }}
              />
            </div>

            <button
              onClick={prevTestimonial}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(231, 76, 60, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronLeft size={24} color="#e74c3c" />
            </button>

            <button
              onClick={nextTestimonial}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(231, 76, 60, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight size={24} color="#e74c3c" />
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            gap: '0.5rem'
          }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentTestimonial ? '#e74c3c' : '#ddd',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog Component
const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Interior Design Trends for 2025',
      excerpt: 'Discover the latest trends shaping interior design this year, from sustainable materials to bold color palettes.',
      author: 'Katty',
      date: '2025-07-10',
      category: 'Trends',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 250\'%3E%3Crect fill=\'%23f0f8ff\' width=\'400\' height=\'250\'/%3E%3Ctext x=\'200\' y=\'125\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23666\'%3E2025 Trends%3C/text%3E%3C/svg%3E'
    },
    {
      id: 2,
      title: 'Small Space, Big Impact: Maximizing Your Studio Apartment',
      excerpt: 'Learn how to make the most of limited space with clever design solutions and multifunctional furniture.',
      author: 'Gana',
      date: '2025-07-05',
      category: 'Tips',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 250\'%3E%3Crect fill=\'%23fff8f0\' width=\'400\' height=\'250\'/%3E%3Ctext x=\'200\' y=\'125\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23666\'%3ESmall Spaces%3C/text%3E%3C/svg%3E'
    },
    {
      id: 3,
      title: 'The Psychology of Color in Interior Design',
      excerpt: 'Explore how different colors affect mood and behavior, and learn to choose the perfect palette for your space.',
      author: 'Emily Rodriguez',
      date: '2025-06-28',
      category: 'Psychology',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 250\'%3E%3Crect fill=\'%23f8fff0\' width=\'400\' height=\'250\'/%3E%3Ctext x=\'200\' y=\'125\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23666\'%3EColor Psychology%3C/text%3E%3C/svg%3E'
    },
    {
      id: 4,
      title: 'Sustainable Design: Creating Eco-Friendly Interiors',
      excerpt: 'Discover how to create beautiful spaces that are kind to the environment using sustainable materials and practices.',
      author: 'Johnson',
      date: '2025-06-20',
      category: 'Sustainability',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 250\'%3E%3Crect fill=\'%23f0fff8\' width=\'400\' height=\'250\'/%3E%3Ctext x=\'200\' y=\'125\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23666\'%3ESustainable Design%3C/text%3E%3C/svg%3E'
    }
  ];

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2c3e50'
        }}>
          Design Blog
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {blogPosts.map(post => (
            <article key={post.id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}>
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem'
                  }}>
                    {post.category}
                  </span>
                  <span style={{
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>
                    {post.date}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  color: '#2c3e50',
                  lineHeight: '1.4'
                }}>
                  {post.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  marginBottom: '1rem',
                  lineHeight: '1.6'
                }}>
                  {post.excerpt}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>
                    By {post.author}
                  </span>
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#e74c3c',
                    border: '1px solid #e74c3c',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}>
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Component
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section style={{
      padding: '5rem 2rem',
      backgroundColor: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2c3e50'
        }}>
          Get In Touch
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem'
        }}>
          {/* Contact Information */}
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '2rem',
              color: '#2c3e50'
            }}>
              Contact Information
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.8rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>Phone</p>
                  <p style={{ color: '#7f8c8d' }}>+91 8977978321</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.8rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>Email</p>
                  <p style={{ color: '#7f8c8d' }}>Urbann2009@gmail.com</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.8rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>Address</p>
                  <p style={{ color: '#7f8c8d' }}>6th Floor, The 27th Building, jaybari Enclaves, Gachabowli, Hyderabed. 500032</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{
              marginTop: '2rem',
              height: '200px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7f8c8d',
              border: '2px dashed #ddd'
            }}>
              <div style={{ textAlign: 'center' }}>
                <MapPin size={48} />
                <p style={{ marginTop: '1rem' }}>Google Maps Integration</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '2rem',
              color: '#2c3e50'
            }}>
              Send Us a Message
            </h3>
            
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
              
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
              
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                style={{
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'border-color 0.3s ease'
                }}
              />
              
              <button
                type="submit"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = ({ handleLoginClick }) => {
  const handleClick = () => {
    handleLoginClick();
    };
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '3rem 2rem 1rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
          {/*<div>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#e74c3c'
            }}>
              Urbann Interior Works
            </h3>
            <p style={{
              color: '#95a5a6',
              lineHeight: '1.6'
            }}>
              Creating beautiful, functional spaces that inspire and transform lives.
            </p>
          </div>*/}
          
          
          <div>
            <h4 style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#e74c3c'
            }}>
              Follow Us
            </h4>
            <div
            style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}
            >
            {[
            { name: 'Email', url: 'mailto:Urbann2009@gmail.com', icon: faEnvelope },
            { name: 'Facebook', url: 'https://www.facebook.com/UrbannInteriors', icon: faFacebook },
            { name: 'Instagram', url: 'https://www.instagram.com/Urbann_interiors', icon: faInstagram },
            { name: 'Twitter', url: 'https://twitter.com/UrbannInteriors', icon: faTwitter },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/company/urbann-interiors', icon: faLinkedin },
            ].map(({ name, url, icon }) => (
                <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: '#95a5a6',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#95a5a6')}
                >
                <FontAwesomeIcon icon={icon} /> {name}
                </a>
            ))}
            </div>

          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #34495e',
          paddingTop: '1rem',
          color: '#95a5a6'
        }}>
          <p>&copy; 2025 Urbann Interiors. All rights reserved. <span onClick={handleClick} className="" style={{color:"black"}}>Login</span></p>
        </div>
      </div>
    </footer>
  );
};

// Chat Button Component
const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000
    }}>
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          width: '250px'
        }}>
          <p style={{
            margin: '0 0 1rem 0',
            color: '#2c3e50'
          }}>
            Hi! How can we help you today?
          </p>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#25d366',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}>
            Start WhatsApp Chat
          </button>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(231, 76, 60, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

// Main App Component
const Appss = () => {
  const [activeSection, setActiveSection] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(false);
  
    const handleLoginClick = () => {
      setIsShowLogin((isShowLogin) => !isShowLogin);}

  const renderSection = () => {
    switch (activeSection) {
      case 'Home':
        return <HeroSection />;
      case 'About':
        return <About />;
      case 'Services':
        return <Services/>;
      case 'Portfolio':
        return <UrbanPortfolio />;
      case 'Testimonials':
        return <Testimonials />;
      case 'Blog':
        return <Blog />;
      case 'Contact':
        return <Contact />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      margin: 0,
      padding: 0
    }}>
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main style={{ paddingTop: '80px' }}>
        {renderSection()}
      </main>
      
      <Footer handleLoginClick={handleLoginClick}/>
      <LoginForm isShowLogin={isShowLogin} handleLoginClick={handleLoginClick}/>
      <ChatButton />
    </div>
  );
};


export default Appss;