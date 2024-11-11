import type { EntityResponseMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';

import type { ArtistLikeEntity } from '../domain/artist-like.entity';
import { ArtistLikeResponseDto } from './artist-like.response.dto';

export const ARTIST_LIKE_ENTITY_RESPONSE_MAPPER = Symbol('ARTIST_LIKE_ENTITY_RESPONSE_MAPPER');

@Injectable()
export class ArtistLikeEntityResponseMapper implements EntityResponseMapper<ArtistLikeEntity, ArtistLikeResponseDto> {
  toResponse(entity: ArtistLikeEntity): ArtistLikeResponseDto {
    const props = entity.getProps();
    const response = new ArtistLikeResponseDto(entity);
    return response;
  }
}
