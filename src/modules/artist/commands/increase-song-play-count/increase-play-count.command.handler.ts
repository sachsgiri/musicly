import { Ok, type Result } from 'oxide.ts';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ARTIST_REPOSITORY, type ArtistRepositoryPort } from '../../database';
import type { ArtistEntity } from '../../domain/artist.entity';
import { IncreaseSongPlayCountCommand } from './increase-play-count.command';

@CommandHandler(IncreaseSongPlayCountCommand)
export class IncreaseSongPlayCountCommandHandler implements ICommandHandler {
  constructor(@Inject(ARTIST_REPOSITORY) protected readonly artistRepo: ArtistRepositoryPort) {}

  async execute(command: IncreaseSongPlayCountCommand): Promise<Result<ArtistEntity[], Error>> {
    const artists = await this.artistRepo.increasePlaysCountForMany(command.artistIds);
    return Ok(artists);
  }
}
