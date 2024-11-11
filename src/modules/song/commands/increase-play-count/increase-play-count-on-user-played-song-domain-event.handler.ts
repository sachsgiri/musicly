import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { UserPlayedSongDomainEvent } from '@src/modules/playback/domain/events';
import type { SongEntity } from '../../domain/song.entity';
import { IncreasePlayCountCommand } from './increase-play-count.command';

@Injectable()
export class IncreasePlayCountOnSongPlayedDomainEventHandler {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  @OnEvent(UserPlayedSongDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserPlayedSongDomainEvent): Promise<SongEntity> {
    const command = new IncreasePlayCountCommand({
      songId: event.songId,
    });
    return this.commandBus.execute(command);
  }
}
