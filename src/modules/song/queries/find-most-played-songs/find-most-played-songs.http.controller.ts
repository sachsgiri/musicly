import { routesV1 } from '@config/app.routes';
import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Result } from 'oxide.ts';
import { SongPaginatedResponseDto } from '../../dtos/song.paginated.response.dto';
import type { SongResponseDto } from '../../dtos/song.response.dto';
import { FindMostPlayedSongsQuery } from './find-most-played-songs.query-handler';
import type { FindMostPlayedSongsRequestDto } from './find-most-played-songs.request.dto';

@Controller(routesV1.version)
export class FindMostPlayedSongsHttpController {
  constructor(
    @Inject(QueryBus)
    private readonly queryBus: QueryBus,
  ) {}

  @Get(routesV1.songs.mostPlayed)
  @ApiOperation({ summary: 'Find songs' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SongPaginatedResponseDto,
  })
  async findMostPlayedSongs(@Query() queryParams: FindMostPlayedSongsRequestDto): Promise<SongResponseDto[]> {
    const query = new FindMostPlayedSongsQuery(queryParams?.limit || 10, queryParams?.year || new Date().getFullYear());
    const result: Result<SongResponseDto[], Error> = await this.queryBus.execute(query);

    return result.unwrap();
  }
}
