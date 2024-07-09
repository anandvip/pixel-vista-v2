
// auth.js
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { showModal, hideModal } from './modal.js';

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
    const auth = getAuth();
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
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            hideModal();
            updateAuthStatus(result.user);
        }).catch((error) => {
            console.error('Google sign in error:', error);
            // Handle error (e.g., show error message to user)
        });
}

import { showModal, hideModal } from './modal.js';

// Initialize Firebase Auth
const auth = firebase.auth();

// Setup event listeners for auth-related elements
export function setupAuthListeners() {
    const authStatus = document.getElementById('auth-status');
    const signOutButton = document.getElementById('sign-out-button');

    authStatus.addEventListener('click', showAuthModal);
    signOutButton.addEventListener('click', signOut);
}

// Update UI based on auth state
export function updateAuthStatus(user) {
    const authStatus = document.getElementById('auth-status');
    const signOutButton = document.getElementById('sign-out-button');

    if (user) {
        authStatus.textContent = `Welcome, ${user.displayName || user.email || user.phoneNumber}`;
        signOutButton.style.display = 'inline-block';
    } else {
        authStatus.textContent = 'Sign In';
        signOutButton.style.display = 'none';
    }
}

// Show auth modal with sign-in options
function showAuthModal() {
    const modalContent = `
        <h2>Sign In</h2>
        <button id="google-signin">Sign in with Google</button>
        <button id="phone-signin">Sign in with Phone</button>
        <button id="email-signin">Sign in with Email</button>
    `;
    showModal(modalContent);

    document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
    document.getElementById('phone-signin').addEventListener('click', startPhoneSignIn);
    document.getElementById('email-signin').addEventListener('click', startEmailSignIn);
}

// Sign in with Google
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        hideModal();
    } catch (error) {
        console.error('Google sign in error:', error);
        showErrorMessage(error.message);
    }
}

// Start phone number sign-in process
function startPhoneSignIn() {
    const phoneNumber = prompt("Please enter your phone number with country code:");
    if (phoneNumber) {
        const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        });

        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                const verificationCode = prompt("Please enter the verification code sent to your phone:");
                return confirmationResult.confirm(verificationCode);
            })
            .then(() => {
                hideModal();
            })
            .catch((error) => {
                console.error('Phone sign in error:', error);
                showErrorMessage(error.message);
            });
    }
}

// Start email/password sign-in process
function startEmailSignIn() {
    const email = prompt("Please enter your email:");
    const password = prompt("Please enter your password:");

    if (email && password) {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                hideModal();
            })
            .catch((error) => {
                console.error('Email sign in error:', error);
                showErrorMessage(error.message);
            });
    }
}

// Sign out the current user
async function signOut() {
    try {
        await auth.signOut();
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Sign out error:', error);
        showErrorMessage(error.message);
    }
}

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






































// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
//  import { showModal, hideModal } from './modal.js';

// export function setupAuthListeners() {
//     const authStatus = document.getElementById('auth-status');
//     authStatus.addEventListener('click', handleAuthClick);
// }

// export function updateAuthStatus(user) {
//     const authStatus = document.getElementById('auth-status');
//     if (user) {
//         authStatus.textContent = `Welcome, ${user.displayName || user.email || user.phoneNumber}`;
//     } else {
//         authStatus.textContent = 'Sign In';
//     }
// }

// function handleAuthClick() {
//     const auth = firebase.auth();
//     if (auth.currentUser) {
//         auth.signOut().then(() => {
//             updateAuthStatus(null);
//         }).catch((error) => {
//             console.error('Sign out error:', error);
//         });
//     } else {
//         showAuthModal();
//     }
// }

// export function showAuthModal() {
//     const modalContent = `
//         <h2>Sign In</h2>
//         <button id="google-signin">Sign in with Google</button>
//         <button id="phone-signin">Sign in with Phone</button>
//         <button id="email-signin">Sign in with Email</button>
//     `;
//     showModal(modalContent);

//     document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
//     document.getElementById('phone-signin').addEventListener('click', startPhoneSignIn);
//     document.getElementById('email-signin').addEventListener('click', startEmailSignIn);
// }

// export function signInWithGoogle() {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider)
//         .then((result) => {
//             hideModal();
//             updateAuthStatus(result.user);
//         }).catch((error) => {
//             console.error('Google sign in error:', error);
//             showErrorMessage(error.message);
//         });
// }

// export function startPhoneSignIn() {
//     // Implement phone sign-in logic here
// }

// export function startEmailSignIn() {
//     // Implement email sign-in logic here
// }

// export function checkEmailLinkSignIn() {
//     // Implement email link sign-in check here
// }

// function showErrorMessage(message) {
//     // Implement error message display
//     console.error(message);
// }








































