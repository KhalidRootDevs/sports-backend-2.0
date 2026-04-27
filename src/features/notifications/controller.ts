import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions"; // Adjust the path as necessary
import { querySchema } from "../../types";
import { handleResponse } from "../../utils/helper"; // Adjust the path as necessary
import Notification from "./model";
import { notificationSchema } from "./validator";
import { generateRandomId } from "../../utils";

// Create a new notification
export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notificationPayload = {
      ...req.body,
      id: generateRandomId(11)
    };

    const notificationData = notificationSchema.parse(notificationPayload);

    const notification = await dbActions.create(Notification, notificationData);
    res.status(201).json(handleResponse(201, "Notification created successfully", notification));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all notifications
export const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.title = new RegExp(search, "i");
    }

    const notifications = await dbActions.readAll(Notification, {
      query,
      sort: { createdAt: -1 },
      pagination: { page, limit }
    });

    res.status(200).json(handleResponse(200, "Notifications fetched successfully", notifications));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a single notification by ID
export const getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await dbActions.read(Notification, {
      query: { _id: req.params.id }
    });
    if (!notification) {
      return res.status(404).json(handleResponse(404, "Notification not found"));
    }
    res.status(200).json(handleResponse(200, "Notification fetched successfully", notification));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a notification by ID
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedNotification = await dbActions.delete(Notification, {
      query: { _id: req.params.id }
    });
    if (!deletedNotification) {
      return res.status(404).json(handleResponse(404, "Notification not found"));
    }
    res.status(200).json(handleResponse(200, "Notification deleted successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbActions.deleteMany(Notification, {
      query: {}
    });
    res.status(200).json(handleResponse(200, "All notifications deleted successfully"));
  } catch (err) {
    console.error(err);
    next(err);
  }
};
