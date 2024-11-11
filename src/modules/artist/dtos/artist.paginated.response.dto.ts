import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/libs/api/paginated.response.base';
import { ArtistResponseDto } from './artist.response.dto';

export class ArtistPaginatedResponseDto extends PaginatedResponseDto<ArtistResponseDto> {
  @ApiProperty({ type: ArtistResponseDto, isArray: true })
  readonly data: readonly ArtistResponseDto[];
}
