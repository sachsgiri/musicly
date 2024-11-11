import { routesV1 } from '@config/app.routes';
import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Result } from 'oxide.ts';
import { ArtistResponseDto } from '../../dtos/artist.response.dto';
import { FindMostLikedArtistsQuery } from './find-most-liked-artists.query-handler';
import type { FindMostLikedArtistsRequestDto } from './find-most-liked-artists.request.dto';

@Controller(routesV1.version)
export class FindMostLikedArtistsHttpController {
  constructor(
    @Inject(QueryBus)
    private readonly queryBus: QueryBus,
  ) {}

  @Get(routesV1.artists.mostLiked)
  @ApiOperation({ summary: 'Find most liked artists' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArtistResponseDto[1],
  })
  async findMostLikedArtists(@Query() queryParams: FindMostLikedArtistsRequestDto): Promise<ArtistResponseDto[]> {
    const query = new FindMostLikedArtistsQuery(queryParams?.limit || 10, queryParams?.year || new Date().getFullYear());
    const result: Result<ArtistResponseDto[], Error> = await this.queryBus.execute(query);

    return result.unwrap();
  }
}
