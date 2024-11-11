import type { UUID } from 'node:crypto';

import { Command, type CommandProps } from '@libs/ddd';

export class IncreaseSongPlayCountCommand extends Command {
  readonly artistIds: UUID[];

  constructor(props: CommandProps<IncreaseSongPlayCountCommand>) {
    super(props);
    this.artistIds = props.artistIds;
  }
}
