import type { UUID } from 'node:crypto';
import { DomainEvent, type DomainEventProps } from '@libs/ddd';

export class UserPlayedSongDomainEvent extends DomainEvent {
  public readonly songId: UUID;

  public readonly userId: UUID;

  constructor(props: DomainEventProps<UserPlayedSongDomainEvent>) {
    super(props);
    this.songId = props.songId;
    this.userId = props.userId;
  }
}
