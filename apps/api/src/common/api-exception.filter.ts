import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { type ApiFailure, type ErrorCode } from '@fareride/types';
import { type FastifyReply, type FastifyRequest } from 'fastify';

/**
 * Throw this from services for errors with a stable, client-facing code.
 * Anything else that escapes becomes INTERNAL_ERROR with a generic message.
 */
export class ApiException extends HttpException {
  constructor(
    readonly code: ErrorCode,
    message: string,
    status: HttpStatus,
    readonly details: Record<string, unknown> = {},
  ) {
    super(message, status);
  }
}

const FIRST_SERVER_ERROR_STATUS: number = HttpStatus.INTERNAL_SERVER_ERROR;

const STATUS_TO_CODE: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_FAILED',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
};

const GENERIC_MESSAGE: Record<ErrorCode, string> = {
  VALIDATION_FAILED: 'The request is invalid',
  UNAUTHENTICATED: 'Authentication is required',
  TOKEN_EXPIRED: 'The session has expired',
  FORBIDDEN: 'You do not have access to this resource',
  NOT_FOUND: 'The resource was not found',
  CONFLICT: 'The request conflicts with the current state',
  RATE_LIMITED: 'Too many requests',
  INTERNAL_ERROR: 'Something went wrong',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable',
};

/** Maps every error to the API error envelope (docs/API.md). Stack traces are logged, never returned. */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
    const reply = context.getResponse<FastifyReply>();

    const { status, body } = this.toFailure(exception, request.id);

    if (status >= FIRST_SERVER_ERROR_STATUS) {
      this.logger.error(
        { err: exception, requestId: request.id, path: request.url },
        'Request failed',
      );
    }

    void reply.status(status).send(body);
  }

  private toFailure(exception: unknown, requestId: string): { status: number; body: ApiFailure } {
    if (exception instanceof ApiException) {
      return {
        status: exception.getStatus(),
        body: failure(exception.code, exception.message, exception.details, requestId),
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const code =
        STATUS_TO_CODE[status] ??
        (status >= FIRST_SERVER_ERROR_STATUS ? 'INTERNAL_ERROR' : 'VALIDATION_FAILED');
      const message =
        status >= FIRST_SERVER_ERROR_STATUS ? GENERIC_MESSAGE[code] : exception.message;
      return { status, body: failure(code, message, {}, requestId) };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: failure('INTERNAL_ERROR', GENERIC_MESSAGE.INTERNAL_ERROR, {}, requestId),
    };
  }
}

function failure(
  code: ErrorCode,
  message: string,
  details: Record<string, unknown>,
  requestId: string,
): ApiFailure {
  return { success: false, error: { code, message, details }, requestId };
}
