import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { UserUnlikedArtistDomainEvent } from '@src/modules/artist-like/domain/events';
import type { ArtistEntity } from '../../domain/artist.entity';
import { DecreaseLikeCountCommand } from './decrease-like-count.command';

@Injectable()
export class DecreaseLikeCountOnArtistLikedDomainEventHandler {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @OnEvent(UserUnlikedArtistDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserUnlikedArtistDomainEvent): Promise<ArtistEntity> {
    const command = new DecreaseLikeCountCommand({
      artistId: event.artistId,
    });
    return this.commandBus.execute(command);
  }
}
