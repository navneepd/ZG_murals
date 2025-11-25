// app.js - With side-by-side images for multiple images
console.log("🚀 app.js started loading");

let map;
let fullscreenPopup = null;
let markersGroup = null;

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
    
    // Prevent map click from closing popups when clicking on popup content
    map.on('click', function(e) {
        // Only close popup if clicking on map, not on popup
        const popup = map._popup;
        if (popup) {
            const popupElement = popup.getElement();
            if (popupElement && popupElement.contains(e.originalEvent.target)) {
                e.originalEvent.stopPropagation();
                return;
            }
        }
    });
    
    // Statistics
    const stats = calculateStats();
    document.getElementById('total-murals').textContent = stats.totalMurals;
    document.getElementById('cities-count').textContent = stats.citiesCount;
    document.getElementById('artists-count').textContent = stats.artistsCount;
    document.getElementById('images-count').textContent = stats.imagesCount;
    
    // Create mural list and markers
    const muralList = document.getElementById('mural-list');

    // Create a marker cluster group to handle overlapping markers
    markersGroup = L.markerClusterGroup();
    
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
            const marker = L.marker([lat, lng]);

            // Create popup content immediately (not lazily)
            const popupContent = createPopupContent(mural, index);
            
            // Determine popup width based on screen size
            const isMobile = window.innerWidth <= 480;
            const maxWidth = isMobile ? Math.min(window.innerWidth - 40, 350) : 400;
            const maxHeight = isMobile ? Math.min(window.innerHeight - 120, 500) : 600;
            
            // Bind popup with the full content
            marker.bindPopup(popupContent, {
                className: 'centered-popup',
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                autoPan: true,
                autoPanPadding: [50, 50],
                closeButton: true,
                closeOnClick: false
            });

            // Prevent popup from closing when clicking inside it
            marker.on('popupopen', function() {
                const popup = marker.getPopup();
                if (popup) {
                    const popupElement = popup.getElement();
                    if (popupElement) {
                        popupElement.style.pointerEvents = 'auto';
                        popupElement.addEventListener('click', function(e) {
                            e.stopPropagation();
                        });
                    }
                }
            });

            // Add marker to the cluster group (not directly to the map)
            markersGroup.addLayer(marker);
        }
    });
    // Add clustered markers to the map
    map.addLayer(markersGroup);

    console.log("✅ App initialized successfully!");
}

// Create centered popup content with side-by-side images
function createPopupContent(mural, index) {
    return `
        <div class="popup-content" style="pointer-events: auto;">
            <h3 class="popup-title">${mural.name}</h3>
            <div class="popup-image-container">
                ${createPopupImages(mural.images, mural.name, index)}
            </div>
            <div class="popup-artist"><strong>Artist:</strong> ${mural.artist || 'Unknown'}</div>
            <div class="popup-description"><strong>Description:</strong> ${mural.description}</div>
            <div class="popup-location"><strong>Location:</strong> ${mural.locationDesc}</div>
            <div style="margin-top: 10px; pointer-events: auto;">
                <button class="fullscreen-btn" onclick="event.preventDefault(); event.stopPropagation(); openFullscreen(${index}); return false;">📱 Fullscreen View</button>
            </div>
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
        return `<img src="Images/${cleanImageFileName(images[0])}" alt="${muralName}" class="popup-main-image single-image" loading="lazy" onclick="event.preventDefault(); event.stopPropagation(); openFullscreen(${index}); return false;">`;
    }
    
    // Multiple images - grid
    let gridHTML = '<div class="popup-images-grid">';
    for (let i = 0; i < images.length; i++) {
        const cleanName = cleanImageFileName(images[i]);
        gridHTML += `<div class="popup-image-item"><img src="Images/${cleanName}" alt="${muralName}" class="popup-grid-image" loading="lazy" onclick="event.preventDefault(); event.stopPropagation(); openFullscreen(${index}); return false;"><div class="image-counter">${i + 1}/${images.length}</div></div>`;
    }
    gridHTML += '</div>';
    return gridHTML;
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
            // Prefer searching markers in the global markersGroup (markercluster)
            let opened = false;
            if (markersGroup && typeof markersGroup.eachLayer === 'function') {
                markersGroup.eachLayer(function(subLayer) {
                    if (subLayer instanceof L.Marker) {
                        const mLat = subLayer.getLatLng().lat;
                        const mLng = subLayer.getLatLng().lng;
                        if (!opened && Math.abs(mLat - lat) < 0.0005 && Math.abs(mLng - lng) < 0.0005) {
                            subLayer.openPopup();
                            opened = true;
                        }
                    }
                });
            }

            // Fallback: check all map layers
            if (!opened) {
                map.eachLayer(function(layer) {
                    if (layer instanceof L.Marker) {
                        const markerLat = layer.getLatLng().lat;
                        const markerLng = layer.getLatLng().lng;
                        if (!opened && Math.abs(markerLat - lat) < 0.0005 && Math.abs(markerLng - lng) < 0.0005) {
                            layer.openPopup();
                            opened = true;
                        }
                    }
                });
            }
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
                     class="fullscreen-image single-image"
                     loading="lazy">
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
                    class="fullscreen-grid-image"
                    loading="lazy">
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