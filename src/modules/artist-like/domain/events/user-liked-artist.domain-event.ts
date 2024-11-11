import type { UUID } from 'node:crypto';
import { DomainEvent, type DomainEventProps } from '@libs/ddd';

export class UserLikedArtistDomainEvent extends DomainEvent {
  public readonly userId: UUID;

  public readonly artistId: UUID;

  constructor(props: DomainEventProps<UserLikedArtistDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.artistId = props.artistId;
  }
}
