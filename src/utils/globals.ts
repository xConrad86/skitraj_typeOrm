import * as express from 'express';

export {};
declare global {
  namespace Express {
    interface Request {
      //for external auth
      user: Record<string, any>;
      //for jwtToken
      locals: Record<string, any>;
    }
  }
}

export interface IRequest extends express.Request {
  user: Record<string, any>;
  locals: Record<string, any>;
}