import type { UUID } from 'node:crypto';
import type { RepositoryPort } from '@libs/ddd';
import type { Option } from 'oxide.ts';
import type { SongEntity } from '../domain/song.entity';

export const SONG_REPOSITORY = Symbol('SONG_REPOSITORY');

export interface SongRepositoryPort extends RepositoryPort<SongEntity> {
  findOneByImportId(importId: number): Promise<Option<SongEntity>>;
  insertWithJsonb(song: SongEntity): Promise<SongEntity>;
  findSongsByArtist(artistId: UUID): Promise<SongEntity[] | null>;
  increaseLikesCount(id: UUID): Promise<SongEntity>;
  decreaseLikesCount(id: UUID): Promise<SongEntity>;
  increasePlayCount(id: UUID): Promise<SongEntity>;
}
