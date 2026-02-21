import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const resetButton = document.getElementById("reset-password");
const messageEl = document.getElementById("auth-message");

// Valid invite codes for team registration
const VALID_INVITE_CODES = ["SILVERHORNET2026", "TEAM21331"];

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const showMessage = (text, isError = false) => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.remove("error", "success");
    if (isError) {
        messageEl.classList.add("error");
    } else if (text && text.includes("✓") || text.includes("success") || text.includes("Redirecting")) {
        messageEl.classList.add("success");
    }
};

const setLoadingState = (isLoading, button) => {
    if (!button) return;
    button.disabled = isLoading;
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = "Please wait...";
    } else {
        button.textContent = button.dataset.originalText || "Submit";
    }
};

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    setLoadingState(true, submitBtn);

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Validate email format
    if (!validateEmail(email)) {
        showMessage("Please enter a valid User ID.", true);
        setLoadingState(false, submitBtn);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage("✓ Signed in! Redirecting...");
        setTimeout(() => {
            window.location.href = "hours.html";
        }, 1500);
    } catch (error) {
        console.error("Login error:", error.code, error.message);
        
        // Show user-friendly error messages
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            showMessage("❌ Incorrect email or password. Please try again.", true);
        } else if (error.code === 'auth/user-not-found') {
            showMessage("❌ No account found with this email. Please create an account.", true);
        } else if (error.code === 'auth/invalid-email') {
            showMessage("❌ Invalid email format.", true);
        } else if (error.code === 'auth/user-disabled') {
            showMessage("❌ This account has been disabled. Contact your coach.", true);
        } else if (error.code === 'auth/too-many-requests') {
            showMessage("❌ Too many failed attempts. Please wait a few minutes and try again.", true);
        } else if (error.code === 'auth/network-request-failed') {
            showMessage("❌ Network error. Check your internet connection.", true);
        } else {
            showMessage(`❌ Error: ${error.message}`, true);
        }
    } finally {
        setLoadingState(false, submitBtn);
    }
});

registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("");

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    setLoadingState(true, submitBtn);

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const inviteCode = document.getElementById("register-invite").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Validate invite code
    if (!VALID_INVITE_CODES.includes(inviteCode.toUpperCase())) {
        showMessage("Invalid invite code. Contact your coach for the correct code.", true);
        setLoadingState(false, submitBtn);
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showMessage("Please enter a valid User ID.", true);
        setLoadingState(false, submitBtn);
        return;
    }

    // Validate name
    if (name.length < 2) {
        showMessage("Please enter your full name.", true);
        setLoadingState(false, submitBtn);
        return;
    }

    // Check if email already exists
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            showMessage("This User ID is already registered. Please sign in instead.", true);
            setLoadingState(false, submitBtn);
            return;
        }
    } catch (error) {
        // If there's an error checking, we'll let the createUser attempt handle it
        console.error("Error checking email:", error);
    }

    try {
        console.log("Creating user account...");
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        
        console.log("✅ User created, UID:", credential.user.uid);
        console.log("Updating profile...");
        await updateProfile(credential.user, { displayName: name });
        
        console.log("Creating member profile in Firestore...");
        await setDoc(doc(db, "members", credential.user.uid), {
            name,
            email,
            inviteCode: inviteCode.toUpperCase(),
            createdAt: new Date().toISOString()
        });
        
        console.log("✅ Registration complete!");
        showMessage("✓ Account created! Redirecting...");
        setTimeout(() => {
            window.location.href = "hours.html";
        }, 1500);
    } catch (error) {
        console.error("❌ Registration error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        
        // Show user-friendly error messages
        if (error.code === 'auth/email-already-in-use') {
            showMessage("❌ This email is already registered. Please sign in instead.", true);
        } else if (error.code === 'auth/weak-password') {
            showMessage("❌ Password is too weak. Use at least 6 characters.", true);
        } else if (error.code === 'auth/invalid-email') {
            showMessage("❌ Invalid email format.", true);
        } else if (error.code === 'permission-denied') {
            showMessage("❌ Database error. Please ensure Firestore is set up correctly.", true);
        } else if (error.code === 'auth/operation-not-allowed') {
            showMessage("❌ Registration is currently disabled. Contact your coach.", true);
        } else if (error.code === 'auth/network-request-failed') {
            showMessage("❌ Network error. Check your internet connection.", true);
        } else {
            showMessage(`❌ Error: ${error.message}`, true);
        }
    } finally {
        setLoadingState(false, submitBtn);
    }
});

resetButton?.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
        showMessage("Enter your User ID first.", true);
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showMessage("Please enter a valid User ID.", true);
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showMessage("✓ Password reset email sent. Check your inbox.");
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Real-time email validation
const addEmailValidation = (inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener("blur", () => {
        const email = input.value.trim();
        if (email && !validateEmail(email)) {
            input.style.borderColor = "#dc3545";
            input.setAttribute("aria-invalid", "true");
        } else {
            input.style.borderColor = "";
            input.removeAttribute("aria-invalid");
        }
    });

    input.addEventListener("input", () => {
        if (input.hasAttribute("aria-invalid")) {
            const email = input.value.trim();
            if (validateEmail(email)) {
                input.style.borderColor = "#28a745";
                input.removeAttribute("aria-invalid");
            }
        }
    });
};

addEmailValidation("login-email");
addEmailValidation("register-email");

// Check if email exists for registration
const registerEmailInput = document.getElementById("register-email");
if (registerEmailInput) {
    let checkTimeout;
    registerEmailInput.addEventListener("blur", async () => {
        const email = registerEmailInput.value.trim();
        if (!email || !validateEmail(email)) return;

        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                registerEmailInput.style.borderColor = "#ffc107";
                showMessage("⚠️ This User ID is already registered. Please sign in instead.", true);
            } else {
                registerEmailInput.style.borderColor = "#28a745";
                if (messageEl?.textContent.includes("already registered")) {
                    showMessage("");
                }
            }
        } catch (error) {
            // Silently fail - validation will happen on submit
            console.error("Error checking email:", error);
        }
    });

    // Clear warning when user starts typing again
    registerEmailInput.addEventListener("input", () => {
        clearTimeout(checkTimeout);
        if (messageEl?.textContent.includes("already registered")) {
            showMessage("");
        }
    });
}
