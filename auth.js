import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailLink, isSignInWithEmailLink, signInWithPhoneNumber, RecaptchaVerifier, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { showModal, hideModal } from './modal.js';
import { firebaseConfig } from './config.js';
// Your web app's Firebase configuration in config.js

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function setupAuthListeners() {
    const authStatus = document.getElementById('auth-status');
    authStatus.addEventListener('click', handleAuthClick);
}

export function updateAuthStatus(user) {
    const authStatus = document.getElementById('auth-status');
    if (user) {
        authStatus.textContent = `Welcome, ${user.displayName || user.email || user.phoneNumber}`;
    } else {
        authStatus.textContent = 'Sign In';
    }
}

export function handleAuthClick() {
    if (auth.currentUser) {
        signOut(auth).then(() => {
            updateAuthStatus(null);
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    } else {
        showAuthModal();
    }
}

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            hideModal();
            updateAuthStatus(result.user);
        }).catch((error) => {
            console.error('Google sign in error:', error);
            showErrorMessage(error.message);
        });
}

export function startPhoneSignIn() {
    const phoneNumber = prompt("Please enter your phone number with country code:");
    if (phoneNumber) {
        const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
        });

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                const verificationCode = prompt("Please enter the verification code sent to your phone:");
                return confirmationResult.confirm(verificationCode);
            })
            .then((result) => {
                hideModal();
                updateAuthStatus(result.user);
            })
            .catch((error) => {
                console.error('Phone sign in error:', error);
                showErrorMessage(error.message);
            });
    }
}

export function startEmailSignIn() {
    const email = prompt("Please enter your email:");
    const password = prompt("Please enter your password:");

    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                hideModal();
                updateAuthStatus(result.user);
            })
            .catch((error) => {
                console.error('Email sign in error:', error);
                showErrorMessage(error.message);
            });
    }
}

export function checkEmailLinkSignIn() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = prompt('Please provide your email for confirmation');
        }

        signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                updateAuthStatus(result.user);
            })
            .catch((error) => {
                console.error('Email link sign in error:', error);
                showErrorMessage(error.message);
            });
    }
}

export function showAuthModal() {
    const modalContent = `
        <h2>Sign In</h2>
        <button id="google-signin">Sign in with Google</button>
        <button id="phone-signin">Sign in with Phone</button>
        <button id="email-signin">Sign in with Email</button>
        <div id="recaptcha-container"></div>
    `;
    showModal(modalContent);

    document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
    document.getElementById('phone-signin').addEventListener('click', startPhoneSignIn);
    document.getElementById('email-signin').addEventListener('click', startEmailSignIn);
}

auth.onAuthStateChanged((user) => {
    updateAuthStatus(user);
    if (user) {
        console.log('User is signed in');
    } else {
        console.log('No user is signed in');
    }
});

function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '10px';
    document.body.appendChild(errorElement);

    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}
