import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    signOut,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

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

const message = document.getElementById("message");
const verificationStatus = document.getElementById("verificationStatus");
const popupText = document.getElementById("popupText");

const _signOut = document.getElementById("signOut");
const changePassword = document.getElementById("changePassword");
const deleteAccount = document.getElementById("deleteAccount");
const _closePopup = document.getElementById("closePopup");

const btn = document.createElement("button");

let cooldown = 60;
btn.textContent = "Verify Email";
btn.id = "verification";

btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            showPopup("popup");
            popupText.textContent = ("Verification Sent, Please Check Your Inbox")
            await sendEmailVerification(user)

            btn.disabled = true;

            const interval = setInterval(() => {
                btn.textContent = `Resend (${cooldown}s)`;
                cooldown--;

                if (cooldown < 0) {
                    clearInterval(interval);
                    btn.disabled = false;
                    btn.textContent = "Resend Verification Email";
                    cooldown = 60;
                }
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    } 
    
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await user.reload();
        message.textContent = `Currently Logged In As: ${user.email}`;
        
        if (!user.emailVerified) {
            showPopup("popup");
            popupText.textContent = "Account Not Verified, Please Verify Account To Access Full Service"
            verificationStatus.textContent = `Verification Status: Unverified `
            verificationStatus.appendChild(btn);
        } else {
            verificationStatus.textContent = `Verification Status: Verified`
        }
    } else {
        window.location.href = "../login/login.html"
    };

});

_closePopup.addEventListener("click", () => {
    closePopup("popup");
});

function showPopup(id) {
    document.getElementById(id).style.display = "block";
};
function closePopup(id) {
    document.getElementById(id).style.display = "none";
};

const confirmSignOut = document.getElementById("confirmSignOut");
const cancelSignOut = document.getElementById("cancelSignOut");

_signOut.addEventListener("click", () => {
    showPopup("signOutPopup");
});

confirmSignOut.addEventListener("click", () => {
    signOut(auth);
    window.location.href = "../login/login.html";
});

cancelSignOut.addEventListener("click", () => {
    closePopup("signOutPopup")
});

const changeForm = document.getElementById("changeForm");
const cancelChange = document.getElementById("cancelChange");
const changeText = document.getElementById("changeText");

changePassword.addEventListener("click", () => {
    showPopup("changePopup");
});

changeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    const email = user.email;
    const confirmEmail = document.getElementById("email").value.toLowerCase();
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    const credential = EmailAuthProvider.credential(email, oldPassword);

    if (email === confirmEmail) {
        if (newPassword === confirmNewPassword) {
            reauthenticateWithCredential(user, credential)
            .then(() => {
                updatePassword(user, newPassword)
                    .then(() => {
                        changeForm.reset();
                        showPopup("popup");
                        popupText.textContent = "Password Changed"
                        closePopup("changePopup");
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        changeText.textContent = errorMessage;
                    });
            })
            .catch((error) => {
                const errorMessage = error.message;
                changeText.textContent = errorMessage;
            });
        } else {
            changeText.textContent = "New Passwords Does Not Match";
        }
    } else {
        changeText.textContent = "Invalid Credentials";
    }
});

cancelChange.addEventListener("click", () => {
    changeForm.reset();
    closePopup("changePopup");
});

const deleteForm = document.getElementById("deleteForm");
const cancelDelete = document.getElementById("cancelDelete");
const deleteText = document.getElementById("deleteText");

deleteAccount.addEventListener("click", () => {
    showPopup("deletePopup");
});

deleteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    const email = user.email;
    const confirmEmail = document.getElementById("email").value.toLowerCase();
    const password = document.getElementById("password").value;
    const credential = EmailAuthProvider.credential(email, password);

    if (confirmEmail === email)
    {
        reauthenticateWithCredential(user, credential)
            .then(() => {
                deleteForm.reset();
                deleteText.textContent = "Account Deleted";
                return deleteUser(user);
            })
            .catch((error) => {
                const errorMessage = error.message;
                deleteText.textContent = errorMessage;
            });
    } else {
        deleteText.textContent = "Invalid Credentials";
    }
});
cancelDelete.addEventListener("click", () => {
    deleteForm.reset();
    closePopup("deletePopup");
});
