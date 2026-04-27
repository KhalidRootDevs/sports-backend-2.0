import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { getHighlightsForMobileService, getHighlightByIdForMobileService } from "./service";

export const getHighlightsForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const data = await getHighlightsForMobileService(page, limit);
  res.json(handleResponse(200, "Highlights fetched successfully", data));
};

export const getHighlightByIdForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const data = await getHighlightByIdForMobileService(req.params.id);
  if (!data) {
    res.status(404).json(handleResponse(404, "Highlight not found"));
    return;
  }
  res.json(handleResponse(200, "Highlight fetched successfully", data));
};
