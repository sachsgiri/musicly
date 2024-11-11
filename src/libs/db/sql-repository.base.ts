import { None, type Option, Some } from 'oxide.ts';
import {
  type DatabasePool,
  type DatabaseTransactionConnection,
  type IdentifierSqlToken,
  type MixedRow,
  type PrimitiveValueExpression,
  type QueryResult,
  type QueryResultRow,
  type SqlSqlToken,
  UniqueIntegrityConstraintViolationError,
  sql,
} from 'slonik';
import type { TypeOf, ZodObject, ZodTypeAny } from 'zod';

import type { EntityDbModelMapper, RepositoryPort } from '@libs/ddd';
import { type AggregateRoot, Paginated, type PaginatedQueryParams } from '@libs/ddd';
import { ConflictException } from '@libs/exceptions';
import type { EventEmitter2 } from '@nestjs/event-emitter';

import type { LoggerPort } from '../ports/logger.port';
import type { ObjectLiteral } from '../types';

export abstract class SqlRepositoryBase<Aggregate extends AggregateRoot<any>, DbModel extends ObjectLiteral>
  implements RepositoryPort<Aggregate>
{
  protected abstract tableName: string;

  protected abstract schema: ZodObject<any>;

  protected constructor(
    private readonly _pool: DatabasePool,
    protected readonly mapper: EntityDbModelMapper<Aggregate, DbModel>,
    protected readonly eventEmitter: EventEmitter2,
    protected readonly logger: LoggerPort,
  ) {}

  async findOneById(id: string, transactionConnection?: DatabaseTransactionConnection): Promise<Option<Aggregate>> {
    const query = sql.type(this.schema)`SELECT * FROM ${sql.identifier([this.tableName])} WHERE id = ${id}`;

    const result = await (transactionConnection ?? this._pool).query(query);
    return result.rows[0] ? Some(this.mapper.toDomain(result.rows[0])) : None;
  }

  async findManyByIds(ids: string[], transactionConnection?: DatabaseTransactionConnection): Promise<Aggregate[]> {
    const query = sql.type(this.schema)`
    SELECT * FROM ${sql.identifier([this.tableName])}
    WHERE id = ANY(${sql.array(ids, 'uuid')})
    `;

    const result = await (transactionConnection ?? this._pool).query(query);

    return result.rows.map(this.mapper.toDomain);
  }

  async findAll(transactionConnection?: DatabaseTransactionConnection): Promise<Aggregate[]> {
    const query = sql.type(this.schema)`SELECT * FROM ${sql.identifier([this.tableName])}`;

    const result = await (transactionConnection ?? this._pool).query(query);

    return result.rows.map(this.mapper.toDomain);
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
    transactionConnection?: DatabaseTransactionConnection,
  ): Promise<Paginated<Aggregate>> {
    const query = sql.type(this.schema)`
    SELECT * FROM ${sql.identifier([this.tableName])}
    LIMIT ${params.limit}
    OFFSET ${params.offset}
    `;

    const result = await (transactionConnection ?? this._pool).query(query);

    const entities = result.rows.map(this.mapper.toDomain);
    return new Paginated({
      data: entities,
      count: result.rowCount,
      limit: params.limit,
      page: params.page,
    });
  }

  async delete(entity: Aggregate, requestId?: string, transactionConnection?: DatabaseTransactionConnection): Promise<boolean> {
    entity.validate();
    const query = sql`DELETE FROM ${sql.identifier([this.tableName])} WHERE id = ${entity.id}`;

    this.logger.debug(`[${requestId ?? 'no-request-id'}] deleting entities ${entity.id} from ${this.tableName}`);

    const result = await (transactionConnection ?? this._pool).query(query);

    await entity.publishEvents(this.logger, this.eventEmitter);

    return result.rowCount > 0;
  }

  async insert(entity: Aggregate | Aggregate[], requestId?: string, transactionConnection?: DatabaseTransactionConnection): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    const records = entities.map(this.mapper.toPersistence);

    const query = this.generateInsertQuery(records);

    try {
      await this.writeQuery(query, entities, requestId, transactionConnection);
    } catch (error) {
      if (error instanceof UniqueIntegrityConstraintViolationError) {
        this.logger.debug(`[${requestId ?? 'no-request-id'}] ${(error.originalError as any).detail}`);
        throw new ConflictException('Record already exists', error);
      }
      throw error;
    }
  }

  protected async writeQuery<T>(
    sql: SqlSqlToken<T extends MixedRow ? T : Record<string, PrimitiveValueExpression>>,
    entity: Aggregate | Aggregate[],
    requestId?: string,
    transactionConnection?: DatabaseTransactionConnection,
  ): Promise<QueryResult<T extends MixedRow ? (T extends ZodTypeAny ? TypeOf<ZodTypeAny & MixedRow & T> : T) : T>> {
    const entities = Array.isArray(entity) ? entity : [entity];
    // biome-ignore lint/complexity/noForEach: <explanation>
    entities.forEach((entity) => entity.validate());
    const entityIds = entities.map((e) => e.id);

    this.logger.debug(`[${requestId ?? 'no-request-id'}] writing ${entities.length} entities to "${this.tableName}" table: ${entityIds}`);

    const result = await (transactionConnection ?? this._pool).query(sql);

    await Promise.all(entities.map((entity) => entity.publishEvents(this.logger, this.eventEmitter)));
    return result;
  }

  protected generateInsertQuery(models: DbModel[]): SqlSqlToken<QueryResultRow> {
    const entries = Object.entries(models[0]);
    const values: any[] = [];
    const propertyNames: IdentifierSqlToken[] = [];

    // biome-ignore lint/complexity/noForEach: <explanation>
    entries.forEach((entry) => {
      if (entry[0] && entry[1] !== undefined) {
        propertyNames.push(sql.identifier([entry[0]]));
        if (entry[1] instanceof Date) {
          values.push(sql.timestamp(entry[1]));
        } else {
          values.push(entry[1]);
        }
      }
    });

    const query = sql`INSERT INTO ${sql.identifier([
      this.tableName,
    ])} (${sql.join(propertyNames, sql`, `)}) VALUES (${sql.join(values, sql`, `)})`;

    return query;
  }

  public async transaction<T>(
    handler: (transactionConnection: DatabaseTransactionConnection) => Promise<T>,
    requestId?: string,
  ): Promise<T> {
    return this._pool.transaction(async (connection) => {
      this.logger.debug(`[${requestId ?? 'no-request-id'}] transaction started`);

      try {
        const result = await handler(connection);
        this.logger.debug(`[${requestId ?? 'no-request-id'}] transaction committed`);
        return result;
      } catch (e) {
        this.logger.debug(`[${requestId ?? 'no-request-id'}] transaction aborted`);
        console.error(e);
        throw e;
      }
    });
  }

  get pool(): DatabasePool {
    return this._pool;
  }
}
