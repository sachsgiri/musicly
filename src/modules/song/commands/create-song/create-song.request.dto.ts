import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsDate, IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import type { Artist } from '../../domain/song.types';

export class CreateSongRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  title: string;

  @ApiProperty()
  @IsNumber()
  importId: number;

  @ApiProperty()
  @IsDate()
  dateAdded: Date;

  @ApiProperty()
  artists: Artist[];
}
