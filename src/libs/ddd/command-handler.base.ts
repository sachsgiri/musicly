import { NotFoundException } from '@libs/exceptions';
import type { Logger } from '@nestjs/common';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { EventEmitter2 } from '@nestjs/event-emitter';
import type { Option, Result } from 'oxide.ts';
import type { AggregateRoot } from './aggregate-root.base';
import type { Command } from './command.base';

export abstract class BaseCommandHandler<T extends AggregateRoot<EntityProps>, C extends Command, EntityProps = any>
  implements ICommandHandler<C>
{
  constructor(
    protected readonly logger: Logger,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  abstract getState(command: C): Option<T> | Promise<Option<T>>;
  abstract handle(command: C, aggregate: T): Promise<Result<T, Error>>;

  async execute(command: C): Promise<Result<T, Error>> {
    const stateOption = await this.getState(command);
    if (stateOption.isNone()) {
      throw new NotFoundException('Aggregate not found');
    }
    const state = stateOption.unwrap();

    const result = await this.handle(command, state);

    if (result.isOk()) {
      await state.publishEvents(this.logger, this.eventEmitter);
    }
    return result;
  }
}
