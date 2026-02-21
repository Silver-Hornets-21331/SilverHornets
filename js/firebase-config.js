// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcn0nDvUZJ05nLjjqHg_6OjZhAtck6Ns0",
    authDomain: "silverhornetsdatabase-ce0f9.firebaseapp.com",
    projectId: "silverhornetsdatabase-ce0f9",
    storageBucket: "silverhornetsdatabase-ce0f9.firebasestorage.app",
    messagingSenderId: "256398756569",
    appId: "1:256398756569:web:2f98be25ce2bafe6bb8cc8"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const analytics = getAnalytics(firebaseApp);

