// Debug test
console.log("=== DEBUG START ===");
console.log("app.js is loading");
console.log("Leaflet available:", typeof L !== 'undefined');
console.log("muralData available:", typeof muralData !== 'undefined');
if (typeof muralData !== 'undefined') {
    console.log("Murals count:", muralData.length);
    console.log("First mural:", muralData[0]);
}
console.log("=== DEBUG END ===");
// app.js - SIMPLIFIED VERSION
console.log("🚀 app.js started loading");

let map;
let fullscreenPopup = null;

// Wait for everything to load
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM loaded, initializing app...");
    
    // Check requirements
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
    
    console.log("📊 Setting up statistics...");
    // Statistics
    const stats = calculateStats();
    document.getElementById('total-murals').textContent = stats.totalMurals;
    document.getElementById('cities-count').textContent = stats.citiesCount;
    document.getElementById('artists-count').textContent = stats.artistsCount;
    document.getElementById('images-count').textContent = stats.imagesCount;
    
    console.log("🎨 Creating mural list and markers...");
    // Create list and markers
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
            console.log("📱 Clicked mural:", mural.name);
            focusOnMural(mural, index);
        });
        
        muralList.appendChild(item);
        
        // Create marker
        const lat = dmsToDecimal(mural.lat);
        const lng = dmsToDecimal(mural.lng);
        
        if (lat && lng) {
            const color = getMarkerColor(mural.locationDesc);
            const marker = L.marker([lat, lng]).addTo(map);
            
            const popupContent = `
                <div class="popup-content">
                    <h3>${mural.name}</h3>
                    <p><strong>Location:</strong> ${mural.locationDesc}</p>
                    <p><strong>Artist:</strong> ${mural.artist}</p>
                    <p><strong>Description:</strong> ${mural.description}</p>
                    <button class="fullscreen-btn" onclick="openFullscreen(${index})">
                        📱 Fullscreen View
                    </button>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        }
    });
    
    console.log("✅ App initialized successfully!");
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

// Make this function global so it can be called from popup
window.openFullscreen = function(index) {
    console.log("🖥️ Opening fullscreen for mural index:", index);
    const mural = muralData[index];
    
    // Close any existing popup
    if (fullscreenPopup) {
        document.body.removeChild(fullscreenPopup);
    }
    
    // Create fullscreen overlay
    fullscreenPopup = document.createElement('div');
    fullscreenPopup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    fullscreenPopup.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 90%; max-height: 90%; overflow: auto; position: relative;">
            <button onclick="closeFullscreen()" style="position: absolute; top: 10px; right: 15px; background: red; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">×</button>
            <h2>${mural.name}</h2>
            <p><strong>Location:</strong> ${mural.locationDesc}</p>
            <p><strong>Artist:</strong> ${mural.artist}</p>
            <p><strong>Description:</strong> ${mural.description}</p>
            <div style="margin-top: 15px;">
                ${mural.images.map(img => `
                    <div style="margin-bottom: 15px; text-align: center;">
                        <img src="Images/${img}" style="max-width: 100%; max-height: 300px; border-radius: 5px;">
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">${img}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(fullscreenPopup);
    document.body.style.overflow = 'hidden';
    
    // Close popup on map
    map.closePopup();
};

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
