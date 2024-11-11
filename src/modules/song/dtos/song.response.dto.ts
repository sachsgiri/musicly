import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { ArtistRole } from '../domain/song.types';

export class Artist {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsEnum(ArtistRole)
  role: string;
}

export class SongResponseDto extends ResponseBase {
  @ApiProperty()
  importId: number;

  @ApiProperty()
  artists: Artist[];

  @ApiProperty()
  title: string;

  @ApiProperty()
  totalLikes: number;

  @ApiProperty()
  totalPlays: number;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
  })
  dateAdded: string;
}
