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
