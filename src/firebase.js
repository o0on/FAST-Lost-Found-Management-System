// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - strictly from environment variables without defaults
const firebaseConfig = {
    apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || "").trim(),
    authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "").trim(),
    projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || "").trim(),
    storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "").trim(),
    messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "").trim(),
    appId: (import.meta.env.VITE_FIREBASE_APP_ID || "").trim(),
    measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "").trim()
};

let app = null;
let auth = null;
let db = null;

try {
    if (firebaseConfig.apiKey) {
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    }
} catch (error) {
    console.error("Firebase initialization failed with the provided configuration:", error);
}

const analytics = null;

export { app, analytics, auth, db };
