import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class DecreaseSongLikeCountCommand extends Command {
  readonly artistIds: UUID[];

  constructor(props: CommandProps<DecreaseSongLikeCountCommand>) {
    super(props);
    this.artistIds = props.artistIds;
  }
}
