import ContactUs from "../../features/contactUs/model";
import { ContactUsInput } from "../../features/contactUs/validator";

export const createContactUsForMobileService = async (data: ContactUsInput) => {
  return ContactUs.create(data);
};
