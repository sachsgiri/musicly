import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class IncreaseLikeCountCommand extends Command {
  readonly songId: UUID;

  constructor(props: CommandProps<IncreaseLikeCountCommand>) {
    super(props);
    this.songId = props.songId;
  }
}
