import { DomainEvent, type DomainEventProps } from '@libs/ddd';

export class ArtistCreatedDomainEvent extends DomainEvent {
  public readonly name: string;
  constructor(props: DomainEventProps<ArtistCreatedDomainEvent>) {
    super(props);
    this.name = props.name;
  }
}
