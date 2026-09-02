-- SQL Schema for Zubeen Garg Song Challenge Leaderboard
-- Target Database: Neon PostgreSQL

CREATE TABLE IF NOT EXISTS zubeen_leaderboard (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast top-10 queries
CREATE INDEX IF NOT EXISTS idx_zubeen_leaderboard_score ON zubeen_leaderboard(score DESC);

-- Optional: Initial Seed Data
INSERT INTO zubeen_leaderboard (player_name, score, streak) VALUES
    ('Navneep D', 850, 5),
    ('AssamRocker', 720, 4),
    ('ZubeenFanatic', 610, 3),
    ('BrahmaputraVoice', 490, 2),
    ('JorhatMelody', 420, 2);
