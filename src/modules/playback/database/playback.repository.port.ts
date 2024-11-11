import type { UUID } from 'node:crypto';
import type { PaginatedQueryParams, RepositoryPort } from '@libs/ddd';
import type { PlaybackEntity } from '../domain/playback.entity';

export const PLAYBACK_REPOSITORY = Symbol('PLAYBACK_REPOSITORY');

export interface FindPlaybacksParams extends PaginatedQueryParams {
  songId: UUID;
  userId: UUID;
}

export interface PlaybackRepositoryPort extends RepositoryPort<PlaybackEntity> {
  findOneBySongIdUserId(songId: UUID, userId: UUID): Promise<PlaybackEntity | null>;
}
