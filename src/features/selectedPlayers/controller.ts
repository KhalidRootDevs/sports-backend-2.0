import { Request, Response, NextFunction } from "express";
import { selectedPlayerSchema } from "./validator";
import { handleResponse } from "../../utils/helper";
import { dbActions } from "../../db/dbActions";
import SelectedPlayer from "./model";
import { fetchFootballData } from "../sportsMonk/services";

const CREATE_ALLOWED = new Set([
  "id",
  "name",
  "logo",
  "team_logo",
  "nationality_logo",
  "player_position",
  "status",
  "newsUrl",
  "channelId",
  "position"
]);

export const createPlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playerData = selectedPlayerSchema.parse(req.body);
    if (Object.keys(playerData).length === 0 || !Object.keys(playerData).every((key) => CREATE_ALLOWED.has(key))) {
      return res.status(400).json(handleResponse(400, "Bad Request"));
    }

    const isExist = await dbActions.read(SelectedPlayer, {
      query: { id: playerData.id }
    });
    if (isExist) {
      return res.status(400).json(handleResponse(400, "Player with the same ID already exists"));
    }

    const player = await dbActions.create(SelectedPlayer, playerData);
    if (!player) {
      return res.status(503).json(handleResponse(503, "Failed to create player"));
    }
    return res.status(201).json(handleResponse(201, "Team created successfully", player));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAllPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const players = await dbActions.readAll(SelectedPlayer, {
      sort: { position: 1 }
    });
    return res.status(200).json(handleResponse(200, "Selected Players fetched successfully", players));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || id.trim().length === 0 || id === ":id") {
      return res.status(400).json(handleResponse(400, "Invalid ID"));
    }
    const player = await dbActions.read(SelectedPlayer, {
      query: { id: parseInt(id) }
    });
    if (!player) {
      return res.status(404).json(handleResponse(404, "Player not found"));
    }
    return res.status(200).json(handleResponse(200, "Player fetched successfully", player));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updatePlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || id.trim().length === 0 || id === ":id") {
      return res.status(400).json(handleResponse(400, "Invalid ID"));
    }
    const playerData = selectedPlayerSchema.parse(req.body);
    if (Object.keys(playerData).length === 0 || !Object.keys(playerData).every((key) => CREATE_ALLOWED.has(key))) {
      return res.status(400).json(handleResponse(400, "Bad Request"));
    }
    const isExist = await dbActions.read(SelectedPlayer, {
      query: { id: parseInt(id) }
    });
    if (!isExist) {
      return res.status(404).json(handleResponse(404, "Player not found"));
    }
    const updatedPlayer = await dbActions.update(SelectedPlayer, {
      query: { id: parseInt(id) },
      update: playerData
    });
    return res.status(200).json(handleResponse(200, "Player updated successfully", updatedPlayer));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deletePlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || id.trim().length === 0 || id === ":id") {
      return res.status(400).json(handleResponse(400, "Invalid ID"));
    }
    const isExist = await dbActions.read(SelectedPlayer, {
      query: { id: parseInt(id) }
    });
    if (!isExist) {
      return res.status(404).json(handleResponse(404, "Player not found"));
    }
    await dbActions.delete(SelectedPlayer, {
      query: { id: parseInt(id) }
    });
    return res.status(200).json(handleResponse(200, "Player deleted successfully"));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const sortPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const players = req.body;
    if (Object.keys(players).length === 0) {
      return res.status(400).json(handleResponse(400, "Body is Empty"));
    }
    await Promise.all(
      players.map((t: any) => {
        dbActions.update(SelectedPlayer, {
          query: { id: t.id },
          update: { position: t.position }
        });
      })
    );
    return res.status(200).json(handleResponse(200, "Players sorted successfully"));
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const searchPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search_query = req.query.q as string;

    if (!search_query) {
      return res.status(400).json(handleResponse(400, "Search query is required", null));
    }

    const { data } = await fetchFootballData(`/players/search/${encodeURIComponent(search_query)}`);

    const filtered = data.length > 0 ? data.map((d: any) => ({ id: d.id, name: d.name, logo: d.image_path })) : data;

    res.status(200).json(handleResponse(200, "Player search results", filtered));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
