// app.js - Main application logic

// Define createCustomIcon at the top level
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });
}

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
    const map = L.map('map').setView([26.5, 92.5], 8);
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
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);