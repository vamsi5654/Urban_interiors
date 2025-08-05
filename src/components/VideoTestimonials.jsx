import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const VideoTestimonials = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, "customerVideos"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      setVideos(snap.docs.map(doc => doc.data()));
    };
    fetchVideos();
  }, []);

  return (
    <div className="video-testimonials">
      <h2>Customer Video Reviews</h2>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
            <video controls width="300">
              <source src={video.videoUrl} type="video/mp4" />
            </video>
            <p><strong>{video.customerName}</strong> - {video.projectName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoTestimonials;
