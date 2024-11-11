import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class ArtistLikeResponseDto extends ResponseBase {
  @ApiProperty()
  readonly songId: string;

  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly artistId: string;
}
