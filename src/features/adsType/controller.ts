import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions";
import { handleResponse } from "../../utils/helper";
import AdsType from "./model";
import { adsTypeSchema } from "./validator";

// Create a new AdsType
export const createAdsType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adsTypeData = adsTypeSchema.parse(req.body);
    const newAdsType = await dbActions.create(AdsType, adsTypeData);
    res.status(201).json(handleResponse(201, "AdsType created successfully", newAdsType));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all AdsTypes
export const getAllAdsTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adsTypes = await dbActions.readAll(AdsType, {
      query: {},
      sort: { position: 1 },
      pagination: {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      }
    });
    res.status(200).json(handleResponse(200, "AdsTypes fetched successfully", adsTypes));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a single AdsType by ID
export const getAdsType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adsTypeId = req.params.id;
    const adsType = await dbActions.read(AdsType, { query: { _id: adsTypeId } });
    if (!adsType) {
      return res.status(404).json(handleResponse(404, "AdsType not found"));
    }
    res.status(200).json(handleResponse(200, "AdsType fetched successfully", adsType));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update an AdsType by ID
export const updateAdsType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adsTypeData = adsTypeSchema.parse(req.body);
    const adsTypeId = req.params.id;
    if (!adsTypeId) {
      return res.status(400).json(handleResponse(400, "AdsType ID is required"));
    }
    const updatedAdsType = await dbActions.update(AdsType, {
      query: { _id: adsTypeId },
      update: adsTypeData
    });
    if (!updatedAdsType) {
      return res.status(404).json(handleResponse(404, "AdsType not found"));
    }
    res.status(200).json(handleResponse(200, "AdsType updated successfully", updatedAdsType));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete an AdsType by ID
export const deleteAdsType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adsTypeId = req.params.id;
    const deletedAdsType = await dbActions.delete(AdsType, { query: { _id: adsTypeId } });
    if (!deletedAdsType) {
      return res.status(404).json(handleResponse(404, "AdsType not found"));
    }
    res.status(200).json(handleResponse(200, "AdsType deleted successfully", deletedAdsType));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
