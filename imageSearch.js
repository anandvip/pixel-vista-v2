import { PEXELS_API_KEY } from './config.js';
import { showModal } from './modal.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';

let currentPage = 1;
const perPage = 20;

export function setupSearchListeners() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    searchButton.addEventListener('click', () => loadImages(searchInput.value));
    prevButton.addEventListener('click', () => navigatePage(-1));
    nextButton.addEventListener('click', () => navigatePage(1));
}

export async function loadImages(query = 'nature') {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`;
    try {
        const response = await fetch(url, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayImages(data.photos);
    } catch (error) {
        console.error('Error fetching images:', error);
        // Handle error (e.g., show error message to user)
    }
}

function displayImages(photos) {
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = '';
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.src.medium;
        img.alt = photo.alt;
        img.addEventListener('click', () => showImageDetails(photo));
        imageGrid.appendChild(img);
    });
}

function showImageDetails(photo) {
    const auth = getAuth();
    if (!auth.currentUser) {
        showModal('auth');
        return;
    }
    showModal('image', photo);
}

function navigatePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    loadImages(document.getElementById('search-input').value);
}