import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { showModal, hideModal } from 'modal.js';

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
