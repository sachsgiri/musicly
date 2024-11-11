import type { EntityResponseMapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import type { PlaybackEntity } from '../domain/playback.entity';
import { PlaybackResponseDto } from './playback.response.dto';

export const PLAYBACK_ENTITY_RESPONSE_MAPPER = Symbol('PLAYBACK_ENTITY_RESPONSE_MAPPER');

@Injectable()
export class PlaybackEntityResponseMapper implements EntityResponseMapper<PlaybackEntity, PlaybackResponseDto> {
  toResponse(entity: PlaybackEntity): PlaybackResponseDto {
    const props = entity.getProps();
    const response = new PlaybackResponseDto(entity);

    return response;
  }
}
