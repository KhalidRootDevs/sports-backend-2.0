import { NextFunction, Request, Response } from 'express';
import { dbActions } from '../../db/dbActions';
import { querySchema } from '../../types';
import { handleResponse } from '../../utils/helper';
import Stream from '../stream/model';
import LiveMatch from './model';
import { createStreaming } from './services';
import { liveMatchSchema } from './validator';

// Get all live matches
export const getLiveMatches = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, search } = querySchema.parse(req.query);

  const query: any = {};

  if (search) {
    query.match_title = new RegExp(search, 'i');
  }

  try {
    const matches = await dbActions.readAll(LiveMatch, {
      query,
      sort: { position: 1 },
      includes: ['streaming_sources'],
      pagination: { page, limit },
    });

    res.status(200).json(handleResponse(200, 'Live matches fetched', matches));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createLiveMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matchData = liveMatchSchema.parse(req.body);

    const newMatch = await dbActions.create(LiveMatch, {
      ...matchData,
      streaming_sources: [],
    });

    const streamingData = createStreaming(matchData);

    const createdStreams = await Promise.all(
      streamingData.map(async (streamData: any) => {
        const newStream = await dbActions.create(Stream, {
          ...streamData,
          matchId: newMatch._id,
          match_id: newMatch.id,
        });
        return newStream._id;
      })
    );

    await dbActions.update(LiveMatch, {
      query: { _id: newMatch._id },
      update: { streaming_sources: createdStreams },
    });

    const populatedMatch = await dbActions.read(LiveMatch, {
      query: { _id: newMatch._id },
      includes: ['streaming_sources'],
    });

    res.status(201).json(handleResponse(201, 'Live match created successfully', populatedMatch));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateLiveMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate and parse the request body
    const matchData = liveMatchSchema.parse(req.body);

    // Update the match information
    const updatedMatch = await dbActions.update(LiveMatch, {
      query: { _id: req.params.id },
      update: {
        ...matchData,
        streaming_sources: [], // Clear the streaming sources for re-association
      },
    });

    if (!updatedMatch) {
      return res.status(404).json(handleResponse(404, 'Live match not found'));
    }

    // Create or update the streaming sources
    const streamingData = createStreaming(matchData);

    // Delete existing streams associated with the match
    await dbActions.deleteMany(Stream, { query: { matchId: updatedMatch._id } });

    const updatedStreams = await Promise.all(
      streamingData.map(async (streamData: any) => {
        const newStream = await dbActions.create(Stream, {
          ...streamData,
          matchId: updatedMatch._id,
          match_id: updatedMatch.id,
        });
        return newStream._id;
      })
    );

    // Update the match with the new stream IDs
    await dbActions.update(LiveMatch, {
      query: { _id: updatedMatch._id },
      update: { streaming_sources: updatedStreams },
    });

    // Populate the streaming sources for the updated match
    const populatedMatch = await dbActions.read(LiveMatch, {
      query: { _id: updatedMatch._id },
      includes: ['streaming_sources'],
    });

    res.status(200).json(handleResponse(200, 'Live match updated successfully', populatedMatch));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getLiveMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the live match by ID
    const match = await dbActions.read(LiveMatch, {
      query: { _id: req.params.id },
      includes: ['streaming_sources'],
    });

    if (!match) {
      return res.status(404).json(handleResponse(404, 'Live match not found'));
    }

    res.status(200).json(handleResponse(200, 'Live match fetched successfully', match));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a live match
export const deleteLiveMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matchId = req.params.id;
    const deletedMatch = await dbActions.delete(LiveMatch, { query: { _id: matchId } });
    if (!deletedMatch) {
      return res.status(404).json(handleResponse(404, 'Live match not found'));
    }
    res.status(200).json(handleResponse(200, 'Live match deleted successfully', deletedMatch));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sortLiveMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    if (Object.keys(data).length === 0) {
      return res.status(400).json(handleResponse(400, 'Body Is Empty'));
    }
    const matches = data.matches;
    await Promise.all(
      matches.map(async (match: any) => {
        dbActions.update(LiveMatch, {
          query: { _id: match.id },
          update: { position: match.position },
        });
      })
    );
    res.status(200).json(handleResponse(200, 'Live matches sorted successfully'));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteAllMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbActions.deleteMany(LiveMatch, {
      query: {},
    });
    res.status(200).json(handleResponse(200, 'All matches deleted successfully'));
  } catch (err) {
    console.error(err);
    next(err);
  }
};
