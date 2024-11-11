import { Command, type CommandProps } from '@libs/ddd';

export class CreateArtistCommand extends Command {
  public readonly name: string;

  constructor(props: CommandProps<CreateArtistCommand>) {
    super(props);
    this.name = props.name;
  }
}
