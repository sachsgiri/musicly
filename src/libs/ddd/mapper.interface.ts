import type { Entity } from './entity.base';

export interface Mapper<DomainEntity extends Entity<any>, DbRecord, Response = any> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: any): DomainEntity;
  toResponse(entity: DomainEntity): Response;
}

export interface EntityDbModelMapper<DomainEntity extends Entity<any>, DbRecord> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: any): DomainEntity;
}

export interface EntityResponseMapper<DomainEntity extends Entity<any>, Response> {
  toResponse(entity: DomainEntity): Response;
}
