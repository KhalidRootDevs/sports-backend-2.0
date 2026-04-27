import { NextFunction, Request, Response } from "express";
import { dbActions } from "../../db/dbActions";
import { querySchema } from "../../types";
import { handleResponse } from "../../utils/helper";
import ContactUs from "./model";
import { contactUsSchema } from "./validator";

export const createContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contactData = contactUsSchema.parse(req.body);

    const newContactUs = await dbActions.create(ContactUs, contactData);

    res.status(201).json(handleResponse(201, "Contact Us entry created successfully", newContactUs));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const query: any = {};

    if (search) {
      query.email = new RegExp(search, "i");
    }

    const contacts = await dbActions.readAll(ContactUs, {
      query,
      sort: { createdAt: -1 },
      pagination: { page, limit }
    });

    res.status(200).json(handleResponse(200, "Contact Us entries fetched", contacts));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOneContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const contact = await dbActions.read(ContactUs, { query: { _id: id } });

    if (!contact) {
      return res.status(404).json(handleResponse(404, "Contact Us entry not found"));
    }

    res.status(200).json(handleResponse(200, "Contact Us entry fetched", contact));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteContactUs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedContact = await dbActions.delete(ContactUs, { query: { _id: id } });

    if (!deletedContact) {
      return res.status(404).json(handleResponse(404, "Contact Us entry not found"));
    }

    res.status(200).json(handleResponse(200, "Contact Us entry deleted successfully"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
