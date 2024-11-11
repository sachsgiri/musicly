import { SongLikedDomainEvent } from '@modules/song/domain/events/song-liked.domain-event';
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import type { ArtistEntity } from '../../domain/artist.entity';
import { IncreaseSongLikeCountCommand } from './increase-like-count.command';

@Injectable()
export class IncreaseLikeCountOnSongLikedDomainEventHandler {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  @OnEvent(SongLikedDomainEvent.name, { async: true, promisify: true })
  async handle(event: SongLikedDomainEvent): Promise<ArtistEntity> {
    const artistIds = event.artists.map((artist) => artist.id);
    const command = new IncreaseSongLikeCountCommand({
      artistIds,
    });
    return this.commandBus.execute(command);
  }
}
