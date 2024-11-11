import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateArtistRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  name: string;
}
