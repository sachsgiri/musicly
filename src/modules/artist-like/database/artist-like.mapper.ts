import type { UUID } from 'node:crypto';
import type { EntityDbModelMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { ArtistLikeEntity } from '../domain/artist-like.entity';
import { type ArtistLikeModel, artistLikeSchema } from './artist-like.repository';

export const ARTIST_LIKE_ENTITY_DB_MODEL_MAPPER = Symbol('ARTIST_LIKE_ENTITY_DB_MODEL_MAPPER');

@Injectable()
export class ArtistLikeEntityDbModelMapper implements EntityDbModelMapper<ArtistLikeEntity, ArtistLikeModel> {
  toPersistence(entity: ArtistLikeEntity): ArtistLikeModel {
    const copy = entity.getProps();
    const record: ArtistLikeModel = {
      id: copy.id,
      created_at: copy.createdAt,
      user_id: copy.userId,
      artist_id: copy.artistId,
    };
    return artistLikeSchema.parse(record);
  }

  toDomain(record: ArtistLikeModel): ArtistLikeEntity {
    const entity = new ArtistLikeEntity({
      id: record.id as UUID,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.created_at),
      props: {
        userId: record.user_id as UUID,
        artistId: record.artist_id as UUID,
      },
    });
    return entity;
  }
}
