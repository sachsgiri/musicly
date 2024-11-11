import type { UUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { InjectPool } from 'nestjs-slonik';
import { type DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import type { PlaybackEntity } from '../domain/playback.entity';
import { PLAYBACK_ENTITY_DB_MODEL_MAPPER, type PlaybackEntityDbModelMapper } from './playback.mapper';
import type { PlaybackRepositoryPort } from './playback.repository.port';

export const playbackSchema = z.object({
  id: z.string().uuid(),
  song_id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()),
});

export type PlaybackModel = z.TypeOf<typeof playbackSchema>;

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class PlaybackRepository extends SqlRepositoryBase<PlaybackEntity, PlaybackModel> implements PlaybackRepositoryPort {
  protected tableName = 'playback';

  protected schema = playbackSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    @Inject(PLAYBACK_ENTITY_DB_MODEL_MAPPER)
    mapper: PlaybackEntityDbModelMapper,
    @Inject(EventEmitter2)
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(PlaybackRepository.name));
  }

  async findOneBySongIdUserId(songId: UUID, userId: UUID): Promise<PlaybackEntity> {
    const user = await this.pool.one(
      sql.type(playbackSchema)`SELECT * FROM "${this.tableName}" WHERE song_id = ${songId} AND user_id = ${userId}`,
    );

    return this.mapper.toDomain(user);
  }
}
