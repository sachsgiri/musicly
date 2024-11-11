import type { UUID } from 'node:crypto';

export interface ArtistLikeProps {
  userId: UUID;
  artistId: UUID;
}

export interface CreateArtistLikeProps extends ArtistLikeProps {}

export interface UnlikeArtistProps extends ArtistLikeProps {}
