import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const time = Date.now() - now;
          console.log(
            `[${method}] ${url} - ${time}ms`,
          );
        },
        error: (err) => {
          const time = Date.now() - now;
          console.error(
            `[${method}] ${url} - ${time}ms - ERROR: ${err?.message}`,
          );
        },
      }),
    );
  }
}
