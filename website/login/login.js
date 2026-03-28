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

onAuthStateChanged (auth, (user) => {
    if (user) {
        message.textContent = `Logged in as: ${user.email}`;
        window.location.href = "../main/main.html";
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            message.textContent = `Error: ${error.message}`;
        });
});
