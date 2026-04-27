import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions";
import { querySchema } from "../../types";
import { handleResponse } from "../../utils/helper";
import Highlight from "./model";
import { highlightSchema } from "./validator";

// Create a new highlight
export const createHighlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const highlightData = highlightSchema.parse(req.body);

    const highlight = await dbActions.create(Highlight, highlightData);
    res.status(201).json(handleResponse(201, "Highlight created successfully", highlight));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all highlights
export const getAllHighlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.title = new RegExp(search, "i");
    }

    const highlights = await dbActions.readAll(Highlight, {
      query,
      sort: { createdAt: -1 },
      pagination: { page, limit }
    });
    res.status(200).json(handleResponse(200, "Highlights fetched successfully", highlights));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a single highlight by ID
export const getHighlightById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const highlight = await dbActions.read(Highlight, {
      query: { _id: req.params.id }
    });
    if (!highlight) {
      return res.status(404).json(handleResponse(404, "Highlight not found"));
    }
    res.status(200).json(handleResponse(200, "Highlight fetched successfully", highlight));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update a highlight by ID
export const updateHighlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const highlightData = highlightSchema.parse(req.body);

    const updatedHighlight = await dbActions.update(Highlight, {
      query: { _id: req.params.id },
      update: highlightData
    });
    if (!updatedHighlight) {
      return res.status(404).json(handleResponse(404, "Highlight not found"));
    }
    res.status(200).json(handleResponse(200, "Highlight updated successfully", updatedHighlight));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a highlight by ID
export const deleteHighlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedHighlight = await dbActions.delete(Highlight, {
      query: { _id: req.params.id }
    });
    if (!deletedHighlight) {
      return res.status(404).json(handleResponse(404, "Highlight not found"));
    }
    res.status(200).json(handleResponse(200, "Highlight deleted successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteAllHighlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbActions.deleteMany(Highlight, {
      query: {}
    });
    res.status(200).json(handleResponse(200, "All highlights items deleted successfully"));
  } catch (err) {
    console.error(err);
    next(err);
  }
};
