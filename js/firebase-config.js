// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1klygmd76Vy__nhO7dfTgcicwvJy_0L8",
    authDomain: "ftc213312026db.firebaseapp.com",
    projectId: "ftc213312026db",
    storageBucket: "ftc213312026db.firebasestorage.app",
    messagingSenderId: "341587480309",
    appId: "1:341587480309:web:0e4d5e06ab625e289a7fbc",
    measurementId: "G-326BCMC3MK"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
