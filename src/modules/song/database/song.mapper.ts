import type { UUID } from 'node:crypto';
import type { EntityDbModelMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { SongEntity } from '../domain/song.entity';
import { type SongModel, songSchema } from './song.repository';

export const SONG_ENTITY_DB_MODEL_MAPPER = Symbol('SONG_ENTITY_DB_MODEL_MAPPER');

@Injectable()
export class SongEntityDbModelMapper implements EntityDbModelMapper<SongEntity, SongModel> {
  toPersistence(entity: SongEntity): SongModel {
    const copy = entity.getProps();
    const record: SongModel = {
      id: copy.id,
      created_at: copy.createdAt,
      updated_at: copy.updatedAt,
      import_id: copy.importId,
      artists: copy.artists,
      title: copy.title,
      total_likes: copy.totalLikes,
      total_plays: copy.totalPlays,
      date_added: copy.dateAdded,
    };
    return songSchema.parse(record);
  }

  toDomain(record: SongModel): SongEntity {
    const entity = new SongEntity({
      id: record.id as UUID,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.created_at),
      props: {
        importId: record.import_id,
        artists: record.artists.map(({ id, role }) => ({
          id: id as UUID,
          role,
        })),
        title: record.title,
        totalLikes: record.total_likes,
        totalPlays: record.total_plays,
        dateAdded: record.date_added,
      },
    });
    return entity;
  }
}
