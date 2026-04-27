import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../features/user/model";

// Extend the Request interface to include userId and userRole
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
      userIp?: string;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized." });

  try {
    // Verify the token
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to authorize roles
const authorizeRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userRole;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

const verifyProxyApi = (req: Request, res: Response, next: NextFunction): void => {
  const TOKEN = req.headers["token"];
  if (TOKEN !== process.env["SPORTS_TOKEN"]) {
    res.status(401).json({ status: false, message: "Unauthorized: Please provide valid Token!" });
    return;
  }
  next();
};

const verifyWebApi = (req: Request, res: Response, next: NextFunction): void => {
  const TOKEN = req.headers["token"];
  if (TOKEN !== process.env["TOKEN"]) {
    res.status(401).json({ status: false, message: "Unauthorized: Please provide valid Token!" });
    return;
  }
  next();
};

const verifyMobileApi = (req: Request, res: Response, next: NextFunction): void => {
  const TOKEN = req.headers["token"];
  if (TOKEN !== process.env["MOBILE_TOKEN"]) {
    res.status(401).json({ status: false, message: "Unauthorized: Please provide valid Token!" });
    return;
  }
  next();
};
export { authenticate, authorizeRoles, verifyProxyApi, verifyWebApi, verifyMobileApi };
