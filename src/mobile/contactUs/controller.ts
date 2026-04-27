import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../utils/helper";
import { contactUsSchema } from "../../features/contactUs/validator";
import { createContactUsForMobileService } from "./service";

export const createContactUsForMobile = async (req: Request, res: Response, next: NextFunction) => {
  const data = contactUsSchema.parse(req.body);
  await createContactUsForMobileService(data);
  res.status(201).json(handleResponse(201, "Message sent successfully"));
};
