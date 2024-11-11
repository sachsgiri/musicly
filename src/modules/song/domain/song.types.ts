import type { UUID } from 'node:crypto';

export enum ArtistRole {
  MAIN = 'MAIN',
  FEATURED = 'FEATURED',
}

export interface Artist {
  id: UUID;
  role: ArtistRole;
}

export interface SongProps {
  importId: number;
  artists: Artist[];
  title: string;
  dateAdded: Date;
  totalLikes: number;
  totalPlays: number;
}

export interface CreateSongProps extends Omit<SongProps, 'totalLikes' | 'totalPlays'> {}
