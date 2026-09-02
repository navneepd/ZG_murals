# ZG Tribute Hub Backend Server

Real-time Live Leaderboard backend powered by Node.js, Express, Socket.io, and Neon PostgreSQL.

## Features
- **Socket.io Real-Time Synchronization**: Instantly broadcasts score updates to all active players.
- **Neon PostgreSQL Integration**: Persistent relational storage for top high scores.
- **In-Memory Fallback**: Continues serving offline clients gracefully even when the database is unreachable.
- **REST Endpoints**: Fallback endpoints for standard HTTP requests.

## Setup Instructions

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables (create `.env`):
   ```env
   PORT=3000
   DATABASE_URL=postgresql://neondb_owner:npg_uBSvYf0cMP4L@ep-jolly-math-b3375j4x-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

3. Run SQL Schema on Neon Console:
   Execute `backend/schema.sql` in your Neon SQL Editor to create the `zubeen_leaderboard` table.

4. Start the server:
   ```bash
   npm start
   # Or for development mode:
   npm run dev
   ```
