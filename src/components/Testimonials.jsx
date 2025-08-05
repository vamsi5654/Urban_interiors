import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [firebaseReviews, setFirebaseReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static testimonials (fallback)
  const staticTestimonials = [
    {
      name: 'Priyanka Sharma',
      location: 'Hyderabad',
      rating: 5,
      text: 'Urbann Interiors completely transformed our home. The attention to detail and creative vision exceeded our expectations.',
      project: 'Complete Home Renovation',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23f0f8ff\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'100\' text-anchor=\'middle\' font-size=\'16\' fill=\'%23666\'%3EProject Image%3C/text%3E%3C/svg%3E',
      source: 'static'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Hyderabad',
      rating: 5,
      text: 'Professional, creative, and incredibly skilled. Our office space now inspires productivity and creativity.',
      project: 'Corporate Office Design',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23fff8f0\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'100\' text-anchor=\'middle\' font-size=\'16\' fill=\'%23666\'%3EOffice Project%3C/text%3E%3C/svg%3E',
      source: 'static'
    },
    {
      name: 'Sukesh',
      location: 'Hyderabad',
      rating: 5,
      text: 'From concept to completion, the team was amazing. Our new kitchen is both beautiful and functional.',
      project: 'Kitchen Renovation',
      image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23f8fff0\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'100\' text-anchor=\'middle\' font-size=\'16\' fill=\'%23666\'%3EKitchen Project%3C/text%3E%3C/svg%3E',
      source: 'static'
    }
  ];

  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch text reviews
        const reviewsQuery = query(
          collection(db, "customerReviews"),
          orderBy("timestamp", "desc")
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const textReviews = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          text: doc.data().review,
          timestamp: doc.data().timestamp,
          rating: 5, // Default rating since text reviews don't have ratings
          location: 'Hyderabad', // Default location
          project: 'Customer Review',
          image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23e8f4fd\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'90\' text-anchor=\'middle\' font-size=\'14\' fill=\'%23666\'%3ECustomer%3C/text%3E%3Ctext x=\'150\' y=\'110\' text-anchor=\'middle\' font-size=\'14\' fill=\'%23666\'%3EReview%3C/text%3E%3C/svg%3E',
          source: 'firebase-text'
        }));

        // Fetch video reviews
        const videosQuery = query(
          collection(db, "customerVideos"),
          orderBy("timestamp", "desc")
        );
        const videosSnapshot = await getDocs(videosQuery);
        const videoReviews = videosSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().customerName,
          text: `Watch our video testimonial for the ${doc.data().projectName} project.`,
          timestamp: doc.data().timestamp,
          rating: 5,
          location: 'Hyderabad',
          project: doc.data().projectName,
          videoUrl: doc.data().videoUrl,
          image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 300 200\'%3E%3Crect fill=\'%23fef3e8\' width=\'300\' height=\'200\'/%3E%3Ctext x=\'150\' y=\'90\' text-anchor=\'middle\' font-size=\'14\' fill=\'%23666\'%3EVideo%3C/text%3E%3Ctext x=\'150\' y=\'110\' text-anchor=\'middle\' font-size=\'14\' fill=\'%23666\'%3ETestimonial%3C/text%3E%3C/svg%3E',
          source: 'firebase-video'
        }));

        // Combine all reviews
        const allFirebaseReviews = [...textReviews, ...videoReviews];
        setFirebaseReviews(allFirebaseReviews);
        
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // If there's an error, we'll fall back to static testimonials
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Combine Firebase reviews with static testimonials
  const allTestimonials = [...firebaseReviews, ...staticTestimonials];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % allTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  if (loading) {
    return (
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: 'white',
        textAlign: 'center'
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #e74c3c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </section>
    );
  }

  if (allTestimonials.length === 0) {
    return (
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2c3e50'
          }}>
            What Our Clients Say
          </h2>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
            No reviews available at the moment. Be the first to share your experience!
          </p>
        </div>
      </section>
    );
  }

  const currentReview = allTestimonials[currentTestimonial];

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
            {/* Source indicator */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              backgroundColor: currentReview.source === 'static' ? '#e3f2fd' : 
                            currentReview.source === 'firebase-video' ? '#fff3e0' : '#f3e5f5',
              color: currentReview.source === 'static' ? '#1976d2' : 
                     currentReview.source === 'firebase-video' ? '#f57c00' : '#7b1fa2'
            }}>
              {currentReview.source === 'static' ? '🏠 Featured' : 
               currentReview.source === 'firebase-video' ? '🎥 Video' : '✍️ Written'}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              {[...Array(currentReview.rating)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '24px',
                    height: '24px',
                    display: 'inline-block',
                    marginRight: '2px'
                  }}
                >
                  ⭐
                </div>
              ))}
            </div>

            <p style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: '#2c3e50',
              marginBottom: '2rem',
              lineHeight: '1.8'
            }}>
              "{currentReview.text}"
            </p>

            {/* Video player for video testimonials */}
            {currentReview.videoUrl && (
              <div style={{
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <video
                  controls
                  style={{
                    maxWidth: '400px',
                    width: '100%',
                    height: '200px',
                    borderRadius: '10px',
                    objectFit: 'cover'
                  }}
                >
                  <source src={currentReview.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

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
                  {currentReview.name}
                </h4>
                <p style={{
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>
                  {currentReview.location} • {currentReview.project}
                </p>
              </div>
              {!currentReview.videoUrl && (
                <img
                  src={currentReview.image}
                  alt="Project"
                  style={{
                    width: '100px',
                    height: '80px',
                    borderRadius: '10px',
                    objectFit: 'cover'
                  }}
                />
              )}
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
              ← 
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
              →
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            gap: '0.5rem'
          }}>
            {allTestimonials.map((_, index) => (
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

          {/* Summary stats 
          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              color: '#2c3e50',
              marginBottom: '1rem'
            }}>
              Customer Feedback Summary
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                  {allTestimonials.length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  Total Reviews
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                  {firebaseReviews.filter(r => r.source === 'firebase-video').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  Video Testimonials
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
                  {firebaseReviews.filter(r => r.source === 'firebase-text').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  Written Reviews
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;