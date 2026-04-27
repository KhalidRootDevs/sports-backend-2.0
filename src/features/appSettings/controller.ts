import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions";
import { handleResponse } from "../../utils/helper";
import { defaultAppSettings } from "./defaultAppSettings";
import AppSettings from "./model";
import { appSettingsSchema } from "./validator";

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await dbActions.read(AppSettings, {});
    if (!settings) {
      // Create default settings if not found
      const defaultSettings = new AppSettings();
      await dbActions.create(AppSettings, defaultAppSettings);

      return res.status(200).json(handleResponse(200, "App settings fetched", defaultSettings));
    }
    res.status(200).json(handleResponse(200, "App settings fetched", settings));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settingsData = appSettingsSchema.parse(req.body);
    // Upsert settings
    const existingSettings = await dbActions.read(AppSettings, {});
    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await dbActions.update(AppSettings, {
        query: { _id: existingSettings._id },
        update: settingsData
      });
      return res.status(200).json(handleResponse(200, "Settings updated", updatedSettings));
    } else {
      // Create new settings
      const newSettings = await dbActions.create(AppSettings, settingsData);
      return res.status(201).json(handleResponse(201, "Settings created", newSettings));
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resetSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbActions.delete(AppSettings, { query: {} });
    res.status(200).json(handleResponse(200, "Settings reset successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
