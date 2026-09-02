// server.js - Express & Socket.io Live Leaderboard Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Serve static frontend files from parent root directory
app.use(express.static(path.join(__dirname, '../')));

// In-Memory Fallback Cache
let memoryLeaderboard = [
    { player_name: "Navneep D", score: 850, streak: 5, played_at: new Date().toISOString() },
    { player_name: "AssamRocker", score: 720, streak: 4, played_at: new Date().toISOString() },
    { player_name: "ZubeenFanatic", score: 610, streak: 3, played_at: new Date().toISOString() },
    { player_name: "BrahmaputraVoice", score: 490, streak: 2, played_at: new Date().toISOString() }
];

// Helper: Fetch top 10 scores from Neon DB (with memory fallback)
async function getTopLeaderboard() {
    try {
        const result = await db.query(
            `SELECT player_name, score, streak, played_at 
             FROM zubeen_leaderboard 
             ORDER BY score DESC, played_at ASC 
             LIMIT 10`
        );
        return result.rows;
    } catch (err) {
        console.warn('⚠️ Database query failed, using in-memory cache:', err.message);
        return memoryLeaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
    }
}

// Helper: Save new score
async function saveScore(playerName, email, score, streak) {
    const cleanName = (playerName || 'Anonymous').substring(0, 50);
    const cleanEmail = (email && typeof email === 'string') ? email.trim().substring(0, 255) : null;
    const scoreVal = parseInt(score, 10) || 0;
    const streakVal = parseInt(streak, 10) || 0;

    // Update in-memory fallback cache (strictly omit email from public leaderboard data)
    memoryLeaderboard.push({
        player_name: cleanName,
        score: scoreVal,
        streak: streakVal,
        played_at: new Date().toISOString()
    });

    try {
        await db.query(
            `INSERT INTO zubeen_leaderboard (player_name, email, score, streak, played_at) 
             VALUES ($1, $2, $3, $4, NOW())`,
            [cleanName, cleanEmail, scoreVal, streakVal]
        );
        console.log(`💾 Score saved to Neon DB: ${cleanName} (${cleanEmail ? 'email provided' : 'no email'}) - ${scoreVal} pts`);
    } catch (err) {
        console.warn('⚠️ Could not insert into Neon DB, cached in-memory:', err.message);
    }

    return await getTopLeaderboard();
}

// ============================================
// Socket.io Real-Time Event Handlers
// ============================================
io.on('connection', async (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    // Send current leaderboard to newly connected client immediately
    const topScores = await getTopLeaderboard();
    socket.emit('leaderboard_update', topScores);

    // Event: Receive new score submission
    socket.on('submit_score', async (data) => {
        console.log(`📩 Score submission received from ${socket.id}:`, data);
        const { player_name, email, score, streak } = data || {};
        
        const updatedLeaderboard = await saveScore(player_name, email, score, streak);
        
        // Broadcast updated top 10 to ALL connected clients (privacy preserved)
        io.emit('leaderboard_update', updatedLeaderboard);
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Client disconnected: ${socket.id}`);
    });
});

// ============================================
// REST API Endpoints (Fallback / HTTP clients)
// ============================================
app.get('/api/leaderboard', async (req, res) => {
    const leaderboard = await getTopLeaderboard();
    res.json({ success: true, data: leaderboard });
});

app.post('/api/score', async (req, res) => {
    const { player_name, email, score, streak } = req.body || {};
    const updatedLeaderboard = await saveScore(player_name, email, score, streak);
    
    // Broadcast via socket as well
    io.emit('leaderboard_update', updatedLeaderboard);
    
    res.json({ success: true, data: updatedLeaderboard });
});

// Default Fallback Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 ZG Tribute Hub Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready for live leaderboard connections.`);
});
