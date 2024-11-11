import type { ExceptionBase } from '@libs/exceptions';
import { BadRequestException, type CallHandler, type ExecutionContext, Logger, type NestInterceptor } from '@nestjs/common';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestContextService } from '../context/AppRequestContext';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(ExceptionInterceptor.name);

  intercept(_context: ExecutionContext, next: CallHandler): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        // Logging for debugging purposes
        if (err.status >= 400 && err.status < 500) {
          this.logger.debug(`[${RequestContextService.getRequestId()}] ${err.message}`);

          const isClassValidatorError =
            Array.isArray(err?.response?.message) && typeof err?.response?.error === 'string' && err.status === 400;
          // Transforming class-validator errors to a different format
          if (isClassValidatorError) {
            // biome-ignore lint/style/noParameterAssign: <explanation>
            err = new BadRequestException(
              new ApiErrorResponse({
                statusCode: err.status,
                message: 'Validation error',
                error: err?.response?.error,
                subErrors: err?.response?.message,
                correlationId: RequestContextService.getRequestId(),
              }),
            );
          }
        }

        // Adding request ID to error message
        if (!err.correlationId) {
          err.correlationId = RequestContextService.getRequestId();
        }

        if (err.response) {
          err.response.correlationId = err.correlationId;
        }

        return throwError(err);
      }),
    );
  }
}
