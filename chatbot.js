// chatbot.js - AI Chatbot for locating nearby murals

class MuralChatbot {
    constructor() {
        this.conversationHistory = [];
        this.userLocation = null;
        this.initializeChatbot();
    }

    initializeChatbot() {
        this.createChatbotUI();
        this.attachEventListeners();
        console.log("🤖 Mural Chatbot initialized");
    }

    createChatbotUI() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div class="chatbot-header">
                    <h3>🎨 Mural Guide</h3>
                    <button id="chatbot-toggle" class="chatbot-toggle" title="Minimize">−</button>
                </div>
                <div id="chat-messages" class="chat-messages">
                    <div class="chat-message bot-message">
                        <p>👋 Hi! I'm your Mural Guide. I can help you find nearby Zubeen Garg murals!</p>
                        <p>Ask me things like:</p>
                        <ul style="margin-left: 15px; margin-top: 8px;">
                            <li>"Find murals near me"</li>
                            <li>"Show murals in Guwahati"</li>
                            <li>"What murals are closest?"</li>
                            <li>"Tell me about a mural"</li>
                        </ul>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chat-input" 
                        class="chat-input" 
                        placeholder="Ask me something..." 
                        autocomplete="off"
                    />
                    <button id="chat-send" class="chat-send-btn">Send</button>
                </div>
            </div>
        `;

        // Insert chatbot before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', chatbotHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        }
    }

    attachEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatToggle = document.getElementById('chatbot-toggle');

        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        chatToggle.addEventListener('click', () => this.toggleChatbot());
    }

    toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        const messages = document.getElementById('chat-messages');
        const inputContainer = document.querySelector('.chat-input-container');
        const toggle = document.getElementById('chatbot-toggle');

        if (messages.style.display === 'none') {
            messages.style.display = 'block';
            inputContainer.style.display = 'flex';
            toggle.textContent = '−';
        } else {
            messages.style.display = 'none';
            inputContainer.style.display = 'none';
            toggle.textContent = '+';
        }
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const userText = input.value.trim();

        if (!userText) return;

        // Add user message
        this.addMessage(userText, 'user');
        input.value = '';

        // Process and respond
        this.processUserQuery(userText);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        if (sender === 'user') {
            messageDiv.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
        } else {
            messageDiv.innerHTML = text; // Bot can send HTML
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    processUserQuery(query) {
        const lowerQuery = query.toLowerCase();

        // Detect intent
        if (lowerQuery.includes('near me') || lowerQuery.includes('closest') || lowerQuery.includes('nearby')) {
            this.handleNearbyQuery();
        } else if (lowerQuery.includes('guwahati') || lowerQuery.includes('assam')) {
            this.handleLocationQuery(query);
        } else if (lowerQuery.includes('tell') || lowerQuery.includes('about') || lowerQuery.includes('info')) {
            this.handleInfoQuery(query);
        } else if (lowerQuery.includes('list') || lowerQuery.includes('all') || lowerQuery.includes('show')) {
            this.handleListQuery();
        } else if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
            this.handleHelpQuery();
        } else {
            this.handleGeneralQuery(query);
        }
    }

    handleNearbyQuery() {
        if (!navigator.geolocation) {
            this.addMessage(
                '📍 <strong>Geolocation not available</strong><p>Your browser doesn\'t support geolocation. Please enable location services or ask for murals in a specific city.</p>',
                'bot'
            );
            return;
        }

        this.addMessage('📍 Getting your location...', 'bot');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.showNearbyMurals();
            },
            (error) => {
                this.addMessage(
                    '❌ <strong>Location access denied</strong><p>Please enable location services in your browser settings, or tell me a city name instead!</p>',
                    'bot'
                );
            }
        );
    }

    showNearbyMurals() {
        if (!this.userLocation || !muralData) return;

        // Calculate distances
        const muralsWithDistance = muralData
            .map(mural => {
                const lat = dmsToDecimal(mural.lat);
                const lng = dmsToDecimal(mural.lng);
                if (!lat || !lng) return null;

                const distance = this.calculateDistance(
                    this.userLocation.lat,
                    this.userLocation.lng,
                    lat,
                    lng
                );

                return { ...mural, distance, lat, lng };
            })
            .filter(m => m !== null)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        if (muralsWithDistance.length === 0) {
            this.addMessage('😔 No murals found in your area.', 'bot');
            return;
        }

        let response = '<strong>🎨 5 Nearest Murals to You:</strong><ul style="margin: 10px 0 10px 20px;">';
        muralsWithDistance.forEach((mural, index) => {
            response += `
                <li>
                    <strong>${index + 1}. ${mural.name}</strong>
                    <br/>📍 ${mural.locationDesc}
                    <br/>🛣️ ${mural.distance.toFixed(1)} km away
                </li>
            `;
        });
        response += '</ul><p><em>Click on the mural name in the list on the left to see more details!</em></p>';

        this.addMessage(response, 'bot');

        // Focus on first mural on map
        if (muralsWithDistance[0] && window.map) {
            window.map.setView([muralsWithDistance[0].lat, muralsWithDistance[0].lng], 12);
        }
    }

    handleLocationQuery(query) {
        const cityKeywords = {
            guwahati: ['guwahati', 'dispur'],
            jorhat: ['jorhat'],
            lakhimpur: ['lakhimpur', 'north lakhimpur'],
            dibrugarh: ['dibrugarh'],
            sivasagar: ['sivasagar'],
            morigaon: ['morigaon'],
            dhemaji: ['dhemaji'],
            tezpur: ['tezpur']
        };

        let matchedCity = null;
        const lowerQuery = query.toLowerCase();

        for (const [city, keywords] of Object.entries(cityKeywords)) {
            if (keywords.some(keyword => lowerQuery.includes(keyword))) {
                matchedCity = city;
                break;
            }
        }

        if (!matchedCity) {
            this.addMessage('🏙️ Which city are you interested in? Try: Guwahati, Jorhat, Lakhimpur, Dibrugarh, Sivasagar, or Tezpur', 'bot');
            return;
        }

        const filteredMurals = muralData.filter(mural => 
            mural.locationDesc && mural.locationDesc.toLowerCase().includes(matchedCity)
        );

        if (filteredMurals.length === 0) {
            this.addMessage(`😔 No murals found in ${matchedCity}.`, 'bot');
            return;
        }

        let response = `<strong>🎨 Murals in ${matchedCity.toUpperCase()}:</strong><ul style="margin: 10px 0 10px 20px;">`;
        filteredMurals.forEach((mural, index) => {
            response += `
                <li>
                    <strong>${index + 1}. ${mural.name}</strong>
                    <br/>📍 ${mural.locationDesc}
                    <br/>👤 Artist: ${mural.artist}
                </li>
            `;
        });
        response += '</ul>';

        this.addMessage(response, 'bot');
    }

    handleInfoQuery(query) {
        const muralName = this.findMuralByName(query);

        if (!muralName) {
            this.addMessage('🔍 Which mural would you like to know about? Try mentioning its name!', 'bot');
            return;
        }

        let response = `
            <strong>${muralName.name}</strong>
            <p><strong>📍 Location:</strong> ${muralName.locationDesc}</p>
            <p><strong>📝 Description:</strong> ${muralName.description}</p>
            <p><strong>👤 Artist(s):</strong> ${muralName.artist}</p>
            <p><strong>📸 Images:</strong> ${muralName.images.length} available</p>
        `;

        this.addMessage(response, 'bot');
    }

    handleListQuery() {
        const stats = calculateStats();
        let response = `
            <strong>📊 Zubeen Garg Murals Overview:</strong>
            <ul style="margin: 10px 0 10px 20px;">
                <li><strong>Total Murals:</strong> ${stats.totalMurals}</li>
                <li><strong>Cities & Towns:</strong> ${stats.citiesCount}</li>
                <li><strong>Contributing Artists:</strong> ${stats.artistsCount}</li>
                <li><strong>Total Images:</strong> ${stats.imagesCount}</li>
            </ul>
            <p>Scroll through the mural list on the left to explore them all!</p>
        `;

        this.addMessage(response, 'bot');
    }

    handleHelpQuery() {
        const response = `
            <strong>❓ How to use the Mural Guide:</strong>
            <ul style="margin: 10px 0 10px 20px;">
                <li><strong>"Find murals near me"</strong> - Shows nearby murals based on your location</li>
                <li><strong>"Show murals in [city]"</strong> - Lists murals in a specific city</li>
                <li><strong>"Tell me about [mural name]"</strong> - Details about a specific mural</li>
                <li><strong>"List all murals"</strong> - Shows statistics</li>
            </ul>
        `;

        this.addMessage(response, 'bot');
    }

    handleGeneralQuery(query) {
        this.addMessage(
            `🤔 I'm here to help you find Zubeen Garg murals! Try asking me to find nearby murals, show murals in a city, or tell you about a specific mural.`,
            'bot'
        );
    }

    findMuralByName(query) {
        return muralData.find(mural => 
            query.toLowerCase().includes(mural.name.toLowerCase()) ||
            mural.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula to calculate distance between two points
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof muralData !== 'undefined') {
        new MuralChatbot();
    }
});
