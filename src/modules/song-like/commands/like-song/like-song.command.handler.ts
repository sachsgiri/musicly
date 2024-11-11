import { Err, Ok, type Option, type Result, Some } from 'oxide.ts';

import { ConflictException } from '@libs/exceptions';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

import { BaseCommandHandler } from '@libs/ddd/command-handler.base';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SONG_LIKE_REPOSITORY, type SongLikeRepositoryPort } from '../../database/song-like.repository.port';
import { SongLikeEntity } from '../../domain/song-like.entity';
import { SongLikeAlreadyExistsError } from '../../domain/song-like.errors';
import { LikeSongCommand } from './like-song.command';

@CommandHandler(LikeSongCommand)
export class LikeSongCommandHandler extends BaseCommandHandler<SongLikeEntity, LikeSongCommand> {
  constructor(
    @Inject(SONG_LIKE_REPOSITORY)
    protected readonly songLikeRepo: SongLikeRepositoryPort,
    @Inject(EventEmitter2)
    eventEmitter: EventEmitter2,
  ) {
    super(new Logger(LikeSongCommandHandler.name), eventEmitter);
  }

  getState(command: LikeSongCommand): Option<SongLikeEntity> {
    return Some(
      SongLikeEntity.create({
        songId: command.songId,
        userId: command.userId,
      }),
    );
  }

  async handle(command: LikeSongCommand, song: SongLikeEntity): Promise<Result<SongLikeEntity, Error>> {
    try {
      await this.songLikeRepo.insert(song);
      return Ok(song);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new SongLikeAlreadyExistsError());
      }
      throw error;
    }
  }
}
