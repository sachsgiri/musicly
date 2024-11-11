import { IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LikeSongRequestDto {
  @ApiProperty({
    description: 'The song id',
    example: 'c3d3b2e4-7b4d-4a2c-8f4d-9c3d1f2e1a0b',
  })
  @IsUUID()
  songId: string;
}
