// chatbot.js - ZG Chronicle Bot with Interesting Facts about Murals

class MuralChatbot {
    constructor() {
        this.conversationHistory = [];
        this.userLocation = null;
        this.factsShared = [];
        this.initializeChatbot();
    }

    initializeChatbot() {
        this.createChatbotUI();
        this.attachEventListeners();
        console.log("🎸 ZG Chronicle initialized");
    }

    // Knowledge base of interesting facts about murals
    getMuralFacts() {
        return {
            facts: [
                { emoji: "🎵", fact: "Zubeen Garg has recorded over 38000+ songs in Assamese, Hindi, English, and other languages, making him one of the most prolific musicians in India." },
                { emoji: "🏛️", fact: "The murals across Assam represent over 50+ artists collaborating to celebrate Zubeen Da's legacy and cultural impact on the state." },
                { emoji: "📍", fact: "Zubeen Garg murals are spread across 8+ districts of Assam - from Guwahati to Dhemaji, creating a 'Ballad Trail' of artistic tributes." },
                { emoji: "🎨", fact: "Each mural tells a unique story - some capture him in concert mode, others show him as a cultural revolutionary and poet." },
                { emoji: "❤️", fact: "Fans travel from across Assam and India to visit these murals, turning them into pilgrimage sites of cultural reverence." },
                { emoji: "🎭", fact: "The largest murals are 12x15 feet, taking months to complete and requiring teams of 5-10 skilled artists." },
                { emoji: "🌟", fact: "Zubeen Garg's activism transcends music - he's been a voice for social causes, which is reflected in murals like 'Che Guevara of Assam'." },
                { emoji: "📸", fact: "Over 60+ high-quality images of these murals are now documented, creating a digital archive of Assam's street art culture." },
                { emoji: "🎸", fact: "His iconic instruments (guitar, keyboard) appear in nearly every mural, symbolizing music as his life force." },
                { emoji: "🌍", fact: "The 'Comrade Never Die' mural stands as a testament to how Zubeen's spirit lives on through his art and activism." },
                { emoji: "🏞️", fact: "Locations range from busy highways to serene college campuses - murals bring Zubeen's presence everywhere in Assam." },
                { emoji: "💫", fact: "The Guwahati port murals near Rajaduwar Ferry feature multiple artistic styles, showing how different artists interpret his legacy." },
                { emoji: "🎯", fact: "Each mural is marked with 'Marked' status, indicating they are recognized cultural landmarks in their respective cities." },
                { emoji: "🗣️", fact: "Collaborations between artists have created a unique artistic movement - individual styles merged into collective tributes." },
                { emoji: "🌈", fact: "The murals use vibrant colors symbolizing Zubeen's diverse musical genres - rock, folk, pop, and Assamese traditional music." }
            ]
        };
    }

    // Get facts about specific murals
    getMuralSpecificFacts(muralName) {
        const specificFacts = {
            "Zubeen Da's Blessing": "🙏 This flyover mural symbolizes the blessings Zubeen Da has given through his music to millions of fans.",
            "The Voice of the Brahmaputra": "🌊 Located in Dimow, Dhemaji - this mural celebrates Zubeen's connection to Assam's mighty river and landscape.",
            "Che Guevara of Assam": "✊ A powerful political statement showing Zubeen as a revolutionary voice for social justice and people's movements.",
            "OG মন যায়": "📽️ At AEC Campus - references the iconic film where Zubeen performed at this very location decades ago.",
            "The Eternal Echo Mural": "🎤 Beneath Ganesguri Flyover - 'COMRADE NEVER DIE' is not just graffiti, it's a collective promise by his fans.",
            "Mayabini Mural": "🎶 His most iconic song 'Mayabini' appears in multiple murals, showing its eternal significance in his legacy.",
            "The Stairway to heaven": "🎹 A surreal artwork showing Zubeen ascending via piano keys - music as a path to eternity.",
            "Baidew Hotel Mural": "❤️ Located in daily community spaces, this mural proves deep connections are formed through passion, not perfection.",
            "The Underpass Serenade": "🏙️ Transforms an anonymous underpass into a public shrine celebrating the urban cultural landscape.",
            "Be Rebel mural": "🔥 At B. Borooah College - fueling the next generation to be revolutionaries and visionaries like Zubeen Da."
        };
        return specificFacts[muralName] || null;
    }

    createChatbotUI() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-icon-wrapper">
                            <div class="chatbot-icon">🎸</div>
                            <div class="chatbot-pulse"></div>
                        </div>
                        <div class="chatbot-header-text">
                            <h3>ZG Chronicle</h3>
                            <p class="chatbot-status">Zubeen Garg's Mural Guide</p>
                        </div>
                    </div>
                    <button id="chatbot-toggle" class="chatbot-toggle" title="Minimize">
                        <span class="toggle-icon">−</span>
                    </button>
                </div>
                
                <div class="chatbot-divider"></div>
                
                <div id="chat-messages" class="chat-messages">
                    <div class="chat-message bot-message welcome-message">
                        <div class="message-avatar">🎸</div>
                        <div class="message-content">
                            <p><strong>Welcome to ZG Chronicle</strong></p>
                            <p>Explore the legendary murals of Zubeen Garg across Assam. Discover stories, locations, and the artistry behind each tribute.</p>
                            <div class="quick-actions">
                                <button class="quick-action-btn btn-location" onclick="window.muralChatbot.quickAction('Find murals near me')">📍 Near Me</button>
                                <button class="quick-action-btn btn-city" onclick="window.muralChatbot.quickAction('Show murals in Guwahati')">🏙️ Explore</button>
                                <button class="quick-action-btn btn-info" onclick="window.muralChatbot.shareFact()">💡 Fun Fact</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <input 
                        type="text" 
                        id="chat-input" 
                        class="chat-input" 
                        placeholder="Ask about murals, locations, or artists..." 
                        autocomplete="off"
                    />
                    <button id="chat-send" class="chat-send-btn" title="Send">
                        <span>🎵</span>
                    </button>
                </div>
                
                <div class="chatbot-footer">
                    <p>Celebrating the legacy of Zubeen Garg</p>
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

        // Make chatbot accessible globally
        window.muralChatbot = this;
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

    quickAction(text) {
        const input = document.getElementById('chat-input');
        input.value = text;
        this.sendMessage();
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
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${this.escapeHtml(text)}</p>
                </div>
                <div class="message-avatar">👤</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">🎨</div>
                <div class="message-content">
                    ${text}
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    processUserQuery(query) {
        const lowerQuery = query.toLowerCase();

        // Detect intent
        // Detect intent
        const cityNames = [
            'guwahati', 'jorhat', 'lakhimpur', 'dibrugarh', 'sivasagar',
            'tezpur', 'morigaon', 'dhemaji', 'rangia', 'dudhnoi',
            'gauripur', 'bishwanath', 'nazira', 'demow', 'assam'
        ];

        const hasCityName = cityNames.some(city => lowerQuery.includes(city));

        if (lowerQuery.includes('near me') || lowerQuery.includes('closest') || lowerQuery.includes('nearby')) {
            this.handleNearbyQuery();
        } else if (hasCityName || lowerQuery.includes('city') || lowerQuery.includes('explore') || lowerQuery.includes('location')) {
            this.handleLocationQuery(query);
        } else if (lowerQuery.includes('fact') || lowerQuery.includes('interesting') || lowerQuery.includes('cool')) {
            this.shareFact();
        } else if (lowerQuery.includes('tell') || lowerQuery.includes('about') || lowerQuery.includes('info') || lowerQuery.includes('story')) {
            this.handleInfoQuery(query);
        } else if (lowerQuery.includes('list') || lowerQuery.includes('all') || lowerQuery.includes('show') || lowerQuery.includes('statistics')) {
            this.handleListQuery();
        } else if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
            this.handleHelpQuery();
        } else {
            this.handleGeneralQuery(query);
        }
    }

    shareFact() {
        const factsData = this.getMuralFacts();
        const allFacts = factsData.facts;

        // Get a random fact that hasn't been shared recently
        let randomFact;
        do {
            randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
        } while (this.factsShared.includes(randomFact.fact) && this.factsShared.length < allFacts.length);

        this.factsShared.push(randomFact.fact);
        if (this.factsShared.length > 5) this.factsShared.shift();

        // Extract search keywords from the fact
        const searchQuery = this.extractSearchTerms(randomFact.fact);
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

        const response = `
            <strong>${randomFact.emoji} Did you know?</strong>
            <p>${randomFact.fact}</p>
            <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                <button onclick="window.open('${googleSearchUrl}', '_blank')" style="background: #4285F4; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                    🔍 Verify on Google
                </button>
                <button onclick="window.muralChatbot.shareFact()" style="background: #a12373; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                    ♻️ Another Fact
                </button>
            </div>
            <p style="font-size: 0.75rem; color: #999; margin-top: 8px;">💡 Click "Verify on Google" to cross-check this fact or learn more!</p>
        `;

        this.addMessage(response, 'bot');
    }

    extractSearchTerms(fact) {
        // Extract relevant search terms from the fact for better Google searches
        const searchTerms = [
            'Zubeen Garg',
            'Assam',
            'murals'
        ];

        // Add specific terms from the fact
        if (fact.toLowerCase().includes('recorded') || fact.toLowerCase().includes('songs')) {
            searchTerms.push('songs');
        }
        if (fact.toLowerCase().includes('film') || fact.toLowerCase().includes('movie')) {
            searchTerms.push('film');
        }
        if (fact.toLowerCase().includes('activist') || fact.toLowerCase().includes('social')) {
            searchTerms.push('activism');
        }
        if (fact.toLowerCase().includes('musician')) {
            searchTerms.push('musician');
        }
        if (fact.toLowerCase().includes('legacy')) {
            searchTerms.push('legacy');
        }

        return searchTerms.join(' ');
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

                // Identify city from coordinates
                const city = this.identifyCityFromCoordinates(this.userLocation.lat, this.userLocation.lng);

                this.showNearbyMurals(city);
            },
            (error) => {
                this.addMessage(
                    '❌ <strong>Location access denied</strong><p>Please enable location services in your browser settings, or tell me a city name instead!</p>',
                    'bot'
                );
            }
        );
    }

    identifyCityFromCoordinates(lat, lng) {
        // City coordinates (approximate centers and bounds)
        const cities = {
            guwahati: { lat: 26.15, lng: 91.75, radius: 0.8 },
            jorhat: { lat: 26.75, lng: 94.20, radius: 0.6 },
            lakhimpur: { lat: 27.25, lng: 94.30, radius: 0.8 },
            dibrugarh: { lat: 27.50, lng: 94.95, radius: 0.7 },
            sivasagar: { lat: 26.98, lng: 94.65, radius: 0.6 },
            tezpur: { lat: 26.62, lng: 92.83, radius: 0.6 },
            morigaon: { lat: 26.35, lng: 92.25, radius: 0.6 },
            dhemaji: { lat: 27.50, lng: 93.90, radius: 0.6 },
            rangia: { lat: 26.44, lng: 91.62, radius: 0.5 },
            dudhnoi: { lat: 25.98, lng: 90.73, radius: 0.5 },
            gauripur: { lat: 26.08, lng: 89.97, radius: 0.5 },
            bishwanath: { lat: 26.72, lng: 93.15, radius: 0.5 },
            nazira: { lat: 26.92, lng: 94.73, radius: 0.4 }
        };

        let closestCity = 'guwahati';
        let minDistance = Infinity;

        for (const [city, coords] of Object.entries(cities)) {
            const distance = this.calculateDistance(lat, lng, coords.lat, coords.lng);
            if (distance < minDistance) {
                minDistance = distance;
                closestCity = city;
            }
        }

        return closestCity;
    }

    showNearbyMurals(identifiedCity = null) {
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
            const noMuralsMsg = `
                <strong>😔 No murals found near you</strong>
                <p>We haven't documented any murals in your current area yet, but that doesn't mean there aren't any!</p>
                <p><strong>📸 Help us grow the collection:</strong></p>
                <p>If you've spotted a Zubeen Garg mural or any public art tribute, we'd love to hear from you! Send us details about the location, and we'll add it to our map.</p>
                <p style="background: rgba(253, 187, 45, 0.2); padding: 12px; border-radius: 8px; border-left: 4px solid #fdbb2d;">
                    <strong>📧 Email:</strong> <a href="mailto:das.navneep09@gmail.com?subject=New Mural Submission - Zubeen Garg&body=Location: %0ADescription: %0AArtist (if known): %0AImages attached: " style="color: #fdbb2d;">das.navneep09@gmail.com</a>
                </p>
                <p style="font-size: 0.9rem; color: #aaa;">Include the location, description, and any photos you have!</p>
            `;
            this.addMessage(noMuralsMsg, 'bot');
            return;
        }

        let response = '';

        // Add location identification if available
        if (identifiedCity) {
            response += `<p style="color: #fdbb2d; font-style: italic; margin-bottom: 8px;">📍 You are in <strong>${identifiedCity.toUpperCase()}</strong></p>`;
        }

        response += '<strong>🎨 5 Nearest Murals to You:</strong><div style="margin: 12px 0; display: flex; flex-direction: column; gap: 8px;">';
        muralsWithDistance.forEach((mural, index) => {
            // Use the decimal lat/lng already in the mural object (converted earlier)
            const decLat = typeof mural.lat === 'number' ? mural.lat : dmsToDecimal(mural.lat);
            const decLng = typeof mural.lng === 'number' ? mural.lng : dmsToDecimal(mural.lng);
            // Escape single quotes in mural name for onclick handler
            const escapedName = mural.name.replace(/'/g, "\\'");
            response += `
                <div class="mural-card-clickable" onclick="window.muralChatbot.showMuralDetail('${escapedName}', ${decLat}, ${decLng})" style="cursor: pointer; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; border-left: 3px solid #fdbb2d; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='translateX(5px)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateX(0)'">
                    <strong style="color: #fdbb2d;">${index + 1}. ${mural.name}</strong>
                    <div style="font-size: 0.9rem; color: #ddd; margin-top: 4px;">📍 ${mural.locationDesc}</div>
                    <div style="font-size: 0.85rem; color: #aaa;">🛣️ ${mural.distance.toFixed(1)} km away</div>
                </div>
            `;
        });
        response += '</div><p style="font-size: 0.85rem; color: #999; margin-top: 10px;">💡 Click on any mural card above to view details!</p>';

        this.addMessage(response, 'bot');

        // Focus on first mural on map
        if (muralsWithDistance[0] && window.map) {
            window.map.setView([muralsWithDistance[0].lat, muralsWithDistance[0].lng], 12);
        }
    }

    handleLocationQuery(query) {
        // Comprehensive map of all locations to their city/district
        const locationCityMap = {
            // Guwahati/Dispur
            'dispur': 'guwahati',
            'flyover': 'guwahati',
            'guwahati': 'guwahati',
            'cotton': 'guwahati',
            'rajaduwar': 'guwahati',
            'university': 'guwahati',
            'khanapara': 'guwahati',
            'palasbari': 'guwahati',
            'lighthouse': 'guwahati',
            'light house': 'guwahati',
            'bhakti': 'guwahati',
            'triveni': 'guwahati',
            'rajdhani': 'guwahati',
            'sinha lodge': 'guwahati',
            'vishal': 'guwahati',
            'backyard': 'guwahati',
            'ganesguri': 'guwahati',
            'b. borooah': 'guwahati',
            'borooah': 'guwahati',
            'aec': 'guwahati',
            'engineering college': 'guwahati',
            'hostel': 'guwahati',

            // Lakhimpur District
            'north lakhimpur': 'lakhimpur',
            'north laximpur': 'lakhimpur',
            'lakhimpur': 'lakhimpur',
            'laximpur': 'lakhimpur',
            'gogamukh': 'lakhimpur',

            // Jorhat
            'jorhat': 'jorhat',
            'gandi': 'jorhat',
            'gandhi': 'jorhat',
            'stadium': 'jorhat',
            'jhanji': 'jorhat',
            'jamuguri': 'jorhat',

            // Dibrugarh
            'dibrugarh': 'dibrugarh',
            'convoy': 'dibrugarh',
            'railway': 'dibrugarh',
            'dikhow': 'dibrugarh',

            // Sivasagar
            'sivasagar': 'sivasagar',
            'lahoty': 'sivasagar',
            'joysagar': 'sivasagar',
            'bustand': 'sivasagar',
            'nazira': 'nazira',

            // Tezpur
            'tezpur': 'tezpur',
            'dolabari': 'tezpur',

            // Morigaon
            'morigaon': 'morigaon',
            'bihutoli': 'morigaon',

            // Dhemaji
            'dhemaji': 'dhemaji',
            'dimow': 'dhemaji',

            // Others
            'rangia': 'rangia',
            'dudhnoi': 'dudhnoi',
            'gauripur': 'gauripur',
            'bishwanath': 'bishwanath',
            'demow': 'demow'
        };

        const cityKeywords = {
            guwahati: ['guwahati', 'dispur', 'kamrup'],
            jorhat: ['jorhat'],
            lakhimpur: ['lakhimpur', 'laximpur'],
            dibrugarh: ['dibrugarh'],
            sivasagar: ['sivasagar', 'sibsagar'],
            morigaon: ['morigaon'],
            dhemaji: ['dhemaji'],
            tezpur: ['tezpur', 'sonitpur'],
            rangia: ['rangia'],
            dudhnoi: ['dudhnoi'],
            gauripur: ['gauripur'],
            bishwanath: ['bishwanath', 'biswanath'],
            nazira: ['nazira'],
            demow: ['demow']
        };

        let matchedCity = null;
        const lowerQuery = query.toLowerCase();

        // First check direct keywords
        for (const [city, keywords] of Object.entries(cityKeywords)) {
            if (keywords.some(keyword => lowerQuery.includes(keyword))) {
                matchedCity = city;
                break;
            }
        }

        // If no direct city match, check if query mentions a location from our map
        if (!matchedCity) {
            for (const [location, city] of Object.entries(locationCityMap)) {
                if (lowerQuery.includes(location)) {
                    matchedCity = city;
                    break;
                }
            }
        }

        if (!matchedCity) {
            const cityList = `
                <strong>🏙️ Available Cities with Murals:</strong>
                <div style="margin: 10px 0; background: rgba(253, 187, 45, 0.15); padding: 12px; border-radius: 8px; border-left: 4px solid #fdbb2d;">
                    <p style="margin: 0 0 8px 0;"><strong style="color: #fdbb2d;">Choose a city:</strong></p>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        <button onclick="window.muralChatbot.quickAction('Show murals in Guwahati')" style="background: #fdbb2d; color: #1a0a2e; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Guwahati</button>
                        <button onclick="window.muralChatbot.quickAction('Show murals in Jorhat')" style="background: #4ea0d2; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Jorhat</button>
                        <button onclick="window.muralChatbot.quickAction('Show murals in Lakhimpur')" style="background: #a12373; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Lakhimpur</button>
                        <button onclick="window.muralChatbot.quickAction('Show murals in Dibrugarh')" style="background: #816799; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Dibrugarh</button>
                        <button onclick="window.muralChatbot.quickAction('Show murals in Sivasagar')" style="background: #f4a460; color: #1a0a2e; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Sivasagar</button>
                        <button onclick="window.muralChatbot.quickAction('Show murals in Tezpur')" style="background: #3a9d7d; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Tezpur</button>
                        <button onclick="window.muralChatbot.quickAction('Show murals in Rangia')" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; font-weight: bold;">Rangia</button>
                    </div>
                </div>
            `;
            this.addMessage(cityList, 'bot');
            return;
        }

        // Filter murals by city field (much simpler and more reliable!)
        const filteredMurals = muralData.filter(mural => {
            if (!mural.city) return false;
            return mural.city.toLowerCase() === matchedCity.toLowerCase();
        });

        if (filteredMurals.length === 0) {
            const noMuralsMsg = `
                <strong>😔 No murals found in ${matchedCity}</strong>
                <p>We haven't documented any murals in ${matchedCity} yet, but there might be some we haven't found!</p>
                <p><strong>📸 Help us grow the collection:</strong></p>
                <p>If you know of a Zubeen Garg mural or public art tribute in or around ${matchedCity}, please share it with us!</p>
                <p style="background: rgba(253, 187, 45, 0.2); padding: 12px; border-radius: 8px; border-left: 4px solid #fdbb2d;">
                    <strong>📧 Email:</strong> <a href="mailto:das.navneep09@gmail.com?subject=New Mural in ${matchedCity} - Zubeen Garg&body=City: ${matchedCity}%0ALocation: %0ADescription: %0AArtist (if known): %0AImages attached: " style="color: #fdbb2d;">das.navneep09@gmail.com</a>
                </p>
                <p style="font-size: 0.9rem; color: #aaa;">Include the exact location, description, artist name (if known), and any photos!</p>
            `;
            this.addMessage(noMuralsMsg, 'bot');
            return;
        }

        let response = `<strong>🎨 Murals in ${matchedCity.toUpperCase()}:</strong><div style="margin: 12px 0; display: flex; flex-direction: column; gap: 8px;">`;
        filteredMurals.forEach((mural, index) => {
            const decLat = dmsToDecimal(mural.lat);
            const decLng = dmsToDecimal(mural.lng);
            // Escape single quotes in mural name for onclick handler
            const escapedName = mural.name.replace(/'/g, "\\'");
            response += `
                <div class="mural-card-clickable" onclick="window.muralChatbot.showMuralDetail('${escapedName}', ${decLat}, ${decLng})" style="cursor: pointer; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; border-left: 3px solid #fdbb2d; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='translateX(5px)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateX(0)'">
                    <strong style="color: #fdbb2d;">${index + 1}. ${mural.name}</strong>
                    <div style="font-size: 0.9rem; color: #ddd; margin-top: 4px;">📍 ${mural.locationDesc}</div>
                    <div style="font-size: 0.85rem; color: #aaa;">👤 Artist: ${mural.artist}</div>
                </div>
            `;
        });
        response += '</div><p style="font-size: 0.85rem; color: #999; margin-top: 10px;">💡 Click on any mural card above to view details!</p>';

        this.addMessage(response, 'bot');
    }

    handleInfoQuery(query) {
        const muralName = this.findMuralByName(query);

        if (!muralName) {
            this.addMessage('🔍 Which mural would you like to know about? Try mentioning its name!', 'bot');
            return;
        }

        // Get specific facts about the mural
        const specificFact = this.getMuralSpecificFacts(muralName.name);

        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(muralName.name + ' Zubeen Garg mural')}`;

        let response = `
            <strong>🎨 ${muralName.name}</strong>
            <p><strong>📍 Location:</strong> ${muralName.locationDesc}</p>
            <p><strong>📝 Description:</strong> ${muralName.description}</p>
            <p><strong>👤 Artist(s):</strong> ${muralName.artist}</p>
            <p><strong>📸 Images:</strong> ${muralName.images.length} available</p>
        `;

        if (specificFact) {
            response += `<p><strong>💡 Fun Fact:</strong> ${specificFact}</p>`;
        }

        response += `
            <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                <button onclick="window.open('${googleSearchUrl}', '_blank')" style="background: #4285F4; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                    🔍 Search on Google
                </button>
            </div>
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
            <strong>❓ How to use ZG Chronicle:</strong>
            <ul style="margin: 10px 0 10px 20px;">
                <li><strong>"Find murals near me"</strong> - Shows nearby murals based on your location</li>
                <li><strong>"Show murals in [city]"</strong> - Lists murals in a specific city</li>
                <li><strong>"Tell me about [mural name]"</strong> - Details about a specific mural with fascinating facts</li>
                <li><strong>"Fun fact"</strong> - Learn interesting facts about Zubeen Garg and the murals</li>
                <li><strong>"List all murals"</strong> - Shows statistics about the collection</li>
            </ul>
            <p style="background: rgba(253, 187, 45, 0.15); padding: 10px; border-radius: 8px; border-left: 3px solid #fdbb2d; margin-top: 10px;">
                <strong>✅ Fact Verification:</strong> All facts come with a "Verify on Google" button so you can cross-check information directly!
            </p>
        `;

        this.addMessage(response, 'bot');
    }

    handleGeneralQuery(query) {
        const response = `
            <p>🤔 I'm here to explore Zubeen Garg's mural legacy with you!</p>
            <p>Try asking me to:</p>
            <ul style="margin: 10px 0 10px 20px;">
                <li>Find nearby murals</li>
                <li>Explore murals in a specific city</li>
                <li>Learn about a specific mural</li>
                <li>Share interesting facts about Zubeen and his murals</li>
            </ul>
        `;
        this.addMessage(response, 'bot');
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

    showMuralDetail(muralName, lat, lng) {
        // Find the mural in muralData
        const mural = muralData.find(m => m.name === muralName);
        if (!mural) {
            console.error('Mural not found:', muralName);
            this.addMessage('❌ Could not find mural details. Please try again.', 'bot');
            return;
        }

        // Convert coordinates if they're DMS format
        const decLat = typeof lat === 'number' ? lat : dmsToDecimal(lat);
        const decLng = typeof lng === 'number' ? lng : dmsToDecimal(lng);

        if (!decLat || !decLng) {
            console.error('Invalid coordinates:', { lat, lng });
            this.addMessage('❌ Invalid location coordinates. Please try again.', 'bot');
            return;
        }

        // Create modal overlay with mobile-optimized layout
        const modalHTML = `
            <div id="mural-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: flex-start; justify-content: center; z-index: 2000; animation: fadeIn 0.3s ease; padding: 10px; padding-top: 40px; overflow-y: auto; -webkit-overflow-scrolling: touch;">
                <div style="background: linear-gradient(135deg, #1a0a2e 0%, #16213e 100%); border-radius: 16px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(161, 35, 115, 0.6); border: 2px solid #fdbb2d; animation: slideUp 0.3s ease;">
                    
                    <div style="background: linear-gradient(135deg, #a12373 0%, #816799 50%, #4ea0d2 100%); padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #fdbb2d; position: sticky; top: 0; z-index: 2001; gap: 12px;">
                        <h2 style="margin: 0; color: white; font-size: 1.3rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3); flex: 1; word-break: break-word;">🎨 ${mural.name}</h2>
                        <button onclick="window.muralChatbot.closeMuralModal()" style="background: rgba(255,255,255,0.2); border: 2px solid white; color: white; font-size: 1.5rem; min-width: 48px; min-height: 48px; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; flex-shrink: 0; touch-action: manipulation;">✕</button>
                    </div>
                    
                    <div style="padding: 16px; color: white;">
                        <div style="background: rgba(253, 187, 45, 0.15); padding: 14px; border-radius: 10px; border-left: 4px solid #fdbb2d; margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong style="color: #fdbb2d;">📍 Location:</strong></p>
                            <p style="margin: 0; color: #e0e0e0; font-size: 0.95rem; line-height: 1.4;">${mural.locationDesc}</p>
                        </div>
                        
                        <div style="background: rgba(78, 160, 210, 0.15); padding: 14px; border-radius: 10px; border-left: 4px solid #4ea0d2; margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong style="color: #4ea0d2;">📝 Description:</strong></p>
                            <p style="margin: 0; color: #e0e0e0; line-height: 1.5; font-size: 0.95rem;">${mural.description}</p>
                        </div>
                        
                        <div style="background: rgba(161, 35, 115, 0.15); padding: 14px; border-radius: 10px; border-left: 4px solid #a12373; margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong style="color: #a12373;">👤 Artist(s):</strong></p>
                            <p style="margin: 0; color: #e0e0e0; font-size: 0.95rem;">${mural.artist}</p>
                        </div>
                        
                        <div style="background: rgba(253, 187, 45, 0.1); padding: 14px; border-radius: 10px; margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; font-size: 0.95rem;"><strong style="color: #fdbb2d;">📊 Status:</strong></p>
                            <p style="margin: 0; color: #e0e0e0; font-size: 0.95rem;"><strong>${mural.status}</strong> ✓</p>
                        </div>
                        
                        ${mural.images && mural.images.length > 0 ? `
                            <div style="margin-bottom: 16px;">
                                <p style="margin: 0 0 10px 0; font-size: 0.95rem;"><strong style="color: #fdbb2d;">📸 Images (${mural.images.length}):</strong></p>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px;">
                                    ${mural.images.map(img => `
                                        <div style="background: rgba(0,0,0,0.3); border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.3s; touch-action: manipulation;">
                                            <img src="Images/${img}" alt="${mural.name}" style="width: 100%; height: 100px; object-fit: cover; display: block;" loading="lazy">
                                            <p style="margin: 4px; font-size: 0.7rem; color: #999; text-align: center; word-break: break-word; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${img}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <button onclick="window.muralChatbot.viewOnMap(${decLat}, ${decLng})" style="width: 100%; background: linear-gradient(135deg, #fdbb2d, #f4a460); color: #1a0a2e; border: none; padding: 14px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(253, 187, 45, 0.4); touch-action: manipulation; min-height: 44px;">
                            🗺️ View on Map
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('mural-modal-overlay');
        if (existingModal) existingModal.remove();

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Close modal on outside click
        setTimeout(() => {
            const overlay = document.getElementById('mural-modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeMuralModal();
                    }
                });
            }
        }, 100);
    }

    closeMuralModal() {
        const modal = document.getElementById('mural-modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    viewOnMap(lat, lng) {
        if (window.map) {
            window.map.setView([lat, lng], 14);
            this.closeMuralModal();
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    if (typeof muralData !== 'undefined') {
        new MuralChatbot();
    }
});
