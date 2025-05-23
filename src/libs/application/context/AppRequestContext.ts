import { RequestContext } from 'nestjs-request-context';
import type { DatabaseTransactionConnection } from 'slonik';

/**
 * Setting some isolated context for each request.
 */

export class AppRequestContext extends RequestContext {
  requestId: string;
  transactionConnection?: DatabaseTransactionConnection; // For global transactions
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = RequestContextService.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return RequestContextService.getContext().requestId;
  }

  static getTransactionConnection(): DatabaseTransactionConnection | undefined {
    const ctx = RequestContextService.getContext();
    return ctx.transactionConnection;
  }

  static setTransactionConnection(transactionConnection?: DatabaseTransactionConnection): void {
    const ctx = RequestContextService.getContext();
    ctx.transactionConnection = transactionConnection;
  }

  static cleanTransactionConnection(): void {
    const ctx = RequestContextService.getContext();
    ctx.transactionConnection = undefined;
  }
}
