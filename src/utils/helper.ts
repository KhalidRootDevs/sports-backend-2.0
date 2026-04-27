import { NextFunction, Request, Response } from "express";

export const handleRequest = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const handleResponse = (status: number, message: string, data?: any) => ({
  status,
  message,
  data
});
