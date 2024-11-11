import { randomUUID } from 'node:crypto';

import { type AggregateID, AggregateRoot } from '@libs/ddd';

import { UserPlayedSongDomainEvent } from './events/user-played-song.domain-event';
import type { CreatePlaybackProps, PlaybackProps } from './playback.types';

export class PlaybackEntity extends AggregateRoot<PlaybackProps> {
  protected readonly _id: AggregateID;

  static create(create: CreatePlaybackProps): PlaybackEntity {
    const id = randomUUID();
    const props: PlaybackProps = { ...create };
    const Like = new PlaybackEntity({ id, props });

    Like.addEvent(
      new UserPlayedSongDomainEvent({
        aggregateId: id,
        ...props,
      }),
    );
    return Like;
  }

  validate(): void {}
}
