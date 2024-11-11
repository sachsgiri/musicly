import { randomUUID } from 'node:crypto';
import { type AggregateID, AggregateRoot } from '@libs/ddd';
import { UserLikedSongDomainEvent } from './events/user-liked-song.domain-event';
import { UserUnlikedSongDomainEvent } from './events/user-unliked-song.domain-event';
import type { CreateSongLikeProps, SongLikeProps } from './song-like.types';

export class SongLikeEntity extends AggregateRoot<SongLikeProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateSongLikeProps): SongLikeEntity {
    const id = randomUUID();
    const props: SongLikeProps = { ...create };
    const Like = new SongLikeEntity({ id, props });

    Like.addEvent(
      new UserLikedSongDomainEvent({
        aggregateId: id,
        ...props,
      }),
    );
    return Like;
  }

  unlike(): void {
    this.addEvent(
      new UserUnlikedSongDomainEvent({
        aggregateId: this.id,
        ...this.props,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
