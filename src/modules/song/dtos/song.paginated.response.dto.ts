import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/libs/api/paginated.response.base';
import { SongResponseDto } from './song.response.dto';

export class SongPaginatedResponseDto extends PaginatedResponseDto<SongResponseDto> {
  @ApiProperty({ type: SongResponseDto, isArray: true })
  readonly data: readonly SongResponseDto[];
}
