import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const resetButton = document.getElementById("reset-password");
const messageEl = document.getElementById("auth-message");

const showMessage = (text, isError = false) => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.toggle("error", isError);
};

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage("Signed in! Redirecting...");
        window.location.href = "hours.html";
    } catch (error) {
        showMessage(error.message, true);
    }
});

registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        await setDoc(doc(db, "members", credential.user.uid), {
            name,
            email,
            createdAt: new Date().toISOString()
        });
        showMessage("Account created! Redirecting...");
        window.location.href = "hours.html";
    } catch (error) {
        showMessage(error.message, true);
    }
});

resetButton?.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
        showMessage("Enter your email address first.", true);
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showMessage("Password reset email sent.");
    } catch (error) {
        showMessage(error.message, true);
    }
});
