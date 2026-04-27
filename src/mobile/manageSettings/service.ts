import GeneralSettings from "../../features/generalSettings/model";

export const getManageSettingsForMobileService = async () => {
  return GeneralSettings.findOne(
    {},
    {
      _id: 0,
      company_name: 1,
      site_title: 1,
      terms: 1,
      policy: 1,
      contact_us: 1,
      facebook: 1,
      youtube: 1,
      instagram: 1,
      site_logo: 1,
      site_icon: 1
    }
  ).lean();
};
