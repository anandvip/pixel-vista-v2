import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { showModal, hideModal } from './modal.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

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
        authStatus.textContent = `Welcome, ${user.displayName || user.email}`;
    } else {
        authStatus.textContent = 'Sign In';
    }
}

function handleAuthClick() {
    if (auth.currentUser) {
        signOut(auth).then(() => {
            updateAuthStatus(null);
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    } else {
        showModal('auth');
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
            // Handle error (e.g., show error message to user)
        });
}

// Check for email link sign-in
export function checkEmailLinkSignIn() {
    if (auth.isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = prompt('Please provide your email for confirmation');
        }

        auth.signInWithEmailLink(email, window.location.href)
            .then(() => {
                window.localStorage.removeItem('emailForSignIn');
            })
            .catch((error) => {
                console.error('Email link sign in error:', error);
                showErrorMessage(error.message);
            });
    }
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    updateAuthStatus(user);
    if (user) {
        console.log('User is signed in');
    } else {
        console.log('No user is signed in');
    }
});

// Display error messages to the user
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
