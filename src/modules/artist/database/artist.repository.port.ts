import type { RepositoryPort } from '@libs/ddd';
import type { Option } from 'oxide.ts';

import type { UUID } from 'node:crypto';
import type { ArtistEntity } from '../domain/artist.entity';

export const ARTIST_REPOSITORY = Symbol('ARTIST_REPOSITORY');

export interface ArtistRepositoryPort extends RepositoryPort<ArtistEntity> {
  findOneByName(name: string): Promise<Option<ArtistEntity>>;
  increaseLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]>;
  decreaseLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]>;
  increaseSongLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]>;
  decreaseSongLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]>;
  increasePlaysCountForMany(ids: UUID[]): Promise<ArtistEntity[]>;
}
