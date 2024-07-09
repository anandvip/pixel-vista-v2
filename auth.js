import { showModal, hideModal } from './modal.js';

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

function handleAuthClick() {
    const auth = firebase.auth();
    if (auth.currentUser) {
        auth.signOut().then(() => {
            updateAuthStatus(null);
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    } else {
        showAuthModal();
    }
}

export function showAuthModal() {
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

export function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            hideModal();
            updateAuthStatus(result.user);
        }).catch((error) => {
            console.error('Google sign in error:', error);
            showErrorMessage(error.message);
        });
}

export function startPhoneSignIn() {
    // Implement phone sign-in logic here
}

export function startEmailSignIn() {
    // Implement email sign-in logic here
}

export function checkEmailLinkSignIn() {
    // Implement email link sign-in check here
}

function showErrorMessage(message) {
    // Implement error message display
    console.error(message);
}
