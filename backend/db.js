// db.js - Neon PostgreSQL Connection Pool
const { Pool } = require('pg');
require('dotenv').config();

// Neon PostgreSQL connection string from environment variable or provided pooler URL
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_uBSvYf0cMP4L@ep-jolly-math-b3375j4x-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Neon SSL connections
    }
});

pool.on('connect', () => {
    console.log('⚡ Connected to Neon PostgreSQL database pool.');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database pool error:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
