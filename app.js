mport { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';
import { firebaseConfig } from './config.js';
import { setupSearchListeners, loadImages } from './imageSearch.js';
import { setupAuthListeners, updateAuthStatus } from './auth.js';
import { setupModalListeners } from './modal.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function initApp() {
    setupSearchListeners();
    setupAuthListeners();
    setupModalListeners();
    
    onAuthStateChanged(auth, (user) => {
        updateAuthStatus(user);
        loadImages(); // Load initial images
    });
}

document.addEventListener('DOMContentLoaded', initApp);
