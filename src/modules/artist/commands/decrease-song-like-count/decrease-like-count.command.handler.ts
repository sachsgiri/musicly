import { Ok, type Result } from 'oxide.ts';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ARTIST_REPOSITORY, type ArtistRepositoryPort } from '../../database';
import type { ArtistEntity } from '../../domain/artist.entity';
import { DecreaseSongLikeCountCommand } from './decrease-like-count.command';

@CommandHandler(DecreaseSongLikeCountCommand)
export class DecreaseSongLikeCountCommandHandler implements ICommandHandler {
  constructor(@Inject(ARTIST_REPOSITORY) protected readonly artistRepo: ArtistRepositoryPort) {}

  async execute(command: DecreaseSongLikeCountCommand): Promise<Result<ArtistEntity[], Error>> {
    const artists = await this.artistRepo.decreaseSongLikesCountForMany(command.artistIds);
    return Ok(artists);
  }
}
