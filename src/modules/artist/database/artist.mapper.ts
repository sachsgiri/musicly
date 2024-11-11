import type { UUID } from 'node:crypto';

import type { EntityDbModelMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';

import { ArtistEntity } from '../domain/artist.entity';
import { type ArtistModel, artistSchema } from './artist.repository';

export const ARTIST_ENTITY_DB_MODEL_MAPPER = Symbol('ARTIST_ENTITY_DB_MODEL_MAPPER');

@Injectable()
export class ArtistEntityDbModelMapper implements EntityDbModelMapper<ArtistEntity, ArtistModel> {
  toPersistence(entity: ArtistEntity): ArtistModel {
    const copy = entity.getProps();
    const record: ArtistModel = {
      id: copy.id,
      created_at: copy.createdAt,
      updated_at: copy.updatedAt,
      name: copy.name,
      total_plays: copy.totalPlays,
      total_song_likes: copy.totalSongLikes,
      total_likes: copy.totalLikes,
    };
    return artistSchema.parse(record);
  }

  toDomain(record: ArtistModel): ArtistEntity {
    const entity = new ArtistEntity({
      id: record.id as UUID,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      props: {
        name: record.name,
        totalPlays: record.total_plays,
        totalSongLikes: record.total_song_likes,
        totalLikes: record.total_likes,
      },
    });
    return entity;
  }
}
