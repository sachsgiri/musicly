import type { EntityResponseMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';

import type { ArtistEntity } from '../domain/artist.entity';
import { ArtistResponseDto } from './artist.response.dto';

export const ARTIST_ENTITY_RESPONSE_MAPPER = Symbol('ARTIST_ENTITY_RESPONSE_MAPPER');
@Injectable()
export class ArtistEntityResponseMapper implements EntityResponseMapper<ArtistEntity, ArtistResponseDto> {
  toResponse(entity: ArtistEntity): ArtistResponseDto {
    const props = entity.getProps();
    const response = new ArtistResponseDto(entity);
    response.name = props.name;
    response.totalPlays = props.totalPlays;
    response.totalLikes = props.totalLikes;
    response.totalSongLikes = props.totalSongLikes;
    return response;
  }
}
