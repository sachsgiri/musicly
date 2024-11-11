import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@src/libs/api/paginated.response.base';
import { ArtistLikeResponseDto } from './artist-like.response.dto';

export class ArtistLikePaginatedResponseDto extends PaginatedResponseDto<ArtistLikeResponseDto> {
  @ApiProperty({ type: ArtistLikeResponseDto, isArray: true })
  readonly data: readonly ArtistLikeResponseDto[];
}
