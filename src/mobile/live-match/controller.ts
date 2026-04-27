import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { getLiveMatchesForMobileService } from "./service";

export const getLiveMatchesForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const data = await getLiveMatchesForMobileService();
  res.json(handleResponse(200, "Live matches fetched successfully", data));
};
