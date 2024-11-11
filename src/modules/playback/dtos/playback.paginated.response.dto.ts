import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/libs/api/paginated.response.base';
import { PlaybackResponseDto } from './playback.response.dto';

export class PlaybackPaginatedResponseDto extends PaginatedResponseDto<PlaybackResponseDto> {
  @ApiProperty({ type: PlaybackResponseDto, isArray: true })
  readonly data: readonly PlaybackResponseDto[];
}
