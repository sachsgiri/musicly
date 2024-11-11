import { Err, Ok, type Result } from 'oxide.ts';

import type { AggregateID } from '@libs/ddd';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@src/libs/exceptions';
import type { TopListCache } from '@src/modules/top-list-cache/top-list-cache.provider';
import { TOP_100_LIKED_ARTISTS_CACHE, TOP_100_POPULAR_ARTISTS_CACHE } from '../../artist.di-tokens';
import { ARTIST_REPOSITORY, type ArtistRepositoryPort } from '../../database/artist.repository.port';
import { ArtistEntityResponseMapper } from '../../dtos/artist.mapper';
import type { ArtistResponseDto } from '../../dtos/artist.response.dto';
import { IncreaseLikeCountCommand } from './increase-like-count.command';

@CommandHandler(IncreaseLikeCountCommand)
export class IncreaseLikeCountCommandHandler implements ICommandHandler {
  private readonly responseEntityMapper = new ArtistEntityResponseMapper();

  constructor(
    @Inject(ARTIST_REPOSITORY) protected readonly artistRepo: ArtistRepositoryPort,
    @Inject(TOP_100_LIKED_ARTISTS_CACHE)
    private readonly top100LikedArtistsCache: TopListCache<ArtistResponseDto>,
    @Inject(TOP_100_POPULAR_ARTISTS_CACHE)
    private readonly top100PopularArtistsCache: TopListCache<ArtistResponseDto>,
  ) {}

  async execute(command: IncreaseLikeCountCommand): Promise<Result<AggregateID, Error>> {
    const found = await this.artistRepo.findOneById(command.artistId);
    if (found.isSome()) {
      const artist = found.unwrap();

      artist.like();

      const artists = await this.artistRepo.transaction(async () => await this.artistRepo.increaseLikesCountForMany([command.artistId]));

      if (artists.length === 0) {
        return Err(new NotFoundException('Artist not found'));
      }

      const updatedArtist = artists[0];
      const { totalLikes, totalPlays, totalSongLikes } = updatedArtist.getProps();

      const cacheDto = this.responseEntityMapper.toResponse(updatedArtist);

      this.top100LikedArtistsCache.addToTopList(cacheDto, totalLikes);

      this.top100PopularArtistsCache.addToTopList(cacheDto, totalPlays + totalLikes + totalSongLikes);

      return Ok(command.artistId);
    }

    return Err(new NotFoundException('Artist not found'));
  }
}
