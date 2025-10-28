// app.js - Main application logic with mobile optimizations

// Define createCustomIcon at the top level
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });
}

// Mobile-specific variables
let map;
let userLocationMarker = null;
let isListVisible = true;

// Initialize the application
function initApp() {
    console.log('Initializing app...');
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded!');
        return;
    }
    
    // Check if muralData is available
    if (typeof muralData === 'undefined') {
        console.error('muralData not found! Check Mural-list.js loading.');
        return;
    }
    
    console.log('Mural data loaded:', muralData.length, 'murals');

    // Initialize the map
    map = L.map('map').setView([26.5, 92.5], 8);
    console.log('Map initialized');

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Calculate and display statistics
    const stats = calculateStats();
    document.getElementById('total-murals').textContent = stats.totalMurals;
    document.getElementById('cities-count').textContent = stats.citiesCount;
    document.getElementById('artists-count').textContent = stats.artistsCount;
    document.getElementById('images-count').textContent = stats.imagesCount;

    // Create mural list
    const muralList = document.getElementById('mural-list');
    const markers = [];
    
    muralData.forEach((mural, index) => {
        const muralItem = document.createElement('div');
        muralItem.className = 'mural-item';
        muralItem.innerHTML = `
            <div class="mural-name">${mural.name}</div>
            <div class="mural-location">${mural.locationDesc || 'Location not specified'}</div>
        `;
        
        muralItem.addEventListener('click', () => {
            const lat = dmsToDecimal(mural.lat);
            const lng = dmsToDecimal(mural.lng);
            
            console.log(`Clicked mural: ${mural.name}`, {lat, lng});
            
            if (lat && lng) {
                map.setView([lat, lng], 13);
                const marker = markers[index];
                if (marker) {
                    marker.openPopup();
                }
            } else {
                console.warn('Invalid coordinates for mural:', mural.name);
            }
        });
        
        muralList.appendChild(muralItem);
    });

    // Add markers for each mural
    let markersCreated = 0;
    
    muralData.forEach((mural, index) => {
        const lat = dmsToDecimal(mural.lat);
        const lng = dmsToDecimal(mural.lng);
        
        console.log(`Processing mural ${index}: ${mural.name}`, {lat, lng});
        
        if (lat && lng) {
            const markerColor = getMarkerColor(mural.locationDesc);
            
            // Use the createCustomIcon function
            const marker = L.marker([lat, lng], {
                icon: createCustomIcon(markerColor)
            }).addTo(map);
            
            // Create popup content
            let popupContent = `<div class="popup-content">`;
            popupContent += `<h3>${mural.name}</h3>`;
            
            if (mural.locationDesc) {
                popupContent += `<p><strong>Location:</strong> ${mural.locationDesc}</p>`;
            }
            
            if (mural.description) {
                popupContent += `<p><strong>Description:</strong> ${mural.description}</p>`;
            }
            
            if (mural.artist) {
                popupContent += `<p><strong>Artist:</strong> ${mural.artist}</p>`;
            }
            
            popupContent += createImageDisplay(mural.images, mural.name);
            popupContent += `</div>`;
            
            marker.bindPopup(popupContent, { 
                maxWidth: 500,
                className: 'custom-popup'
            });
            
            markers[index] = marker;
            markersCreated++;
            
            console.log(`Marker created for: ${mural.name}`);
        } else {
            markers[index] = null;
            console.warn(`Could not create marker for: ${mural.name} - Invalid coordinates`);
        }
    });
    
    console.log(`Successfully created ${markersCreated} out of ${muralData.length} markers`);
    
    // Initialize mobile controls
    initMobileControls();
}

// Initialize mobile-specific controls
function initMobileControls() {
    // Toggle list visibility
    document.getElementById('toggle-list').addEventListener('click', function() {
        const infoPanel = document.querySelector('.info-panel');
        if (isListVisible) {
            infoPanel.style.display = 'none';
            this.textContent = 'Show List';
        } else {
            infoPanel.style.display = 'block';
            this.textContent = 'Hide List';
        }
        isListVisible = !isListVisible;
    });
    
    // Locate me functionality
    document.getElementById('locate-me').addEventListener('click', function() {
        if (navigator.geolocation) {
            this.textContent = 'Locating...';
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Remove previous location marker
                    if (userLocationMarker) {
                        map.removeLayer(userLocationMarker);
                    }
                    
                    // Add new location marker
                    userLocationMarker = L.marker([lat, lng], {
                        icon: createCustomIcon('#ff0000')
                    }).addTo(map);
                    
                    userLocationMarker.bindPopup('Your current location').openPopup();
                    
                    // Center map on user location
                    map.setView([lat, lng], 13);
                    
                    document.getElementById('locate-me').textContent = 'Locate Me';
                },
                function(error) {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please check your device settings.');
                    document.getElementById('locate-me').textContent = 'Locate Me';
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
    
    // Add touch gesture for map (prevent default behavior)
    const mapElement = document.getElementById('map');
    mapElement.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            map.invalidateSize();
        }, 200);
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);