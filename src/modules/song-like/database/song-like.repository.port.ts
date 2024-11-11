import type { UUID } from 'node:crypto';
import type { PaginatedQueryParams, RepositoryPort } from '@libs/ddd';
import type { SongLikeEntity } from '../domain/song-like.entity';

export const SONG_LIKE_REPOSITORY = Symbol('SONG_LIKE_REPOSITORY');

export interface FindSongLikesParams extends PaginatedQueryParams {
  songId: UUID;
  userId: UUID;
}

export interface SongLikeRepositoryPort extends RepositoryPort<SongLikeEntity> {
  findOneBySongIdUserId(songId: UUID, userId: UUID): Promise<SongLikeEntity | null>;
}
