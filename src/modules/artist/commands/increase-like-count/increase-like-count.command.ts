import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class IncreaseLikeCountCommand extends Command {
  readonly artistId: UUID;

  constructor(props: CommandProps<IncreaseLikeCountCommand>) {
    super(props);
    this.artistId = props.artistId;
  }
}
