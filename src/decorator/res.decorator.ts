import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IResponse } from 'src/interface/response.interface';

export const Res = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IResponse => {
    const res = ctx.switchToHttp().getResponse<IResponse>();

    // Gắn helper ok()
    res.ok = ({
      data = null,
      message = 'success',
      meta = undefined,
      code = 0,
      statusCode = 200,
    } = {}) => {
      const payload: any = { code, message, data };
      if (meta !== undefined) payload.meta = meta;
      return res.status(statusCode).json(payload);
    };

    // Gắn helper err()
    res.err = ({
      message = 'error',
      code = 1,
      statusCode = 400,
      errors = undefined,
    } = {}) => {
      const payload: any = { code, message };
      if (errors !== undefined) payload.errors = errors;
      return res.status(statusCode).json(payload);
    };

    return res;
  },
);
