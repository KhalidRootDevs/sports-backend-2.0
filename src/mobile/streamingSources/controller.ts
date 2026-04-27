import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { getStreamingSourcesForMobileService } from "./service";

export const getStreamingSourcesForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const matchId = Number(req.params.matchId);
  if (isNaN(matchId)) {
    res.status(400).json(handleResponse(400, "Invalid match ID"));
    return;
  }
  const data = await getStreamingSourcesForMobileService(matchId);
  res.json(handleResponse(200, "Streaming sources fetched successfully", data));
};
