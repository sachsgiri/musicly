import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class PlaySongCommand extends Command {
  readonly songId: UUID;

  readonly userId: UUID;

  constructor(props: CommandProps<PlaySongCommand>) {
    super(props);
    this.songId = props.songId;
    this.userId = props.userId;
  }
}
