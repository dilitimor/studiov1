// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"; // Ensure getApps and getApp are imported for robust initialization
import { getAuth } from 'firebase/auth'; // Added for authentication
import { getFirestore } from 'firebase/firestore'; // Added for Firestore database
// import { getAnalytics } from "firebase/analytics"; // Analytics is available if needed
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// These values are hardcoded. For better security and flexibility, 
// it's recommended to use environment variables (e.g., via a .env file).
const firebaseConfig = {
  apiKey: "AIzaSyAQ78oviVO6ACoLwm7rWftGqCL-MyyoKrA",
  authDomain: "resume-maker-77f08.firebaseapp.com",
  projectId: "resume-maker-77f08",
  storageBucket: "resume-maker-77f08.firebasestorage.app",
  messagingSenderId: "384144130996",
  appId: "1:384144130996:web:2ec54e12f255ba95e6e8e1",
  // measurementId: "G-WH3TFMHWTD" // This ID is optional and not currently used by Auth/Firestore.
};

// Initialize Firebase
// Using getApps() and getApp() helps prevent re-initialization in Next.js environments
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Cloud Firestore
// const analytics = getAnalytics(app); // Initialize Analytics if/when needed

export { app, auth, db }; // Export the necessary Firebase instances
