import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FindMostLikedArtistsRequestDto {
  @ApiProperty({ example: 10, description: 'Number of top artists' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty({ example: 2024, description: 'Year' })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(5000)
  year: number;
}
