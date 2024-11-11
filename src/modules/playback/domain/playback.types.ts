import type { UUID } from 'node:crypto';

export interface PlaybackProps {
  songId: UUID;
  userId: UUID;
}

export interface CreatePlaybackProps extends PlaybackProps {}

export interface UnlikeSongProps extends PlaybackProps {}
