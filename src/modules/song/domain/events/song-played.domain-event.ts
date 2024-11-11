import { DomainEvent, type DomainEventProps } from '@libs/ddd';

import type { Artist } from '../song.types';

export class SongPlayedDomainEvent extends DomainEvent {
  public readonly totalPlays: number;
  public readonly artists: Artist[];

  constructor(props: DomainEventProps<SongPlayedDomainEvent>) {
    super(props);
    this.totalPlays = props.totalPlays;
    this.artists = props.artists;
  }
}
