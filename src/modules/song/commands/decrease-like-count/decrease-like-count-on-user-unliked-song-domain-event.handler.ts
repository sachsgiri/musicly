import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { UserUnlikedSongDomainEvent } from '@src/modules/song-like/domain/events';
import type { SongEntity } from '../../domain/song.entity';
import { DecreaseLikeCountCommand } from './decrease-like-count.command';

@Injectable()
export class DecreaseLikeCountOnSongLikedDomainEventHandler {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @OnEvent(UserUnlikedSongDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserUnlikedSongDomainEvent): Promise<SongEntity> {
    const command = new DecreaseLikeCountCommand({
      songId: event.songId,
    });
    return this.commandBus.execute(command);
  }
}
