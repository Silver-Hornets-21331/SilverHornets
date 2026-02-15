import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUE5O0zVK36X3xnW8VVrSwoa48ZqbHN94",
    authDomain: "silverhornetsdatabase.firebaseapp.com",
    projectId: "silverhornetsdatabase",
    storageBucket: "silverhornetsdatabase.firebasestorage.app",
    messagingSenderId: "34196353442",
    appId: "1:34196353442:web:f949b998821b8ffb8b82fb",
    measurementId: "G-KK1SYKBF1F"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
