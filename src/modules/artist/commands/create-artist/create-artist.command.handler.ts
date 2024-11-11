import type { AggregateID } from '@libs/ddd';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { Result } from 'oxide.ts';
import { CreateArtistCommand } from './create-artist.command';
import { CreateArtistService } from './create-artist.service';

@CommandHandler(CreateArtistCommand)
export class CreateArtistCommandHandler implements ICommandHandler {
  constructor(
    @Inject(CreateArtistService)
    private readonly artistCreationService: CreateArtistService,
  ) {}

  async execute(command: CreateArtistCommand): Promise<Result<AggregateID, Error>> {
    return this.artistCreationService.create(command);
  }
}
