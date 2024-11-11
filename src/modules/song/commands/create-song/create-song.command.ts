import { Command, type CommandProps } from '@libs/ddd';
import type { Artist } from '../../domain/song.types';

export class CreateSongCommand extends Command {
  public readonly importId: number;
  public readonly artists: Artist[];
  public readonly title: string;
  public readonly dateAdded: Date;

  constructor(props: CommandProps<CreateSongCommand>) {
    super(props);
    this.importId = props.importId;
    this.artists = props.artists;
    this.title = props.title;
    this.dateAdded = props.dateAdded;
  }
}
