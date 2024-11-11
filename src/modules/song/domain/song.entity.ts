import { randomUUID } from 'node:crypto';
import { type AggregateID, AggregateRoot } from '@libs/ddd';
import { SongCreatedDomainEvent, SongPlayedDomainEvent } from './events';
import { SongLikedDomainEvent } from './events/song-liked.domain-event';
import { SongUnlikedDomainEvent } from './events/song-unliked.domain-event';
import type { CreateSongProps, SongProps } from './song.types';

export class SongEntity extends AggregateRoot<SongProps> {
  protected readonly _id: AggregateID;

  static create(input: CreateSongProps): SongEntity {
    const id = randomUUID();
    const props: SongProps = { ...input, totalLikes: 0, totalPlays: 0 };
    const song = new SongEntity({ id, props });

    song.addEvent(
      new SongCreatedDomainEvent({
        aggregateId: id,
        importId: props.importId,
        artists: props.artists,
      }),
    );
    return song;
  }

  play(): void {
    this.props.totalPlays += 1;
    this.addEvent(
      new SongPlayedDomainEvent({
        aggregateId: this.id,
        totalPlays: this.props.totalPlays,
        artists: this.props.artists,
      }),
    );
  }

  like(): void {
    this.props.totalLikes += 1;
    this.addEvent(
      new SongLikedDomainEvent({
        aggregateId: this.id,
        totalLikes: this.props.totalLikes,
        artists: this.props.artists,
      }),
    );
  }

  unlike(): void {
    this.props.totalLikes -= 1;
    this.addEvent(
      new SongUnlikedDomainEvent({
        aggregateId: this.id,
        totalLikes: this.props.totalLikes,
        artists: this.props.artists,
      }),
    );
  }

  validate(): void {}
}
