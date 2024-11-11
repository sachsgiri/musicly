-- Enable the uuid-ossp extension if it is not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the artist table if it does not exist
CREATE TABLE IF NOT EXISTS artist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255) NOT NULL,
  total_plays INT NOT NULL DEFAULT 0,
  total_song_likes INT NOT NULL DEFAULT 0,
  total_likes INT NOT NULL DEFAULT 0,
  UNIQUE (name)
);

CREATE INDEX idx_artist_popularity ON artist (total_song_likes, total_likes);

-- Create the artist_like table if it does not exist
CREATE TABLE IF NOT EXISTS artist_like (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  artist_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artist(id),
  UNIQUE (user_id, artist_id)
);