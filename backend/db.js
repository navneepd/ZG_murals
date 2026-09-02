// db.js - Neon PostgreSQL Connection Pool
const { Pool } = require('pg');
require('dotenv').config();

// Neon PostgreSQL connection string placeholder or environment variable
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_placeholder@ep-cool-sample-a5x8.us-east-2.aws.neon.tech/neondb?sslmode=require';

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
