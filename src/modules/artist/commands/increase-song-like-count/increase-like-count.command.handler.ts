import { Ok, type Result } from 'oxide.ts';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ARTIST_REPOSITORY, type ArtistRepositoryPort } from '../../database';
import type { ArtistEntity } from '../../domain/artist.entity';
import { IncreaseSongLikeCountCommand } from './increase-like-count.command';

@CommandHandler(IncreaseSongLikeCountCommand)
export class IncreaseSongLikeCountCommandHandler implements ICommandHandler {
  constructor(@Inject(ARTIST_REPOSITORY) protected readonly artistRepo: ArtistRepositoryPort) {}

  async execute(command: IncreaseSongLikeCountCommand): Promise<Result<ArtistEntity[], Error>> {
    const artists = await this.artistRepo.increaseSongLikesCountForMany(command.artistIds);
    return Ok(artists);
  }
}
