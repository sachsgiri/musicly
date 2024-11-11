import type { UUID } from 'node:crypto';
import type { PaginatedQueryParams, RepositoryPort } from '@libs/ddd';
import type { Option } from 'oxide.ts';
import type { ArtistLikeEntity } from '../domain/artist-like.entity';
export interface FindArtistLikesParams extends PaginatedQueryParams {
  songId: UUID;
  userId: UUID;
}

export const ARTIST_LIKE_REPOSITORY = Symbol('ARTIST_LIKE_REPOSITORY');

export interface ArtistLikeRepositoryPort extends RepositoryPort<ArtistLikeEntity> {
  findOneByArtistIdUserId(songId: UUID, userId: UUID): Promise<Option<ArtistLikeEntity>>;
}
