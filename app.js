// app.js - Optimized for mobile with auto-scroll, popup positioning, and fullscreen popups

let map;
let userLocationMarker = null;
let fullscreenPopup = null;

// Custom marker icon function
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });
}

// Scroll to map function
function scrollToMap() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });
    }
}

// Create fullscreen popup
function createFullscreenPopup(mural) {
    // Remove existing fullscreen popup
    if (fullscreenPopup) {
        document.body.removeChild(fullscreenPopup);
    }
    
    // Create fullscreen overlay
    fullscreenPopup = document.createElement('div');
    fullscreenPopup.className = 'fullscreen-popup';
    fullscreenPopup.innerHTML = `
        <div class="fullscreen-popup-content">
            <button class="close-fullscreen-btn">&times;</button>
            <h2>${mural.name}</h2>
            ${mural.locationDesc ? `<p><strong>Location:</strong> ${mural.locationDesc}</p>` : ''}
            ${mural.description ? `<p><strong>Description:</strong> ${mural.description}</p>` : ''}
            ${mural.artist ? `<p><strong>Artist:</strong> ${mural.artist}</p>` : ''}
            <div class="fullscreen-images">
                ${createFullscreenImages(mural.images, mural.name)}
            </div>
        </div>
    `;
    
    // Add close event
    const closeBtn = fullscreenPopup.querySelector('.close-fullscreen-btn');
    closeBtn.addEventListener('click', closeFullscreenPopup);
    
    // Add click outside to close
    fullscreenPopup.addEventListener('click', function(e) {
        if (e.target === fullscreenPopup) {
            closeFullscreenPopup();
        }
    });
    
    // Add escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fullscreenPopup) {
            closeFullscreenPopup();
        }
    });
    
    document.body.appendChild(fullscreenPopup);
    
    // Prevent body scroll when fullscreen popup is open
    document.body.style.overflow = 'hidden';
}

// Create fullscreen images HTML
function createFullscreenImages(images, muralName) {
    if (!images || images.length === 0) {
        return '<p><em>No images available</em></p>';
    }
    
    let html = '<div class="fullscreen-image-gallery">';
    
    images.forEach(img => {
        const cleanImg = cleanImageFileName(img);
        const imageUrl = `Images/${cleanImg}`;
        
        html += `
            <div class="fullscreen-image-item">
                <img src="${imageUrl}" alt="${muralName}" class="fullscreen-image">
                <div class="image-caption">${cleanImg}</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Close fullscreen popup
function closeFullscreenPopup() {
    if (fullscreenPopup) {
        document.body.removeChild(fullscreenPopup);
        fullscreenPopup = null;
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Initialize the application
function initApp() {
    console.log('Initializing Zubeen Garg Murals Map...');
    
    // Initialize map
    map = L.map('map').setView([26.5, 92.5], 8);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Display statistics
    const stats = calculateStats();
    document.getElementById('total-murals').textContent = stats.totalMurals;
    document.getElementById('cities-count').textContent = stats.citiesCount;
    document.getElementById('artists-count').textContent = stats.artistsCount;
    document.getElementById('images-count').textContent = stats.imagesCount;

    // Create mural list and markers
    const muralList = document.getElementById('mural-list');
    const markers = [];
    
    muralData.forEach((mural, index) => {
        // Create list item
        const muralItem = document.createElement('div');
        muralItem.className = 'mural-item';
        muralItem.innerHTML = `
            <div class="mural-name">${mural.name}</div>
            <div class="mural-location">${mural.locationDesc || 'Location not specified'}</div>
        `;
        
        // Add click event to list item
        muralItem.addEventListener('click', () => {
            const lat = dmsToDecimal(mural.lat);
            const lng = dmsToDecimal(mural.lng);
            
            if (lat && lng) {
                // 1. Scroll to map
                scrollToMap();
                
                // 2. Center map on mural location
                map.setView([lat, lng], 15, { animate: true });
                
                // 3. Open popup after short delay
                setTimeout(() => {
                    if (markers[index]) {
                        markers[index].openPopup();
                    }
                }, 500);
            }
        });
        
        muralList.appendChild(muralItem);

        // Create map marker
        const lat = dmsToDecimal(mural.lat);
        const lng = dmsToDecimal(mural.lng);
        
        if (lat && lng) {
            const markerColor = getMarkerColor(mural.locationDesc);
            const marker = L.marker([lat, lng], {
                icon: createCustomIcon(markerColor)
            }).addTo(map);
            
            // Create popup content with fullscreen button
            const popupContent = `
                <div class="popup-content">
                    <h3>${mural.name}</h3>
                    <p><strong>Location:</strong> ${mural.locationDesc || 'Not specified'}</p>
                    <p><strong>Description:</strong> ${mural.description || 'No description'}</p>
                    <p><strong>Artist:</strong> ${mural.artist || 'Unknown'}</p>
                    ${createImageDisplay(mural.images, mural.name)}
                    <div class="popup-actions">
                        <button class="fullscreen-btn" data-mural-index="${index}">
                            📱 Fullscreen View
                        </button>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent, {
                maxWidth: 400,
                className: 'custom-popup',
                autoPan: true,
                autoPanPadding: [50, 50]
            });
            
            // Add event listener for fullscreen button after popup opens
            marker.on('popupopen', function() {
                const fullscreenBtn = document.querySelector('.fullscreen-btn');
                if (fullscreenBtn) {
                    fullscreenBtn.addEventListener('click', function() {
                        const muralIndex = this.getAttribute('data-mural-index');
                        createFullscreenPopup(muralData[muralIndex]);
                        map.closePopup(); // Close the small popup
                    });
                }
            });
            
            markers[index] = marker;
        }
    });

    // Initialize mobile controls
    initMobileControls();
}

// Mobile controls
function initMobileControls() {
    // Toggle list button
    const toggleBtn = document.getElementById('toggle-list');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const infoPanel = document.querySelector('.info-panel');
            infoPanel.style.display = infoPanel.style.display === 'none' ? 'block' : 'none';
            this.textContent = infoPanel.style.display === 'none' ? 'Show List' : 'Hide List';
        });
    }
    
    // Locate me button
    const locateBtn = document.getElementById('locate-me');
    if (locateBtn) {
        locateBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        if (userLocationMarker) {
                            map.removeLayer(userLocationMarker);
                        }
                        
                        userLocationMarker = L.marker([lat, lng], {
                            icon: createCustomIcon('#ff0000')
                        }).addTo(map).bindPopup('Your location').openPopup();
                        
                        map.setView([lat, lng], 13);
                    },
                    (error) => {
                        alert('Could not get your location: ' + error.message);
                    }
                );
            } else {
                alert('Geolocation not supported');
            }
        });
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);