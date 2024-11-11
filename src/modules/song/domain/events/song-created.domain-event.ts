import { DomainEvent, type DomainEventProps } from '@libs/ddd';

import type { Artist } from '../song.types';

export class SongCreatedDomainEvent extends DomainEvent {
  public readonly importId: number;

  public readonly artists: Artist[];

  constructor(props: DomainEventProps<SongCreatedDomainEvent>) {
    super(props);
    this.importId = props.importId;
    this.artists = props.artists;
  }
}
