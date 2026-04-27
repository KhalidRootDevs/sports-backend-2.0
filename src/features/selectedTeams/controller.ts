import { Request, Response, NextFunction } from 'express';
import { selectedTeamSchema } from './validator';
import { handleResponse } from '../../utils/helper';
import { dbActions } from '../../db/dbActions';
import SelectedTeam from './model';
import { fetchFootballData } from '../sportsMonk/services';

const CREATE_ALLOWED = new Set([
  'id',
  'name',
  'logo',
  'seasonId',
  'status',
  'newsUrl',
  'channelId',
  'position',
]);

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamData = selectedTeamSchema.parse(req.body);
    if (
      Object.keys(teamData).length === 0 ||
      !Object.keys(teamData).every((key) => CREATE_ALLOWED.has(key))
    ) {
      return res.status(400).json(handleResponse(400, 'Bad Request'));
    }

    const isExist = await dbActions.read(SelectedTeam, {
      query: { id: teamData.id },
    });
    if (isExist) {
      return res.status(400).json(handleResponse(400, 'Team with the same ID already exists'));
    }

    const team = await dbActions.create(SelectedTeam, teamData);
    if (!team) {
      return res.status(503).json(handleResponse(503, 'Failed to create team'));
    }
    return res.status(201).json(handleResponse(201, 'Team created successfully', team));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAllTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await dbActions.readAll(SelectedTeam, {
      sort: { postion: 1 },
    });
    return res.status(200).json(handleResponse(200, 'Selected Teams fetched successfully', teams));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || id.trim().length === 0 || id === ':id') {
      return res.status(400).json(handleResponse(400, 'Invalid ID'));
    }
    const team = await dbActions.read(SelectedTeam, {
      query: { id: parseInt(id) },
    });
    if (!team) {
      return res.status(404).json(handleResponse(404, 'Team not found'));
    }
    return res.status(200).json(handleResponse(200, 'Team fetched successfully', team));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || id.trim().length === 0 || id === ':id') {
      return res.status(400).json(handleResponse(400, 'Invalid ID'));
    }
    const teamData = selectedTeamSchema.parse(req.body);
    if (
      Object.keys(teamData).length === 0 ||
      !Object.keys(teamData).every((key) => CREATE_ALLOWED.has(key))
    ) {
      return res.status(400).json(handleResponse(400, 'Bad Request'));
    }
    const isExist = await dbActions.read(SelectedTeam, {
      query: { id: parseInt(id) },
    });
    if (!isExist) {
      return res.status(404).json(handleResponse(404, 'Team not found'));
    }
    const updatedTeam = await dbActions.update(SelectedTeam, {
      query: { id: parseInt(id) },
      update: teamData,
    });
    return res.status(200).json(handleResponse(200, 'Team updated successfully', updatedTeam));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || id.trim().length === 0 || id === ':id') {
      return res.status(400).json(handleResponse(400, 'Invalid ID'));
    }
    const isExist = await dbActions.read(SelectedTeam, {
      query: { id: parseInt(id) },
    });
    if (!isExist) {
      return res.status(404).json(handleResponse(404, 'Team not found'));
    }
    await dbActions.delete(SelectedTeam, {
      query: { id: parseInt(id) },
    });
    return res.status(200).json(handleResponse(200, 'Team deleted successfully'));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const sortTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = req.body;
    if (Object.keys(teams).length === 0) {
      return res.status(400).json(handleResponse(400, 'Body is Empty'));
    }
    await Promise.all(
      teams.map((t: any) => {
        dbActions.update(SelectedTeam, {
          query: { id: t.id },
          update: { position: t.position },
        });
      })
    );
    return res.status(200).json(handleResponse(200, 'Teams sorted successfully'));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const searchTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search_query = req.query.q as string;

    if (!search_query) {
      return res.status(400).json(handleResponse(400, 'Search query is required', null));
    }

    const { data } = await fetchFootballData(`/teams/search/${encodeURIComponent(search_query)}`);
    const filtered =
      data.length > 0
        ? data.map((d: any) => ({ id: d.id, name: d.name, logo: d.image_path }))
        : data;

    res.status(200).json(handleResponse(200, 'Teams search results', filtered));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
