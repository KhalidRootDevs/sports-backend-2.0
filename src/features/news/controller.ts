import { NextFunction, Request, Response } from 'express';
import { dbActions } from '../../db/dbActions'; // Adjust the path as necessary
import { querySchema } from '../../types';
import { handleResponse } from '../../utils/helper'; // Adjust the path as necessary
import News from './model';
import { newsSchema } from './validator';

// Create a new news item
export const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newsData = newsSchema.parse(req.body);

    const news = await dbActions.create(News, newsData);
    res.status(201).json(handleResponse(201, 'News item created successfully', news));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all news items
export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.title = new RegExp(search, 'i');
    }

    const newsItems = await dbActions.readAll(News, {
      query,
      sort: { createdAt: -1 },
      pagination: { page, limit },
    });

    res.status(200).json(handleResponse(200, 'News items fetched successfully', newsItems));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a single news item by ID
export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await dbActions.read(News, {
      query: { _id: req.params.id },
    });
    if (!news) {
      return res.status(404).json(handleResponse(404, 'News item not found'));
    }
    res.status(200).json(handleResponse(200, 'News item fetched successfully', news));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a news item by ID
export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedNews = await dbActions.delete(News, {
      query: { _id: req.params.id },
    });
    if (!deletedNews) {
      return res.status(404).json(handleResponse(404, 'News item not found'));
    }
    res.status(200).json(handleResponse(200, 'News item deleted successfully'));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteAllNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbActions.deleteMany(News, {
      query: {},
    });
    res.status(200).json(handleResponse(200, 'All news items deleted successfully'));
  } catch (err) {
    console.error(err);
    next(err);
  }
};
