import type { Express, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const registerErrorMiddleware = (app: Express) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    req.log.error(err.stack, err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong!',
    });
  });
};

export { registerErrorMiddleware };
