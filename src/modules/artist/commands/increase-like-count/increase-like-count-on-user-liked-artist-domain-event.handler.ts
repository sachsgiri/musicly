import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLikedArtistDomainEvent } from '@src/modules/artist-like/domain/events';
import type { ArtistEntity } from '../../domain/artist.entity';
import { IncreaseLikeCountCommand } from './increase-like-count.command';

@Injectable()
export class IncreaseLikeCountOnArtistLikedDomainEventHandler {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  @OnEvent(UserLikedArtistDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserLikedArtistDomainEvent): Promise<ArtistEntity> {
    const command = new IncreaseLikeCountCommand({
      artistId: event.artistId,
    });
    return this.commandBus.execute(command);
  }
}
