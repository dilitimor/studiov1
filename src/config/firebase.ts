
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage"; // Added import for Firebase Storage
// import { getAnalytics } from "firebase/analytics"; // Analytics can be re-enabled if needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ78oviVO6ACoLwm7rWftGqCL-MyyoKrA",
  authDomain: "resume-maker-77f08.firebaseapp.com",
  projectId: "resume-maker-77f08",
  storageBucket: "resume-maker-77f08.appspot.com", // Ensure this is correct for Storage
  messagingSenderId: "384144130996",
  appId: "1:384144130996:web:2ec54e12f255ba95e6e8e1",
  measurementId: "G-WH3TFMHWTD"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the existing app if already initialized
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
// const analytics = getAnalytics(app); // Initialize Analytics if/when needed

export { app, auth, db, storage }; // Export the necessary Firebase instances

