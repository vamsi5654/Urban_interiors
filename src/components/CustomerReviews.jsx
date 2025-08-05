import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, 'customerReviews'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(doc => doc.data()));
    };
    fetchReviews();
  }, []);

  return (
    <div className="customer-reviews">
      <h2>Customer Testimonials</h2>
      {reviews.map((r, i) => (
        <div key={i} className="review-box">
          <p>"{r.review}"</p>
          <p><strong>- {r.name}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default CustomerReviews;
