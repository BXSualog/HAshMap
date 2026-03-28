import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

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
        if (!user.emailVerified) {
            message.textContent = "Please verify your email first!";
            return;
        }
        message.textContent = `Logged in as: ${user.email}`;
    } else { message.textContent = "Not Logged In" }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
        })
        .then((userCredential) => {
            const user = userCredential.user;
            if (!userCredential.user.emailVerified) {
                message.textContent = `Please verify your email first!`;
                signOut(auth);
                return;
            }
            message.textContent = `Logged in as: ${user.email}`;
            window.location.href = "https://youtu.be/dQw4w9WgXcQ?si=mvfO4jPLlHPetoxK";

        })
        .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                message.textContent = 'Alisto account does not exist';
            } else {
                message.textContent = `Error: ${error.message}`;
            }
        });
});
