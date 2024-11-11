import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class IncreasePlayCountCommand extends Command {
  readonly songId: UUID;

  constructor(props: CommandProps<IncreasePlayCountCommand>) {
    super(props);
    this.songId = props.songId;
  }
}
