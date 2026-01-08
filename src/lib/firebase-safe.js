import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ตรวจสอบว่ามี environment variables หรือไม่
const isValidConfig = import.meta.env.VITE_API_KEY && 
                     import.meta.env.VITE_API_KEY !== 'your_api_key_here';

let auth, db;

if (isValidConfig) {
  // ใช้ Firebase configuration จริง
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
  };

  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully (without Storage)');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    auth = null;
    db = null;
  }
} else {
  console.warn('⚠️ Firebase not configured. Using demo mode.');
  console.warn('Please update your .env file with valid Firebase credentials.');
  auth = null;
  db = null;
}

export { auth, db, isValidConfig };