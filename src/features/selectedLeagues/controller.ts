import { NextFunction, Request, Response } from 'express';
import { dbActions } from '../../db/dbActions';
import { querySchema } from '../../types';
import { handleResponse } from '../../utils/helper';
import SelectedLeagues from './model';
import { selectedLeaguesSchema } from './validator';
import { monksFootballUrl } from '../../lib/axios';

// Get all selected leagues
export const allSelectedLeagues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const selectedLeagues = await dbActions.readEvery(SelectedLeagues, {
      sort: { position: 1 },
    });

    res.status(201).json(handleResponse(201, 'Every Selected league fetched', selectedLeagues));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Create a new selected league
export const createSelectedLeague = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const selectedLeagueData = selectedLeaguesSchema.parse(req.body);

    // Check if the league already exists in the database
    const existingLeague = await dbActions.read(SelectedLeagues, {
      query: { id: selectedLeagueData.id },
    });

    if (existingLeague) {
      return res
        .status(409) // 409 Conflict status code
        .json(handleResponse(409, 'League has already been added', existingLeague));
    }

    // If not, proceed to create the new league
    const selectedLeague = await dbActions.create(SelectedLeagues, selectedLeagueData);
    res
      .status(201)
      .json(handleResponse(201, 'Selected league created successfully', selectedLeague));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all selected leagues
export const getAllSelectedLeagues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.email = new RegExp(search, 'i');
    }

    const selectedLeagues = await dbActions.readAll(SelectedLeagues, {
      query,
      sort: { createdAt: -1 },
      pagination: { page, limit },
    });

    res
      .status(200)
      .json(handleResponse(200, 'Selected leagues fetched successfully', selectedLeagues));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a single selected league by ID
export const getSelectedLeagueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const selectedLeague = await dbActions.read(SelectedLeagues, {
      query: { _id: req.params.id },
    });
    if (!selectedLeague) {
      return res.status(404).json(handleResponse(404, 'Selected league not found'));
    }
    res
      .status(200)
      .json(handleResponse(200, 'Selected league fetched successfully', selectedLeague));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update a selected league by ID
export const updateSelectedLeague = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const selectedLeagueData = selectedLeaguesSchema.parse(req.body);

    const updatedSelectedLeague = await dbActions.update(SelectedLeagues, {
      query: { _id: req.params.id },
      update: selectedLeagueData,
    });
    if (!updatedSelectedLeague) {
      return res.status(404).json(handleResponse(404, 'Selected league not found'));
    }
    res
      .status(200)
      .json(handleResponse(200, 'Selected league updated successfully', updatedSelectedLeague));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a selected league by ID
export const deleteSelectedLeague = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedSelectedLeague = await dbActions.delete(SelectedLeagues, {
      query: { id: req.params.id },
    });
    if (!deletedSelectedLeague) {
      return res.status(404).json(handleResponse(404, 'Selected league not found'));
    }
    res.status(200).json(handleResponse(200, 'Selected league deleted successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sortByPosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { leagues } = req.body;

    if (!leagues || leagues.length === 0) {
      return res.status(400).json(handleResponse(400, 'Request body is empty or invalid'));
    }

    await Promise.all(
      leagues.map(async (league: { id: string; position: number }) => {
        const sortedLeagues = await SelectedLeagues.findByIdAndUpdate(league.id, {
          position: league.position,
        });
        return sortedLeagues;
      })
    );

    return res.status(200).json(handleResponse(200, 'Leagues sorted successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const searchLeagues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search_query = req.query.q as string;

    if (!search_query) {
      return res.status(400).json(handleResponse(400, 'Search query is required', null));
    }

    console.log('Searching for leagues with query:', search_query);

    const { data } = await monksFootballUrl.get(
      `/leagues/search/${encodeURIComponent(search_query)}`
    );

    console.log('Received data from sports API:', data);
    const filtered =
      data.length > 0
        ? data.map((d: any) => ({ id: d.id, name: d.name, logo: d.image_path }))
        : data;

    res.status(200).json(handleResponse(200, 'League search results', filtered));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
