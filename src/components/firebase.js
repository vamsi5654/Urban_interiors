// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtNpGj-EH56jqT8yS-vKANyuXKUxN5jWc",
  authDomain: "urbann-8ba0e.firebaseapp.com",
  projectId: "urbann-8ba0e",
  storageBucket: "urbann-8ba0e.firebasestorage.app",
  messagingSenderId: "222381622649",
  appId: "1:222381622649:web:412d228d173aba7b569ba8",
  measurementId: "G-ZBS5EC8HVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);