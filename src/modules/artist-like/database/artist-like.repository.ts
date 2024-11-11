import type { UUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { InjectPool } from 'nestjs-slonik';
import { None, type Option, Some } from 'oxide.ts';
import { type DatabasePool, NotFoundError, sql } from 'slonik';
import { z } from 'zod';
import type { ArtistLikeEntity } from '../domain/artist-like.entity';
import { ArtistLikeEntityDbModelMapper } from './artist-like.mapper';
import type { ArtistLikeRepositoryPort } from './artist-like.repository.port';

export const artistLikeSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  artist_id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()),
});

export type ArtistLikeModel = z.TypeOf<typeof artistLikeSchema>;

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class ArtistLikeRepository extends SqlRepositoryBase<ArtistLikeEntity, ArtistLikeModel> implements ArtistLikeRepositoryPort {
  protected tableName = 'artist_like';

  protected schema = artistLikeSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    @Inject(EventEmitter2)
    eventEmitter: EventEmitter2,
  ) {
    super(pool, new ArtistLikeEntityDbModelMapper(), eventEmitter, new Logger(ArtistLikeRepository.name));
  }

  async findOneByArtistIdUserId(artistId: UUID, userId: UUID): Promise<Option<ArtistLikeEntity>> {
    try {
      const user = await this.pool.one(
        sql.type(artistLikeSchema)`SELECT * FROM "artist_like" WHERE artist_id = ${artistId} AND user_id = ${userId}`,
      );

      return Some(this.mapper.toDomain(user));
    } catch (error) {
      if (error instanceof NotFoundError) {
        return None;
      }
      throw error;
    }
  }
}
