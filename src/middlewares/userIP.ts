import { Request, Response, NextFunction } from "express";

const userIpMiddleware = (req: Request & { userIp?: string }, _res: Response, next: NextFunction): void => {
  const publicIP =
    (req.headers["cf-connecting-ip"] as string | undefined) ??
    (req.headers["x-real-ip"] as string | undefined) ??
    req.socket.remoteAddress ??
    "";

  const forwardedIpsStr = req.headers["x-forwarded-for"] as string | undefined;
  const forwardedIps = forwardedIpsStr?.split(", ");

  req.userIp = forwardedIpsStr ? (forwardedIps?.[0] ?? publicIP) : publicIP;
  next();
};

export default userIpMiddleware;
