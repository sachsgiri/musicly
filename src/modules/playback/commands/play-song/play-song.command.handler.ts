import { Ok, type Result } from 'oxide.ts';

import type { AggregateID } from '@libs/ddd';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { PLAYBACK_REPOSITORY, type PlaybackRepositoryPort } from '../../database/playback.repository.port';
import { PlaybackEntity } from '../../domain/playback.entity';
import { PlaySongCommand } from './play-song.command';

@CommandHandler(PlaySongCommand)
export class PlaySongCommandHandler implements ICommandHandler {
  constructor(
    @Inject(PLAYBACK_REPOSITORY)
    protected readonly playbackRepo: PlaybackRepositoryPort,
  ) {}

  async execute(command: PlaySongCommand): Promise<Result<AggregateID, never>> {
    const playback = PlaybackEntity.create({
      songId: command.songId,
      userId: command.userId,
    });

    await this.playbackRepo.transaction(async () => this.playbackRepo.insert(playback));
    return Ok(playback.id);
  }
}
