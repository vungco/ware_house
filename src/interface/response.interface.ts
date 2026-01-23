import { Response as ExpressResponse } from 'express';

export interface IResponse extends ExpressResponse {
  ok: (args?: {
    data?: any;
    message?: string;
    meta?: any;
    code?: number; // default 0
    statusCode?: number; // default 200
  }) => any;

  err: (args?: {
    message?: string;
    code?: number; // default 1
    statusCode?: number; // default 400
    errors?: any;
  }) => any;
}
