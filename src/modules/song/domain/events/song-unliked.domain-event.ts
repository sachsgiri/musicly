import { DomainEvent, type DomainEventProps } from '@libs/ddd';

import type { Artist } from '../song.types';

export class SongUnlikedDomainEvent extends DomainEvent {
  public readonly totalLikes: number;
  public readonly artists: Artist[];

  constructor(props: DomainEventProps<SongUnlikedDomainEvent>) {
    super(props);
    this.totalLikes = props.totalLikes;
    this.artists = props.artists;
  }
}
