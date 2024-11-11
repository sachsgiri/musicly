import { routesV1 } from '@config/app.routes';
import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Result } from 'oxide.ts';
import { ArtistPaginatedResponseDto } from '../../dtos/artist.paginated.response.dto';
import type { ArtistResponseDto } from '../../dtos/artist.response.dto';
import { FindMostPopularArtistsQuery } from './find-most-popular-artists.query-handler';
import type { FindMostPopularArtistsRequestDto } from './find-most-popular-artists.request.dto';

@Controller(routesV1.version)
export class FindMostPopularArtistsHttpController {
  constructor(
    @Inject(QueryBus)
    private readonly queryBus: QueryBus,
  ) {}

  @Get(routesV1.artists.mostPopular)
  @ApiOperation({ summary: 'Find artists' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArtistPaginatedResponseDto,
  })
  async findMostPopularArtists(@Query() queryParams: FindMostPopularArtistsRequestDto): Promise<ArtistResponseDto[]> {
    const query = new FindMostPopularArtistsQuery(queryParams?.limit || 10, queryParams?.year || new Date().getFullYear());
    const result: Result<ArtistResponseDto[], Error> = await this.queryBus.execute(query);

    return result.unwrap();
  }
}
