import { QueryBase } from '@libs/ddd/query.base';
import type { TopListCache } from '@modules/top-list-cache/top-list-cache.provider';
import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPool } from 'nestjs-slonik';
import { Err, Ok, type Result } from 'oxide.ts';
import { type DatabasePool, sql } from 'slonik';
import { SongEntityDbModelMapper } from '../../database/song.mapper';
import { songSchema } from '../../database/song.repository';
import { SongEntityResponseMapper } from '../../dtos/song.mapper';
import type { SongResponseDto } from '../../dtos/song.response.dto';
import { TOP_100_PLAYED_SONGS_CACHE } from '../../song.di-tokens';

// add year as well
export class FindMostPlayedSongsQuery extends QueryBase {
  constructor(
    public readonly limit: number,
    public readonly year: number,
  ) {
    super();
  }
}

@QueryHandler(FindMostPlayedSongsQuery)
export class FindMostPlayedSongsQueryHandler implements IQueryHandler {
  private readonly responseEntityMapper = new SongEntityResponseMapper();
  private readonly dbEntityMapper = new SongEntityDbModelMapper();
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
    @Inject(TOP_100_PLAYED_SONGS_CACHE)
    private readonly top100PlayedSongsCache: TopListCache<SongResponseDto>,
  ) {}

  async execute(query: FindMostPlayedSongsQuery): Promise<Result<SongResponseDto[], Error>> {
    try {
      let songs = await this.top100PlayedSongsCache.getTopList(query.limit, query.year);

      if (songs.length === 0) {
        const statement = sql.type(songSchema)`
          SELECT *
          FROM song
          ORDER BY total_plays DESC
          LIMIT 100`;

        const records = await this.pool.query(statement);

        songs = records.rows.map((record) => {
          const song = this.dbEntityMapper.toDomain(record);
          const dto = this.responseEntityMapper.toResponse(song);

          this.top100PlayedSongsCache.addToTopList(dto, dto.totalLikes);
          return dto;
        });
      }
      return Ok(songs);
    } catch (error: any) {
      return Err(error);
    }
  }
}
