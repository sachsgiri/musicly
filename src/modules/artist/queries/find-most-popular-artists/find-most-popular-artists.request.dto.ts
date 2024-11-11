import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class FindMostPopularArtistsRequestDto {
  @ApiProperty({ example: 1, description: 'no. of top artists' })
  @IsOptional()
  @MaxLength(100)
  limit: number;

  @ApiProperty({ example: 2024, description: 'year' })
  @IsOptional()
  @MaxLength(5000)
  year: number;
}
