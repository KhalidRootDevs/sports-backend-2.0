import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions";
import { handleResponse } from "../../utils/helper";
import Stream from "./model";

// Get all streaming sources
export const getStreamingSources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matchId = req.params.matchId;

    if (!matchId) {
      return res.status(400).json(handleResponse(400, "Match ID is required"));
    }

    const streams = await dbActions.readAll(Stream, {
      query: { match_id: matchId },
      sort: { position: 1 }
    });

    res.status(200).json(handleResponse(200, "Streaming sources fetched", streams));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateStreamingSourcesOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { streams } = req.body;

    if (!Array.isArray(streams)) {
      return res.status(400).json(handleResponse(400, "Invalid data format"));
    }

    // Iterate over each match and update its position
    await Promise.all(
      streams.map(async (stream: { id: string; position: number }) => {
        await dbActions.update(Stream, {
          query: { _id: stream.id },
          update: { position: stream.position }
        });
      })
    );

    res.status(200).json(handleResponse(200, "Streaming sources sorted successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
