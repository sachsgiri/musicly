import type { EntityResponseMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import type { SongLikeEntity } from '../domain/song-like.entity';
import { SongLikeResponseDto } from '../dtos/song-like.response.dto';

export const SONG_LIKE_ENTITY_RESPONSE_MAPPER = Symbol('SONG_LIKE_ENTITY_RESPONSE_MAPPER');

@Injectable()
export class SongLikeEntityResponseMapper implements EntityResponseMapper<SongLikeEntity, SongLikeResponseDto> {
  toResponse(entity: SongLikeEntity): SongLikeResponseDto {
    const props = entity.getProps();
    const response = new SongLikeResponseDto(entity);
    response.songId = props.songId;
    response.userId = props.userId;
    return response;
  }
}
