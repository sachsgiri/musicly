import { IsUUID } from 'class-validator';

import type { UUID } from 'node:crypto';
import { ApiProperty } from '@nestjs/swagger';

export class LikeArtistRequestDto {
  @ApiProperty()
  @IsUUID()
  readonly artistId: UUID;
}
