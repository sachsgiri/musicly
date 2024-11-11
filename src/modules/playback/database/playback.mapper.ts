import type { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { EntityDbModelMapper } from '@src/libs/ddd';
import { PlaybackEntity } from '../domain/playback.entity';
import { type PlaybackModel, playbackSchema } from './playback.repository';

export const PLAYBACK_ENTITY_DB_MODEL_MAPPER = Symbol('PLAYBACK_ENTITY_DB_MODEL_MAPPER');

@Injectable()
export class PlaybackEntityDbModelMapper implements EntityDbModelMapper<PlaybackEntity, PlaybackModel> {
  toPersistence(entity: PlaybackEntity): PlaybackModel {
    const copy = entity.getProps();
    const record: PlaybackModel = {
      id: copy.id,
      created_at: copy.createdAt,
      song_id: copy.songId,
      user_id: copy.userId,
    };
    return playbackSchema.parse(record);
  }

  toDomain(record: PlaybackModel): PlaybackEntity {
    const entity = new PlaybackEntity({
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
