import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class IncreaseSongLikeCountCommand extends Command {
  readonly artistIds: UUID[];

  constructor(props: CommandProps<IncreaseSongLikeCountCommand>) {
    super(props);
    this.artistIds = props.artistIds;
  }
}
