import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions";
import { handleResponse } from "../../utils/helper";
import GeneralSettings from "./model";
import { generalSettingsSchema, GeneralSettingsType } from "./validator";

// Create or Update GeneralSettings
export const createOrUpdateGeneralSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate and parse the request body
    const settingsData: GeneralSettingsType = generalSettingsSchema.parse(req.body);

    // Upsert the settings (create if not exists, update if exists)
    const updatedSettings = await dbActions.update(GeneralSettings, {
      query: {},
      update: settingsData
    });

    if (!updatedSettings) {
      // If no settings exist, create new
      const newSettings = await dbActions.create(GeneralSettings, settingsData);
      return res.status(201).json(handleResponse(201, "General settings created successfully", newSettings));
    }

    res.status(200).json(handleResponse(200, "General settings updated successfully", updatedSettings));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get GeneralSettings
export const getGeneralSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await dbActions.read(GeneralSettings, { query: {} });

    if (!settings) {
      return res.status(404).json(handleResponse(404, "General settings not found"));
    }

    res.status(200).json(handleResponse(200, "General settings fetched successfully", settings));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Reset (Delete) GeneralSettings
export const resetGeneralSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete all GeneralSettings documents
    await dbActions.deleteMany(GeneralSettings, { query: {} });

    res.status(200).json(handleResponse(200, "General settings reset successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
