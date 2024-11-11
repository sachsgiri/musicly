import { QueryBase } from '@libs/ddd/query.base';
import type { TopListCache } from '@modules/top-list-cache/top-list-cache.provider';
import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPool } from 'nestjs-slonik';
import { Err, Ok, type Result } from 'oxide.ts';
import { type DatabasePool, sql } from 'slonik';
import { TOP_100_POPULAR_ARTISTS_CACHE } from '../../artist.di-tokens';
import { ArtistEntityDbModelMapper } from '../../database';
import { artistSchema } from '../../database/artist.repository';
import { ArtistEntityResponseMapper } from '../../dtos/artist.mapper';
import type { ArtistResponseDto } from '../../dtos/artist.response.dto';

export class FindMostPopularArtistsQuery extends QueryBase {
  constructor(
    public readonly limit: number,
    public readonly year: number,
  ) {
    super();
  }
}

@QueryHandler(FindMostPopularArtistsQuery)
export class FindMostPopularArtistsQueryHandler implements IQueryHandler {
  private readonly responseEntityMapper = new ArtistEntityResponseMapper();
  private readonly dbEntityMapper = new ArtistEntityDbModelMapper();
  constructor(
    @InjectPool()
    private readonly pool: DatabasePool,
    @Inject(TOP_100_POPULAR_ARTISTS_CACHE)
    private readonly top100PopularArtistsCache: TopListCache<ArtistResponseDto>,
  ) {}

  async execute(query: FindMostPopularArtistsQuery): Promise<Result<ArtistResponseDto[], Error>> {
    try {
      let artists = await this.top100PopularArtistsCache.getTopList(query.limit, query.year);

      if (artists.length === 0) {
        const statement = sql.type(artistSchema)`
          SELECT *
          FROM artists
          ORDER BY (total_likes + total_plays + total_song_likes) DESC
          LIMIT 100`;

        const records = await this.pool.query(statement);

        artists = records.rows.map((record) => {
          const artist = this.dbEntityMapper.toDomain(record);
          const dto = this.responseEntityMapper.toResponse(artist);

          this.top100PopularArtistsCache.addToTopList(dto, dto.totalLikes);
          return dto;
        });
      }
      return Ok(artists);
    } catch (error: any) {
      return Err(error);
    }
  }
}
