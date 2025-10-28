// app.js - With side-by-side images for multiple images
console.log("🚀 app.js started loading");

let map;
let fullscreenPopup = null;

// Wait for everything to load
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM loaded, initializing app...");
    
    if (typeof L === 'undefined') {
        console.error("❌ Leaflet not loaded");
        return;
    }
    
    if (typeof muralData === 'undefined') {
        console.error("❌ muralData not found");
        return;
    }
    
    console.log("✅ All dependencies loaded, starting initialization...");
    initializeApp();
});

function initializeApp() {
    console.log("🗺️ Initializing map...");
    
    // Create map
    map = L.map('map').setView([26.5, 92.5], 8);
    
    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    
    // Statistics
    const stats = calculateStats();
    document.getElementById('total-murals').textContent = stats.totalMurals;
    document.getElementById('cities-count').textContent = stats.citiesCount;
    document.getElementById('artists-count').textContent = stats.artistsCount;
    document.getElementById('images-count').textContent = stats.imagesCount;
    
    // Create mural list and markers
    const muralList = document.getElementById('mural-list');
    
    muralData.forEach((mural, index) => {
        // Create list item
        const item = document.createElement('div');
        item.className = 'mural-item';
        item.innerHTML = `
            <div class="mural-name">${mural.name}</div>
            <div class="mural-location">${mural.locationDesc || 'No location'}</div>
        `;
        
        item.addEventListener('click', function() {
            focusOnMural(mural, index);
        });
        
        muralList.appendChild(item);
        
        // Create marker
        const lat = dmsToDecimal(mural.lat);
        const lng = dmsToDecimal(mural.lng);
        
        if (lat && lng) {
            const marker = L.marker([lat, lng]).addTo(map);
            
            const popupContent = createPopupContent(mural, index);
            
            marker.bindPopup(popupContent, {
                className: 'centered-popup'
            });
        }
    });
    
    console.log("✅ App initialized successfully!");
}

// Create centered popup content with side-by-side images
function createPopupContent(mural, index) {
    return `
        <div class="popup-content">
            <!-- Mural Name - Centered -->
            <h3 class="popup-title">${mural.name}</h3>
            
            <!-- Images - Side by side if multiple -->
            <div class="popup-image-container">
                ${createPopupImages(mural.images, mural.name, index)}
            </div>
            
            <!-- Artist Name - Centered -->
            <div class="popup-artist">
                <strong>Artist:</strong> ${mural.artist || 'Unknown'}
            </div>
            
            <!-- Description - Centered -->
            <div class="popup-description">
                <strong>Description:</strong> ${mural.description}
            </div>
            
            <!-- Location - Centered -->
            <div class="popup-location">
                <strong>Location:</strong> ${mural.locationDesc}
            </div>
            
            <!-- Fullscreen Button - Centered -->
            <button class="fullscreen-btn" onclick="openFullscreen(${index})">
                📱 Fullscreen View
            </button>
        </div>
    `;
}

// Create popup images layout
function createPopupImages(images, muralName, index) {
    if (!images || images.length === 0) {
        return '<p class="no-image">No image available</p>';
    }
    
    // Single image
    if (images.length === 1) {
        return `
            <img src="Images/${cleanImageFileName(images[0])}" 
                 alt="${muralName}" 
                 class="popup-main-image single-image"
                 onclick="openFullscreen(${index})">
        `;
    }
    
    // Multiple images - side by side
    return `
        <div class="popup-images-grid">
            ${images.map((img, imgIndex) => `
                <div class="popup-image-item">
                    <img src="Images/${cleanImageFileName(img)}" 
                         alt="${muralName}" 
                         class="popup-grid-image"
                         onclick="openFullscreen(${index})">
                    ${images.length > 1 ? `<div class="image-counter">${imgIndex + 1}/${images.length}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function focusOnMural(mural, index) {
    const lat = dmsToDecimal(mural.lat);
    const lng = dmsToDecimal(mural.lng);
    
    if (lat && lng) {
        // Scroll to map
        document.querySelector('.map-container').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Center on mural
        map.setView([lat, lng], 15);
        
        // Open popup after delay
        setTimeout(() => {
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker) {
                    const markerLat = layer.getLatLng().lat;
                    const markerLng = layer.getLatLng().lng;
                    if (Math.abs(markerLat - lat) < 0.001 && Math.abs(markerLng - lng) < 0.001) {
                        layer.openPopup();
                    }
                }
            });
        }, 800);
    }
}

// Fullscreen functions
window.openFullscreen = function(index) {
    console.log("🖥️ Opening fullscreen for mural index:", index);
    const mural = muralData[index];
    
    // Close any existing popup
    if (fullscreenPopup) {
        document.body.removeChild(fullscreenPopup);
    }
    
    // Create fullscreen overlay
    fullscreenPopup = document.createElement('div');
    fullscreenPopup.className = 'fullscreen-popup';
    
    fullscreenPopup.innerHTML = `
        <div class="fullscreen-content">
            <button class="close-fullscreen-btn" onclick="closeFullscreen()">×</button>
            <h2 class="fullscreen-title">${mural.name}</h2>
            
            <div class="fullscreen-image-container">
                ${createFullscreenImages(mural.images, mural.name)}
            </div>
            
            <div class="fullscreen-details">
                <div class="fullscreen-artist">
                    <strong>Artist:</strong> ${mural.artist || 'Unknown'}
                </div>
                <div class="fullscreen-description">
                    <strong>Description:</strong> ${mural.description}
                </div>
                <div class="fullscreen-location">
                    <strong>Location:</strong> ${mural.locationDesc}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(fullscreenPopup);
    document.body.style.overflow = 'hidden';
    
    // Close popup on map
    map.closePopup();
};

// Create fullscreen images layout
function createFullscreenImages(images, muralName) {
    if (!images || images.length === 0) {
        return '<p class="no-image">No image available</p>';
    }
    
    // Single image in fullscreen
    if (images.length === 1) {
        return `
            <div class="fullscreen-image-item">
                <img src="Images/${cleanImageFileName(images[0])}" 
                     alt="${muralName}" 
                     class="fullscreen-image single-image">
                <div class="image-caption">${cleanImageFileName(images[0])}</div>
            </div>
        `;
    }
    
    // Multiple images in fullscreen - side by side
    return `
        <div class="fullscreen-images-grid">
            ${images.map(img => `
                <div class="fullscreen-image-item">
                    <img src="Images/${cleanImageFileName(img)}" 
                         alt="${muralName}" 
                         class="fullscreen-grid-image">
                    <div class="image-caption">${cleanImageFileName(img)}</div>
                </div>
            `).join('')}
        </div>
    `;
}

window.closeFullscreen = function() {
    if (fullscreenPopup) {
        document.body.removeChild(fullscreenPopup);
        fullscreenPopup = null;
        document.body.style.overflow = '';
    }
};

// Close fullscreen with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fullscreenPopup) {
        closeFullscreen();
    }
});