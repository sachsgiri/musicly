import { SongPlayedDomainEvent } from '@modules/song/domain/events/song-played.domain-event';
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import type { ArtistEntity } from '../../domain/artist.entity';
import { IncreaseSongPlayCountCommand } from './increase-play-count.command';

@Injectable()
export class IncreasePlayCountOnSongPlayedDomainEventHandler {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  @OnEvent(SongPlayedDomainEvent.name, { async: true, promisify: true })
  async handle(event: SongPlayedDomainEvent): Promise<ArtistEntity> {
    const artistIds = event.artists.map((artist) => artist.id);
    const command = new IncreaseSongPlayCountCommand({
      artistIds,
    });
    return this.commandBus.execute(command);
  }
}
