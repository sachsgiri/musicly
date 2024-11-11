import type { UUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import type { EntityDbModelMapper } from '@src/libs/ddd';
import { InjectPool } from 'nestjs-slonik';
import { None, type Option, Some } from 'oxide.ts';
import { DataIntegrityError, type DatabasePool, NotFoundError, sql } from 'slonik';
import { z } from 'zod';
import type { ArtistEntity } from '../domain/artist.entity';
import { ARTIST_ENTITY_DB_MODEL_MAPPER, ArtistEntityDbModelMapper } from './artist.mapper';
import type { ArtistRepositoryPort } from './artist.repository.port';

export const artistSchema = z.object({
  id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()),
  updated_at: z.preprocess((val: any) => new Date(val), z.date()),
  name: z.string(),
  total_plays: z.number(),
  total_song_likes: z.number(),
  total_likes: z.number(),
});

export type ArtistModel = z.TypeOf<typeof artistSchema>;

@Injectable()
export class ArtistRepository extends SqlRepositoryBase<ArtistEntity, ArtistModel> implements ArtistRepositoryPort {
  protected tableName = 'artist';

  protected schema = artistSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    @Inject(EventEmitter2)
    eventEmitter: EventEmitter2,
  ) {
    super(pool, new ArtistEntityDbModelMapper(), eventEmitter, new Logger(ArtistRepository.name));
  }

  async findOneByName(name: string): Promise<Option<ArtistEntity>> {
    try {
      const artist = await this.pool.one(sql.type(artistSchema)`SELECT * FROM ${sql.identifier([this.tableName])} WHERE name = ${name}`);
      return Some(this.mapper.toDomain(artist));
    } catch (error) {
      if (error instanceof NotFoundError) {
        return None;
      }
      throw error;
    }
  }

  async increasePlaysCountForMany(ids: UUID[]): Promise<ArtistEntity[]> {
    const query = sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_plays = total_plays + 1
      WHERE id = ANY(${sql.array(ids, 'uuid')})
      RETURNING *
    `;

    const result = await this.pool.query(query);

    return result.rows.map(this.mapper.toDomain);
  }

  async increaseLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]> {
    const query = sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_likes = total_likes + 1
      WHERE id = ANY(${sql.array(ids, 'uuid')})
      RETURNING *
    `;

    const result = await this.pool.query(query);

    return result.rows.map(this.mapper.toDomain);
  }

  async decreaseLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]> {
    const query = sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_likes = total_likes - 1
      WHERE id = ANY(${sql.array(ids, 'uuid')})
      RETURNING *
    `;

    const result = await this.pool.query(query);

    return result.rows.map(this.mapper.toDomain);
  }

  async increaseSongLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]> {
    const query = sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_song_likes = total_song_likes + 1
      WHERE id = ANY(${sql.array(ids, 'uuid')})
      RETURNING *
    `;

    const result = await this.pool.query(query);

    return result.rows.map(this.mapper.toDomain);
  }

  async decreaseSongLikesCountForMany(ids: UUID[]): Promise<ArtistEntity[]> {
    const query = sql`
      UPDATE ${sql.identifier([this.tableName])}
      SET total_song_likes = total_song_likes - 1
      WHERE id = ANY(${sql.array(ids, 'uuid')})
      RETURNING *
    `;

    const result = await this.pool.query(query);

    return result.rows.map(this.mapper.toDomain);
  }
}
