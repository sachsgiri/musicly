import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import { type Observable, tap } from 'rxjs';
import { v4 } from 'uuid';
import { RequestContextService } from './AppRequestContext';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const requestId = request?.body?.requestId ?? v4();

    RequestContextService.setRequestId(requestId);

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      }),
    );
  }
}
