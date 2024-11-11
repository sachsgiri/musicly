import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class SongLikeResponseDto extends ResponseBase {
  @ApiProperty()
  songId: string;

  @ApiProperty()
  userId: string;
}
