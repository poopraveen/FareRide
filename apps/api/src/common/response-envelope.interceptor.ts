import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { type ApiSuccess } from '@fareride/types';
import { type FastifyRequest } from 'fastify';
import { map, type Observable } from 'rxjs';

/** Wraps every successful controller result in the success envelope (docs/API.md). */
@Injectable()
export class ResponseEnvelopeInterceptor<TData> implements NestInterceptor<
  TData,
  ApiSuccess<TData>
> {
  intercept(context: ExecutionContext, next: CallHandler<TData>): Observable<ApiSuccess<TData>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return next.handle().pipe(map((data) => ({ success: true, data, requestId: request.id })));
  }
}
