import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/libs/api/paginated.response.base';
import { SongLikeResponseDto } from './song-like.response.dto';

export class SongLikePaginatedResponseDto extends PaginatedResponseDto<SongLikeResponseDto> {
  @ApiProperty({ type: SongLikeResponseDto, isArray: true })
  readonly data: readonly SongLikeResponseDto[];
}
