// game.js - Zubeen's Chords Song Guessing Challenge

// ============================================
// 1. Levenshtein Distance & Fuzzy Matching Logic
// ============================================
function calculateLevenshteinDistance(str1, str2) {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
}

// Function to check if a guess matches the song title or alternate titles
function isCorrectGuess(guess, song) {
    const targets = [song.title, ...(song.alternateTitles || [])];
    
    for (const target of targets) {
        const similarity = calculateLevenshteinDistance(guess, target);
        // Accept exact match, inclusion, or > 65% similarity for typos
        if (similarity >= 0.65) {
            return true;
        }
    }
    return false;
}

// ============================================
// 2. Song Database with Web Audio Synth Fallback
// ============================================
const songsDatabase = [
    {
        id: 1,
        title: "Mayabini",
        alternateTitles: ["Mayabini Ratir Bukut", "Mayabini Rati", "Maybini"],
        audioSrc: "https://actions.google.com/sounds/v1/ambiences/outdoor_theme_park.ogg", // Demo audio fallback
        hint: "Iconic romantic song with lyrics 'মায়াবিনী ৰাতিৰ বুকুত...'",
        notes: [440, 493, 523, 587, 659, 587, 523, 493] // Melodic frequencies for Web Audio synth fallback
    },
    {
        id: 2,
        title: "Mon Jaai",
        alternateTitles: ["Mon Jai", "Moi Jai", "Monjai"],
        audioSrc: "https://actions.google.com/sounds/v1/crowds/cheering_happy.ogg",
        hint: "Theme anthem celebrating free spirit and bohemian wanderlust.",
        notes: [523, 587, 659, 698, 783, 659, 587, 523]
    },
    {
        id: 3,
        title: "Ya Ali",
        alternateTitles: ["Ya Ali Re", "Ya Aali", "Gangster"],
        audioSrc: "https://actions.google.com/sounds/v1/weather/rain_heavy.ogg",
        hint: "Bollywood chartbuster from the film Gangster.",
        notes: [659, 698, 783, 880, 783, 698, 659, 587]
    },
    {
        id: 4,
        title: "Pakhi Pakhi Ei Mon",
        alternateTitles: ["Pakhi Pakhi", "Ei Mon", "Pakhi"],
        audioSrc: "https://actions.google.com/sounds/v1/water/rain_light.ogg",
        hint: "Melodious Assamese song comparing a soaring heart to a bird.",
        notes: [392, 440, 493, 523, 587, 493, 440, 392]
    },
    {
        id: 5,
        title: "Dil Tu Hi Bataa",
        alternateTitles: ["Dil Tu Hi Bata", "Krrish 3", "Dil Tu Hi"],
        audioSrc: "https://actions.google.com/sounds/v1/ambiences/forest_day.ogg",
        hint: "Hit track composed by Rajesh Roshan starring Zubeen.",
        notes: [587, 659, 783, 880, 987, 880, 783, 659]
    }
];

// ============================================
// 3. Game Engine State
// ============================================
class ZubeenChordsGame {
    constructor() {
        this.currentRound = 0;
        this.totalRounds = 5;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.timeLeft = 10.0;
        this.timerInterval = null;
        this.isPlaying = false;
        this.currentSong = null;
        this.audioElement = document.getElementById('game-audio');
        this.audioContext = null;
        this.synthOscillators = [];
        this.socket = null;
        
        // Local Leaderboard Fallback
        this.localLeaderboard = [
            { player_name: "Navneep D", score: 850, streak: 5, played_at: "2026-09-02" },
            { player_name: "AssamRocker", score: 720, streak: 4, played_at: "2026-09-01" },
            { player_name: "ZubeenFanatic", score: 610, streak: 3, played_at: "2026-08-30" },
            { player_name: "BrahmaputraVoice", score: 490, streak: 2, played_at: "2026-08-28" }
        ];

        this.initDOM();
        this.initSocket();
        this.startNextRound();
    }

    initDOM() {
        // Play button
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlaySnippet());
        
        // Guess submission
        document.getElementById('guess-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGuessSubmit();
        });

        // Hint button
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());

        // Skip button
        document.getElementById('skip-btn').addEventListener('click', () => this.skipSong());

        // Score submission modal trigger
        document.getElementById('submit-score-btn').addEventListener('click', () => this.openScoreModal());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeScoreModal());
        document.getElementById('modal-score-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleModalScoreSubmit();
        });
    }

    // ============================================
    // 4. Socket.io Leaderboard Connection
    // ============================================
    initSocket() {
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');

        try {
            // Try connecting to backend running on port 3000 or relative path
            const backendUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3000' 
                : window.location.origin;

            this.socket = io(backendUrl, {
                timeout: 3000,
                reconnectionAttempts: 3
            });

            this.socket.on('connect', () => {
                console.log("🟢 Connected to Live Leaderboard Backend!");
                statusDot.className = 'status-dot online';
                statusText.textContent = 'Live Connected';
            });

            this.socket.on('connect_error', () => {
                console.log("🟠 Backend offline. Using local mode.");
                statusDot.className = 'status-dot offline';
                statusText.textContent = 'Local Mode';
                this.renderLeaderboard(this.localLeaderboard);
            });

            this.socket.on('leaderboard_update', (data) => {
                console.log("🏆 Leaderboard update received:", data);
                if (Array.isArray(data) && data.length > 0) {
                    this.renderLeaderboard(data);
                }
            });
        } catch (e) {
            console.log("Local fallback mode active.");
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Local Mode';
            this.renderLeaderboard(this.localLeaderboard);
        }

        // Render initial local leaderboard immediately
        this.renderLeaderboard(this.localLeaderboard);
    }

    renderLeaderboard(list) {
        const listContainer = document.getElementById('leaderboard-list');
        listContainer.innerHTML = '';

        if (!list || list.length === 0) {
            listContainer.innerHTML = '<li class="empty-lb">No high scores yet! Be the first!</li>';
            return;
        }

        list.slice(0, 10).forEach((entry, idx) => {
            const li = document.createElement('li');
            li.className = `lb-item rank-${idx + 1}`;
            
            const badge = idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

            li.innerHTML = `
                <div class="lb-rank">${badge}</div>
                <div class="lb-info">
                    <span class="lb-name">${this.escapeHtml(entry.player_name || 'Anonymous')}</span>
                    <span class="lb-streak">🔥 ${entry.streak || 0} streak</span>
                </div>
                <div class="lb-score">${entry.score || 0} pts</div>
            `;
            listContainer.appendChild(li);
        });
    }

    // ============================================
    // 5. Game Round & Audio Logic
    // ============================================
    startNextRound() {
        this.stopAudioAndTimer();
        this.currentRound++;

        if (this.currentRound > this.totalRounds) {
            this.finishGame();
            return;
        }

        // Pick next random song
        const songIndex = (this.currentRound - 1) % songsDatabase.length;
        this.currentSong = songsDatabase[songIndex];

        // Reset HUD and form
        this.timeLeft = 10.0;
        this.updateHUD();

        document.getElementById('guess-input').value = '';
        document.getElementById('guess-input').disabled = false;
        document.getElementById('guess-input').focus();
        
        document.getElementById('guess-feedback').className = 'feedback-box';
        document.getElementById('guess-feedback').textContent = '';
        
        document.getElementById('hint-box').className = 'hint-box hidden';
        document.getElementById('hint-box').textContent = '';

        document.getElementById('play-icon').textContent = '▶';
        document.getElementById('play-text').textContent = 'Play Snippet (10s)';
        document.getElementById('audio-bars').classList.remove('playing');
        document.getElementById('timer-progress').style.width = '100%';

        // Setup audio element
        if (this.currentSong.audioSrc) {
            this.audioElement.src = this.currentSong.audioSrc;
        }
    }

    togglePlaySnippet() {
        if (this.isPlaying) {
            this.pauseSnippet();
        } else {
            this.playSnippet();
        }
    }

    playSnippet() {
        this.isPlaying = true;
        document.getElementById('play-icon').textContent = '⏸';
        document.getElementById('play-text').textContent = 'Pause Snippet';
        document.getElementById('audio-bars').classList.add('playing');

        // Play HTML5 Audio or Web Audio Synthesizer as fallback
        if (this.audioElement && this.audioElement.src) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(() => {
                // Fallback to web synth if media fails
                this.playSynthSnippet();
            });
        } else {
            this.playSynthSnippet();
        }

        // Start Countdown Timer
        const startTime = Date.now();
        const durationMs = this.timeLeft * 1000;

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remainingMs = Math.max(0, durationMs - elapsed);
            this.timeLeft = (remainingMs / 1000);

            document.getElementById('timer-display').textContent = `${this.timeLeft.toFixed(1)}s`;
            const percent = (remainingMs / 10000) * 100;
            document.getElementById('timer-progress').style.width = `${percent}%`;

            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 100);
    }

    playSynthSnippet() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            
            if (!this.audioContext) {
                this.audioContext = new AudioCtx();
            }

            const notes = this.currentSong.notes || [440, 523, 659, 783];
            notes.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + (index * 0.4));
                
                gain.gain.setValueAtTime(0.15, this.audioContext.currentTime + (index * 0.4));
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + (index * 0.4) + 0.35);

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.start(this.audioContext.currentTime + (index * 0.4));
                osc.stop(this.audioContext.currentTime + (index * 0.4) + 0.4);
                
                this.synthOscillators.push(osc);
            });
        } catch (e) {
            console.log("Audio Synth played demo snippet.");
        }
    }

    pauseSnippet() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        
        if (this.audioElement) {
            this.audioElement.pause();
        }

        document.getElementById('play-icon').textContent = '▶';
        document.getElementById('play-text').textContent = 'Resume Snippet';
        document.getElementById('audio-bars').classList.remove('playing');
    }

    stopAudioAndTimer() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        
        if (this.audioElement) {
            this.audioElement.pause();
        }

        document.getElementById('audio-bars').classList.remove('playing');
    }

    handleGuessSubmit() {
        const inputEl = document.getElementById('guess-input');
        const userGuess = inputEl.value.trim();

        if (!userGuess) return;

        if (isCorrectGuess(userGuess, this.currentSong)) {
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess(userGuess);
        }
    }

    handleCorrectGuess() {
        this.stopAudioAndTimer();
        
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;

        // Calculate score based on time remaining: Base 100 + (time left * 20) * streak multiplier
        const timeBonus = Math.floor(this.timeLeft * 20);
        const streakMultiplier = 1 + (this.streak * 0.2);
        const roundPoints = Math.floor((100 + timeBonus) * streakMultiplier);

        this.score += roundPoints;
        this.updateHUD();

        const feedbackEl = document.getElementById('guess-feedback');
        feedbackEl.className = 'feedback-box success';
        feedbackEl.innerHTML = `🎉 <strong>Correct!</strong> It's <em>"${this.currentSong.title}"</em>! (+${roundPoints} pts)`;

        document.getElementById('guess-input').disabled = true;

        setTimeout(() => {
            this.startNextRound();
        }, 2000);
    }

    handleIncorrectGuess(guess) {
        const feedbackEl = document.getElementById('guess-feedback');
        feedbackEl.className = 'feedback-box error';
        feedbackEl.innerHTML = `❌ <strong>Not quite!</strong> Keep trying or check a hint!`;
        
        // Shake feedback
        feedbackEl.style.animation = 'none';
        setTimeout(() => feedbackEl.style.animation = 'shake 0.3s ease', 10);
    }

    handleTimeUp() {
        this.stopAudioAndTimer();
        this.streak = 0;
        this.updateHUD();

        const feedbackEl = document.getElementById('guess-feedback');
        feedbackEl.className = 'feedback-box warning';
        feedbackEl.innerHTML = `⏰ <strong>Time's Up!</strong> The song was <em>"${this.currentSong.title}"</em>.`;

        document.getElementById('guess-input').disabled = true;

        setTimeout(() => {
            this.startNextRound();
        }, 2200);
    }

    showHint() {
        if (!this.currentSong) return;
        const hintBox = document.getElementById('hint-box');
        hintBox.className = 'hint-box visible';
        hintBox.textContent = `💡 Hint: ${this.currentSong.hint}`;
        
        // Small point deduction for using hint
        if (this.score >= 20) {
            this.score -= 20;
            this.updateHUD();
        }
    }

    skipSong() {
        this.stopAudioAndTimer();
        this.streak = 0;
        this.updateHUD();

        const feedbackEl = document.getElementById('guess-feedback');
        feedbackEl.className = 'feedback-box warning';
        feedbackEl.innerHTML = `⏭️ Skipped! The song was <em>"${this.currentSong.title}"</em>.`;

        setTimeout(() => {
            this.startNextRound();
        }, 1500);
    }

    updateHUD() {
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('streak-display').textContent = `🔥 ${this.streak}`;
        document.getElementById('round-display').textContent = `${Math.min(this.currentRound, this.totalRounds)} / ${this.totalRounds}`;
        document.getElementById('timer-display').textContent = `${this.timeLeft.toFixed(1)}s`;
    }

    finishGame() {
        this.stopAudioAndTimer();
        
        document.getElementById('submit-score-btn').disabled = false;
        document.getElementById('submit-score-btn').classList.add('pulse-gold');

        const feedbackEl = document.getElementById('guess-feedback');
        feedbackEl.className = 'feedback-box success';
        feedbackEl.innerHTML = `🏁 <strong>Game Complete!</strong> Final Score: <strong>${this.score} pts</strong>!`;

        this.openScoreModal();
    }

    openScoreModal() {
        document.getElementById('modal-final-score').textContent = this.score;
        document.getElementById('modal-final-streak').textContent = this.maxStreak;
        document.getElementById('score-modal').classList.remove('hidden');
    }

    closeScoreModal() {
        document.getElementById('score-modal').classList.add('hidden');
    }

    handleModalScoreSubmit() {
        const nameInput = document.getElementById('player-name-input');
        const playerName = nameInput.value.trim() || 'Anonymous Fan';

        const payload = {
            player_name: playerName,
            score: this.score,
            streak: this.maxStreak,
            played_at: new Date().toISOString()
        };

        if (this.socket && this.socket.connected) {
            this.socket.emit('submit_score', payload);
        } else {
            // Local fallback addition
            this.localLeaderboard.push(payload);
            this.localLeaderboard.sort((a, b) => b.score - a.score);
            this.renderLeaderboard(this.localLeaderboard);
        }

        this.closeScoreModal();
        alert(`🎉 Thank you ${playerName}! Your score of ${this.score} pts has been logged.`);
        
        // Reset game for a fresh round
        this.currentRound = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.startNextRound();
    }

    escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

// Instantiate game on page load
document.addEventListener('DOMContentLoaded', () => {
    window.zubeenGame = new ZubeenChordsGame();
});
