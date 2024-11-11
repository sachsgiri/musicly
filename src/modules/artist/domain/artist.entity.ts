import { randomUUID } from 'node:crypto';

import { type AggregateID, AggregateRoot } from '@libs/ddd';

import type { ArtistProps, CreateArtistProps } from './artist.types';
import { ArtistCreatedDomainEvent } from './events/artist-created.domain-event';

export class ArtistEntity extends AggregateRoot<ArtistProps> {
  protected readonly _id: AggregateID;

  static create(input: CreateArtistProps): ArtistEntity {
    const id = randomUUID();

    const props: ArtistProps = {
      ...input,
      totalLikes: 0,
      totalSongLikes: 0,
      totalPlays: 0,
    };

    const artist = new ArtistEntity({ id, props });
    artist.addEvent(
      new ArtistCreatedDomainEvent({
        aggregateId: id,
        name: props.name,
      }),
    );

    return artist;
  }

  like(): void {
    this.props.totalLikes += 1;
  }

  unlike(): void {
    this.props.totalLikes -= 1;
  }

  validate(): void {}
}
