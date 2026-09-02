-- SQL Schema for Zubeen Garg Song Challenge Leaderboard
-- Target Database: Neon PostgreSQL

CREATE TABLE IF NOT EXISTS zubeen_leaderboard (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    score INT NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration command for existing tables:
ALTER TABLE zubeen_leaderboard ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Index for fast top-10 queries
CREATE INDEX IF NOT EXISTS idx_zubeen_leaderboard_score ON zubeen_leaderboard(score DESC);

-- Optional: Initial Seed Data
INSERT INTO zubeen_leaderboard (player_name, email, score, streak) VALUES
    ('Navneep D', 'navneep@example.com', 850, 5),
    ('AssamRocker', NULL, 720, 4),
    ('ZubeenFanatic', NULL, 610, 3),
    ('BrahmaputraVoice', NULL, 490, 2),
    ('JorhatMelody', NULL, 420, 2);
