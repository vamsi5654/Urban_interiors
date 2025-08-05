import React, { useState } from 'react';
import { Star, Send, User, MessageSquare, CheckCircle } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ReviewUploadForm = () => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Your original Firebase code - this will actually upload to the database
      await addDoc(collection(db, "customerReviews"), {
        name,
        review,
        timestamp: serverTimestamp(),
      });
      
      setName('');
      setReview('');
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const iconContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  };

  const iconWrapperStyle = {
    padding: '12px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '16px',
    margin: '0'
  };

  const successMessageStyle = {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #d1fae5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: showSuccess ? 'fadeIn 0.5s ease-in' : 'none'
  };

  const successTextStyle = {
    color: '#166534',
    fontWeight: '500',
    fontSize: '14px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: isSubmitting ? '#f9fafb' : '#ffffff',
    cursor: isSubmitting ? 'not-allowed' : 'text',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'none',
    fontFamily: 'inherit'
  };

  const characterCountStyle = {
    textAlign: 'right',
    fontSize: '12px',
    color: '#6b7280'
  };

  const buttonStyle = {
    width: '100%',
    background: isSubmitting || !name.trim() || !review.trim() 
      ? '#9ca3af' 
      : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: isSubmitting || !name.trim() || !review.trim() ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    transform: isSubmitting || !name.trim() || !review.trim() ? 'none' : 'scale(1)',
    outline: 'none'
  };

  const footerStyle = {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.5'
  };

  const spinnerStyle = {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .form-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          .submit-button:hover:not(:disabled) {
            transform: scale(1.02);
            background: linear-gradient(135deg, #2563eb, #7c3aed);
          }
          .submit-button:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }
        `}
      </style>

      {/* Header */}
      <div style={headerStyle}>
        <div style={iconContainerStyle}>
          <div style={iconWrapperStyle}>
            <Star size={24} color="#ffffff" />
          </div>
        </div>
        <h3 style={titleStyle}>Share Your Experience</h3>
        <p style={subtitleStyle}>Help others by sharing your honest review</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={successMessageStyle}>
          <CheckCircle size={20} color="#16a34a" />
          <span style={successTextStyle}>Review added successfully! Thank you for your feedback.</span>
        </div>
      )}

      {/* Form */}
      <div style={formStyle}>
        {/* Name Input */}
        <div style={fieldStyle}>
          <label htmlFor="name" style={labelStyle}>
            <User size={16} />
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            style={inputStyle}
            className="form-input"
          />
        </div>

        {/* Review Textarea */}
        <div style={fieldStyle}>
          <label htmlFor="review" style={labelStyle}>
            <MessageSquare size={16} />
            Your Review
          </label>
          <textarea
            id="review"
            placeholder="Share your experience with us..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            disabled={isSubmitting}
            style={textareaStyle}
            className="form-input"
          />
          <div style={characterCountStyle}>
            {review.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim() || !review.trim()}
          style={buttonStyle}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <div style={spinnerStyle}></div>
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Review
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        Your review helps us improve our services and assists other customers in making informed decisions.
      </div>
    </div>
  );
};

export default ReviewUploadForm;