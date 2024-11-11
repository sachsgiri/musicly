import type { UUID } from 'node:crypto';
import { DomainEvent, type DomainEventProps } from '@libs/ddd';

export class UserUnlikedArtistDomainEvent extends DomainEvent {
  public readonly userId: UUID;

  public readonly artistId: UUID;

  constructor(props: DomainEventProps<UserUnlikedArtistDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.artistId = props.artistId;
  }
}
