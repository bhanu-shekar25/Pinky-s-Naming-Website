import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics optional for now

const firebaseConfig = {
  apiKey: "AIzaSyDhezdU-lAcFG949E-f_DpUcSayABf-frc",
  authDomain: "pinky-name.firebaseapp.com",
  projectId: "pinky-name",
  storageBucket: "pinky-name.firebasestorage.app",
  messagingSenderId: "383659096326",
  appId: "1:383659096326:web:cb1e36d44b75a7fbd34687",
  measurementId: "G-TVVE6BZFNZ"
};

// Initialize Firebase (avoid multiple instances in dev hot-reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Analytics can be initialized conditionally on client side if needed
// if (typeof window !== "undefined") {
//   getAnalytics(app);
// }

export { app, db };
