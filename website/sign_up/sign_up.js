
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        message.textContent = "Invalid gmail format";
        return;
    }

    if (password === confirm_password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return sendEmailVerification(user);
            })
            .then(() => {
                message.textContent = "Verification email sent! Please check your inbox. (If mail is not in inbox, check spam folder)";
                return signOut(auth);
            })

            .catch((error) => {
                const errorCode = error.code;
                
                if (errorCode === 'auth/email-already-in-use') {
                    message.textContent = "Account already exists.";
                } else {
                    message.textContent = error.message;
                }
            });
    } else { message.textContent = "Password does not match"; }

})
