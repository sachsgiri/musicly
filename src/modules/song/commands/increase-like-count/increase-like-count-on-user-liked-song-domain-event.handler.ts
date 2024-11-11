import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLikedSongDomainEvent } from '@src/modules/song-like/domain/events';
import type { SongEntity } from '../../domain/song.entity';
import { IncreaseLikeCountCommand } from './increase-like-count.command';

@Injectable()
export class IncreaseLikeCountOnSongLikedDomainEventHandler {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  @OnEvent(UserLikedSongDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserLikedSongDomainEvent): Promise<SongEntity> {
    const command = new IncreaseLikeCountCommand({
      songId: event.songId,
    });
    return this.commandBus.execute(command);
  }
}
