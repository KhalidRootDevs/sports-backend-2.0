import { NextFunction, Request, Response } from "express";
import { monksFootballUrl, monksFootballUrl4, rapidApiFootballUrl } from "../lib/axios";

export async function monksFootballV3Data(req: Request, res: Response, next: NextFunction): Promise<void> {
  const removedPrefixUrl = req.originalUrl.replace("/api/sports/monk/v3", "");
  const urlEndpoint = removedPrefixUrl.split("?")[0] ?? "";
  const urlQueryString = removedPrefixUrl.split("?")[1];
  const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;

  try {
    const { data } = await monksFootballUrl.get(mainUrl);

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function monksFootballV4Data(req: Request, res: Response, next: NextFunction): Promise<void> {
  const removedPrefixUrl = req.originalUrl.replace("/api/sports/monk/v4", "");
  const urlEndpoint = removedPrefixUrl.split("?")[0] ?? "";
  const urlQueryString = removedPrefixUrl.split("?")[1];
  const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;

  try {
    const { data } = await monksFootballUrl4.get(mainUrl);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function rapidApiFootballV3Data(req: Request, res: Response, next: NextFunction): Promise<void> {
  const removedPrefixUrl = req.originalUrl.replace("/api/sports/rapid/v3", "");
  const urlEndpoint = removedPrefixUrl.split("?")[0] ?? "";
  const urlQueryString = removedPrefixUrl.split("?")[1];
  const mainUrl = urlQueryString ? `${urlEndpoint}?${urlQueryString}` : urlEndpoint;

  try {
    const { data } = await rapidApiFootballUrl.get(mainUrl);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
