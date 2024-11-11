import { Err, Ok, type Result } from 'oxide.ts';

import type { AggregateID } from '@libs/ddd';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@src/libs/exceptions';
import type { TopListCache } from '@src/modules/top-list-cache/top-list-cache.provider';
import { SONG_REPOSITORY, type SongRepositoryPort } from '../../database/song.repository.port';
import { SongEntityResponseMapper } from '../../dtos/song.mapper';
import type { SongResponseDto } from '../../dtos/song.response.dto';
import { TOP_100_LIKED_SONGS_CACHE, TOP_100_POPULAR_SONGS_CACHE } from '../../song.di-tokens';
import { DecreaseLikeCountCommand } from './decrease-like-count.command';

@CommandHandler(DecreaseLikeCountCommand)
export class DecreaseLikeCountCommandHandler implements ICommandHandler {
  private readonly responseEntityMapper = new SongEntityResponseMapper();
  constructor(
    @Inject(SONG_REPOSITORY) protected readonly songRepo: SongRepositoryPort,
    @Inject(TOP_100_LIKED_SONGS_CACHE)
    private readonly top100LikedSongsCache: TopListCache<SongResponseDto>,
    @Inject(TOP_100_POPULAR_SONGS_CACHE)
    private readonly top100PopularSongsCache: TopListCache<SongResponseDto>,
  ) {}

  async execute(command: DecreaseLikeCountCommand): Promise<Result<AggregateID, Error>> {
    const found = await this.songRepo.findOneById(command.songId);
    if (found.isSome()) {
      const song = found.unwrap();

      song.like();

      const updatedSong = await this.songRepo.transaction(async () => await this.songRepo.decreaseLikesCount(command.songId));

      const { totalLikes, totalPlays } = updatedSong.getProps();

      const cacheDto = this.responseEntityMapper.toResponse(updatedSong);

      this.top100LikedSongsCache.addToTopList(cacheDto, totalLikes);

      this.top100PopularSongsCache.addToTopList(cacheDto, totalPlays + totalLikes);
      return Ok(command.songId);
    }

    return Err(new NotFoundException('Song not found'));
  }
}
