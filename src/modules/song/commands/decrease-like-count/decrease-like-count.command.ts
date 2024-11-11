import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class DecreaseLikeCountCommand extends Command {
  readonly songId: UUID;

  constructor(props: CommandProps<DecreaseLikeCountCommand>) {
    super(props);
    this.songId = props.songId;
  }
}
