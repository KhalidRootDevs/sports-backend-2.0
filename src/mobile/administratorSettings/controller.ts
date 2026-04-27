import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { getAdministratorSettingsForMobileService } from "./service";

export const getAdministratorSettingsForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const platform = req.query.platform === "ios" ? "ios" : "android";
  const data = await getAdministratorSettingsForMobileService(platform);
  res.json(handleResponse(200, "Settings fetched successfully", data));
};
