import { randomUUID } from 'node:crypto';
import { type AggregateID, AggregateRoot } from '@libs/ddd';
import type { ArtistLikeProps, CreateArtistLikeProps } from './artist-like.types';
import { UserUnlikedArtistDomainEvent } from './events';
import { UserLikedArtistDomainEvent } from './events/user-liked-artist.domain-event';

export class ArtistLikeEntity extends AggregateRoot<ArtistLikeProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateArtistLikeProps): ArtistLikeEntity {
    const id = randomUUID();
    const props: ArtistLikeProps = { ...create };
    const Like = new ArtistLikeEntity({ id, props });

    Like.addEvent(
      new UserLikedArtistDomainEvent({
        aggregateId: id,
        ...props,
      }),
    );
    return Like;
  }

  unlike(): void {
    this.addEvent(
      new UserUnlikedArtistDomainEvent({
        aggregateId: this.id,
        ...this.props,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
