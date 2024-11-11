import type { UUID } from 'node:crypto';

export interface SongLikeProps {
  songId: UUID;
  userId: UUID;
}

export interface CreateSongLikeProps extends SongLikeProps {}

export interface UnlikeSongProps extends SongLikeProps {}
