import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class ArtistResponseDto extends ResponseBase {
  @ApiProperty()
  name: string;

  @ApiProperty()
  totalPlays: number;

  @ApiProperty()
  totalSongLikes: number;

  @ApiProperty()
  totalLikes: number;
}
