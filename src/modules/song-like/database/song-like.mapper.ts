import type { UUID } from 'node:crypto';
import type { EntityDbModelMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { SongLikeEntity } from '../domain/song-like.entity';
import { type SongLikeModel, songLikeSchema } from './song-like.repository.schema';

export const SONG_LIKE_ENTITY_DB_MODEL_MAPPER = Symbol('SONG_LIKE_ENTITY_DB_MODEL_MAPPER');

@Injectable()
export class SongLikeEntityDbModelMapper implements EntityDbModelMapper<SongLikeEntity, SongLikeModel> {
  toPersistence(entity: SongLikeEntity): SongLikeModel {
    const copy = entity.getProps();
    const record: SongLikeModel = {
      id: copy.id,
      created_at: copy.createdAt,
      song_id: copy.songId,
      user_id: copy.userId,
    };
    return songLikeSchema.parse(record);
  }

  toDomain(record: SongLikeModel): SongLikeEntity {
    const entity = new SongLikeEntity({
      id: record.id as UUID,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.created_at),
      props: {
        songId: record.song_id as UUID,
        userId: record.user_id as UUID,
      },
    });
    return entity;
  }
}
