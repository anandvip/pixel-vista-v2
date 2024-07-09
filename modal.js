import { signInWithGoogle } from './auth.js';

export function setupModalListeners() {
    const modal = document.getElementById('modal');
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) hideModal();
    });
}

export function showModal(type, data = {}) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    if (type === 'auth') {
        const button = document.createElement('button');
        button.textContent = 'Sign in with Google';
        button.addEventListener('click', signInWithGoogle);
        modalBody.appendChild(button);
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = data.src.large;
        img.alt = data.alt;
        modalBody.appendChild(img);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Image URL';
        copyButton.addEventListener('click', () => copyImageUrl(data.src.original));
        modalBody.appendChild(copyButton);
    }

    modal.style.display = 'block';
}

export function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function copyImageUrl(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert('Image URL copied to clipboard!'))
        .catch(err => console.error('Failed to copy URL: ', err));
}
