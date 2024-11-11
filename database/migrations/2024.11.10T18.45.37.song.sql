CREATE TABLE IF NOT EXISTS song (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  import_id INT NOT NULL,
  artists JSONB NOT NULL,
  title VARCHAR(255) NOT NULL,
  total_likes INT NOT NULL,
  total_plays INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (import_id)
);

CREATE INDEX idx_song_artists ON song USING gin (artists);

CREATE TABLE IF NOT EXISTS song_like (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES song(id),
  UNIQUE (user_id, song_id)
);

CREATE TABLE IF NOT EXISTS playback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES song(id)
);

CREATE INDEX idx_song_like_song_id ON song_like (song_id);
CREATE INDEX idx_song_like_user_id ON song_like (user_id);
CREATE INDEX idx_playback_song_id ON playback (song_id);
CREATE INDEX idx_playback_user_id ON playback (user_id);