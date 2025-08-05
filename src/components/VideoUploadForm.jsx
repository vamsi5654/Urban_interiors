import React, { useState, useRef, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const VideoUploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Add CSS animation for spinner
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please drop a valid video file');
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    return interval;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !customerName.trim() || !projectName.trim()) {
      alert('Please fill in all fields and select a video file');
      return;
    }

    setUploading(true);
    const progressInterval = simulateProgress();
    
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", "your_upload_preset");
    formData.append("resource_type", "video");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloud_name/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await res.json();
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      await addDoc(collection(db, "customerVideos"), {
        videoUrl: data.secure_url,
        customerName: customerName.trim(),
        projectName: projectName.trim(),
        timestamp: serverTimestamp(),
        fileSize: videoFile.size,
        fileName: videoFile.name,
      });

      setTimeout(() => {
        alert("Video uploaded successfully!");
        setCustomerName("");
        setProjectName("");
        setVideoFile(null);
        setUploadProgress(0);
      }, 500);
      
    } catch (err) {
      console.error("Upload error:", err);
      clearInterval(progressInterval);
      setUploadProgress(0);
      alert("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>Upload Customer Video Review</h2>
          <p style={styles.subtitle}>Share your customer's success story</p>
        </div>

        <div style={styles.formWrapper}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer's full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                ...styles.input,
                ...(customerName ? {} : {})
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Project Name</label>
            <input
              type="text"
              placeholder="Enter project or service name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Video File</label>
            <div
              style={{
                ...styles.dropZone,
                ...(dragActive ? styles.dropZoneActive : {}),
                ...(videoFile ? styles.dropZoneSuccess : {})
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                style={styles.hiddenInput}
              />
              
              {videoFile ? (
                <div style={styles.fileInfo}>
                  <div style={styles.fileIcon}>🎥</div>
                  <div>
                    <p style={styles.fileName}>{videoFile.name}</p>
                    <p style={styles.fileSize}>{formatFileSize(videoFile.size)}</p>
                  </div>
                </div>
              ) : (
                <div style={styles.dropContent}>
                  <div style={styles.uploadIcon}>📁</div>
                  <p style={styles.dropText}>
                    Drag and drop your video here, or <span style={styles.clickText}>click to browse</span>
                  </p>
                  <p style={styles.formatText}>Supports: MP4, MOV, AVI, WMV</p>
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${uploadProgress}%`
                  }}
                />
              </div>
              <p style={styles.progressText}>{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !videoFile || !customerName.trim() || !projectName.trim()}
            style={{
              ...styles.submitButton,
              ...(uploading || !videoFile || !customerName.trim() || !projectName.trim() ? styles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {uploading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner} />
                Uploading...
              </span>
            ) : (
              "Upload Video Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    padding: '32px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '700',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9,
  },
  formWrapper: {
    padding: '32px',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  dropZone: {
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9fafb',
  },
  dropZoneActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  dropZoneSuccess: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  hiddenInput: {
    display: 'none',
  },
  dropContent: {
    textAlign: 'center',
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  dropText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  clickText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  formatText: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'left',
  },
  fileIcon: {
    fontSize: '32px',
  },
  fileName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 4px 0',
  },
  fileSize: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  progressContainer: {
    marginBottom: '24px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    transition: 'width 0.3s ease',
  },
  progressText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    margin: '8px 0 0 0',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  submitButtonDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default VideoUploadForm;