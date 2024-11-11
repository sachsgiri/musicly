import type { UUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { InjectPool } from 'nestjs-slonik';
import { None, type Option, Some } from 'oxide.ts';
import { type DatabasePool, NotFoundError, sql } from 'slonik';
import { z } from 'zod';
import type { SongEntity } from '../domain/song.entity';
import { ArtistRole } from '../domain/song.types';
import { SongEntityDbModelMapper } from './song.mapper';
import type { SongRepositoryPort } from './song.repository.port';

export const songSchema = z.object({
  id: z.string().uuid(),
  import_id: z.number(),
  artists: z.array(
    z.object({
      id: z.string().uuid(),
      role: z.nativeEnum(ArtistRole),
    }),
  ),
  title: z.string(),
  total_likes: z.number(),
  total_plays: z.number(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()),
  date_added: z.preprocess((val: any) => new Date(val), z.date()),
});

export type SongModel = z.TypeOf<typeof songSchema>;

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class SongRepository extends SqlRepositoryBase<SongEntity, SongModel> implements SongRepositoryPort {
  protected tableName = 'song';

  protected schema = songSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    @Inject(EventEmitter2)
    eventEmitter: EventEmitter2,
  ) {
    super(pool, new SongEntityDbModelMapper(), eventEmitter, new Logger(SongRepository.name));
  }

  async findOneByImportId(importId: number): Promise<Option<SongEntity>> {
    try {
      const song = await this.pool.one(sql`
        SELECT * FROM ${sql.identifier([this.tableName])}
        WHERE import_id = ${importId}
      `);
      return Some(this.mapper.toDomain(song));
    } catch (error) {
      if (error instanceof NotFoundError) {
        return None;
      }
      throw error;
    }
  }

  async insertWithJsonb(song: SongEntity): Promise<SongEntity> {
    const props = song.getProps();
    const record = await this.pool.one(sql`
      INSERT INTO ${sql.identifier([this.tableName])} (id, import_id, artists, title, total_likes, total_plays, date_added, created_at, updated_at)
      VALUES (
        ${song.id},
        ${props.importId},
        ${sql.jsonb(props.artists as Record<string, any>)},
        ${props.title},
        ${props.totalLikes},
        ${props.totalPlays},
        ${sql.timestamp(props.createdAt)},
        ${sql.timestamp(props.updatedAt)},
        ${sql.timestamp(props.dateAdded)}
      )
      RETURNING *
    `);

    return this.mapper.toDomain(record);
  }

  async increaseLikesCount(id: UUID): Promise<SongEntity> {
    const record = await this.pool.one(sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_likes = total_likes + 1
      WHERE id = ${id}
      RETURNING *
    `);

    return this.mapper.toDomain(record);
  }

  async increasePlayCount(id: UUID): Promise<SongEntity> {
    const record = await this.pool.one(sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_plays = total_plays + 1
      WHERE id = ${id}
      RETURNING *
    `);

    return this.mapper.toDomain(record);
  }

  async decreaseLikesCount(id: UUID): Promise<SongEntity> {
    const record = await this.pool.one(sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_likes = total_likes - 1
      WHERE id = ${id}
      RETURNING *
    `);

    return this.mapper.toDomain(record);
  }

  async findSongsByArtist(artistId: UUID): Promise<SongEntity[] | null> {
    const records = await this.pool.any(sql`
      SELECT * FROM ${sql.identifier([this.tableName])}
      WHERE artistIds @> ${sql.array([artistId], 'uuid')}
    `);

    return records.map((record) => this.mapper.toDomain(record));
  }
}
