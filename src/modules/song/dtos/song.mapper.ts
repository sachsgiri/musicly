import type { EntityResponseMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import type { SongEntity } from '../domain/song.entity';
import { SongResponseDto } from './song.response.dto';

export const SONG_ENTITY_RESPONSE_MAPPER = Symbol('SONG_ENTITY_RESPONSE_MAPPER');

@Injectable()
export class SongEntityResponseMapper implements EntityResponseMapper<SongEntity, SongResponseDto> {
  toResponse(entity: SongEntity): SongResponseDto {
    const props = entity.getProps();
    const response = new SongResponseDto(entity);
    response.importId = props.importId;
    response.artists = props.artists;
    response.title = props.title;
    response.totalLikes = props.totalLikes;
    response.totalPlays = props.totalPlays;
    response.dateAdded = new Date(props.dateAdded).toISOString();
    return response;
  }
}
