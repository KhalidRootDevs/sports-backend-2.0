import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { getNewsForMobileService } from "./service";

export const getNewsForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const data = await getNewsForMobileService(page, limit);
  res.json(handleResponse(200, "News fetched successfully", data));
};
