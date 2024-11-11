import { Err, Ok, type Result } from 'oxide.ts';

import type { AggregateID } from '@libs/ddd';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ARTIST_LIKE_REPOSITORY, type ArtistLikeRepositoryPort } from '../../database';
import { ArtistLikeNotFoundError } from '../../domain/artist-like.errors';
import { UnlikeArtistCommand } from './unlike-artist.command';

@CommandHandler(UnlikeArtistCommand)
export class UnlikeArtistCommandHandler implements ICommandHandler {
  constructor(
    @Inject(ARTIST_LIKE_REPOSITORY)
    protected readonly artistLikeRepo: ArtistLikeRepositoryPort,
  ) {}

  async execute(command: UnlikeArtistCommand): Promise<Result<AggregateID, Error>> {
    const entity = await this.artistLikeRepo.findOneByArtistIdUserId(command.artistId, command.userId);

    if (entity.isSome()) {
      const like = entity.unwrap();

      like.unlike();

      await this.artistLikeRepo.transaction(async () => this.artistLikeRepo.delete(like));
      return Ok(like.getProps().artistId);
    }
    return Err(new ArtistLikeNotFoundError());
  }
}
