import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { getManageSettingsForMobileService } from "./service";

export const getManageSettingsForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const data = await getManageSettingsForMobileService();
  if (!data) {
    res.status(404).json(handleResponse(404, "Settings not found"));
    return;
  }
  res.json(handleResponse(200, "Settings fetched successfully", data));
};
