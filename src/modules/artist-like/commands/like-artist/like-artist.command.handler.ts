import { Err, Ok, type Result } from 'oxide.ts';

import type { AggregateID } from '@libs/ddd';
import { ConflictException } from '@libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ARTIST_LIKE_REPOSITORY, type ArtistLikeRepositoryPort } from '../../database/artist-like.repository.port';
import { ArtistLikeEntity } from '../../domain/artist-like.entity';
import { ArtistLikeAlreadyExistsError } from '../../domain/artist-like.errors';
import { LikeArtistCommand } from './like-artist.command';

@CommandHandler(LikeArtistCommand)
export class LikeArtistCommandHandler implements ICommandHandler {
  constructor(
    @Inject(ARTIST_LIKE_REPOSITORY)
    protected readonly artistLikeRepo: ArtistLikeRepositoryPort,
  ) {}

  async execute(command: LikeArtistCommand): Promise<Result<AggregateID, ArtistLikeAlreadyExistsError>> {
    const user = ArtistLikeEntity.create({
      userId: command.userId,
      artistId: command.artistId,
    });

    try {
      await this.artistLikeRepo.transaction(async () => this.artistLikeRepo.insert(user));
      return Ok(user.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ArtistLikeAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
