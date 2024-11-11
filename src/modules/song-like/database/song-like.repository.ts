import type { UUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import type { EntityDbModelMapper } from '@src/libs/ddd';
import { InjectPool } from 'nestjs-slonik';
import { type DatabasePool, sql } from 'slonik';
import type { SongLikeEntity } from '../domain/song-like.entity';
import { SONG_LIKE_ENTITY_DB_MODEL_MAPPER, type SongLikeEntityDbModelMapper } from './song-like.mapper';
import type { SongLikeRepositoryPort } from './song-like.repository.port';
import { type SongLikeModel, songLikeSchema } from './song-like.repository.schema';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class SongLikeRepository extends SqlRepositoryBase<SongLikeEntity, SongLikeModel> implements SongLikeRepositoryPort {
  protected tableName = 'song_like';

  protected schema = songLikeSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    @Inject(SONG_LIKE_ENTITY_DB_MODEL_MAPPER)
    mapper: EntityDbModelMapper<SongLikeEntity, SongLikeModel>,
    @Inject(EventEmitter2)
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(SongLikeRepository.name));
  }

  async findOneBySongIdUserId(songId: UUID, userId: UUID): Promise<SongLikeEntity> {
    const user = await this.pool.one(
      sql.type(songLikeSchema)`SELECT * FROM "${this.tableName}" WHERE songId = ${songId} AND userId = ${userId}`,
    );

    return this.mapper.toDomain(user);
  }
}
