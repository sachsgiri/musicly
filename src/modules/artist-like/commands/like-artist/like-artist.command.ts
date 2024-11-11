import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class LikeArtistCommand extends Command {
  readonly userId: UUID;

  readonly artistId: UUID;

  constructor(props: CommandProps<LikeArtistCommand>) {
    super(props);
    this.userId = props.userId;
    this.artistId = props.artistId;
  }
}
