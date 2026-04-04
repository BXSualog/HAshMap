
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

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

const sign_up_form = document.getElementById("sign_up_form")
const message = document.getElementById("message");

sign_up_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    if (password === confirm_password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                message.textContent = "Account created successfully. Please sign in.";
                setTimeout(() => {
                    window.location.href = "../login/login.html";
                }, 1200);
            })

            .catch((error) => {
                let errorMessage = "An unexpected error occurred. Please try again.";
                
                // Map technical error codes to layman's terms
                if (error.code === 'auth/email-already-in-use') errorMessage = "User already exists. Try logging in instead.";
                else if (error.code === 'auth/weak-password') errorMessage = "Password is too weak. Use a longer password.";
                else if (error.code === 'auth/invalid-email') errorMessage = "Please enter a valid email address.";
                else if (error.code === 'auth/network-request-failed') errorMessage = "Network error. Please check your internet.";
                
                message.textContent = errorMessage;
            });
    } else { message.textContent = "Your passwords do not match."; }

})
