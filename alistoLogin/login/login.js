import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZbe904XlbayEtHD8AVk-B78AqU9HpOBs",
    authDomain: "test-7d003.firebaseapp.com",
    projectId: "test-7d003",
    storageBucket: "test-7d003.firebasestorage.app",
    messagingSenderId: "786133718359",
    appId: "1:786133718359:web:d9bb761c3dc919444ada12",
    measurementId: "G-9CDKGSRCBJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

onAuthStateChanged(auth, (user) => {
    if (user) {
        message.textContent = `Logged in as: ${user.email}`;
        // main.html was removed. Stay on login and show status.
        // You can add a different post-login UI or a redirect target if needed.
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            let errorMessage = "An unexpected error occurred. Please try again.";
            
            // Map technical error codes to layman's terms
            if (error.code === 'auth/invalid-credential') errorMessage = "Incorrect email or password.";
            else if (error.code === 'auth/user-not-found') errorMessage = "No account found with this email. Please sign up.";
            else if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password. Please try again.";
            else if (error.code === 'auth/invalid-email') errorMessage = "Please enter a valid email address.";
            else if (error.code === 'auth/too-many-requests') errorMessage = "Too many attempts. Please try again later.";
            else if (error.code === 'auth/network-request-failed') errorMessage = "Network error. Please check your internet.";

            message.textContent = `Error: ${errorMessage}`;
        });
});
