import type { AggregateID } from '@libs/ddd';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { Result } from 'oxide.ts';
import { CreateSongCommand } from './create-song.command';
import { CreateSongService } from './create-song.service';

@CommandHandler(CreateSongCommand)
export class CreateSongCommandHandler implements ICommandHandler {
  constructor(
    @Inject(CreateSongService)
    private readonly songCreationService: CreateSongService,
  ) {}

  async execute(command: CreateSongCommand): Promise<Result<AggregateID, Error>> {
    return this.songCreationService.create(command);
  }
}
