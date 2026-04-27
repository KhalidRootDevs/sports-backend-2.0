import jwt from "jsonwebtoken";
import { UserRole } from "../features/user/model";

export const generateToken = (userId: string, role: UserRole, type: "access" | "refresh") => {
  const secret = type === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = type === "access" ? "15m" : "7d";

  return jwt.sign({ userId, role }, secret as string, { expiresIn });
};

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret = type === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret as string, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const generateRandomId = (length: number) => {
  let result = "";
  const characters = "123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return +result;
};
