import { IsUUID } from 'class-validator';

import type { UUID } from 'node:crypto';
import { ApiProperty } from '@nestjs/swagger';

export class PlaySongRequestDto {
  @ApiProperty()
  @IsUUID()
  readonly songId: UUID;
}
