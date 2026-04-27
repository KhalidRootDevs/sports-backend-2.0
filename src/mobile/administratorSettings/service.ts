import AppSettings from "../../features/appSettings/model";
import { defaultAppSettings } from "../../features/appSettings/defaultAppSettings";

export const getAdministratorSettingsForMobileService = async (platform: "android" | "ios") => {
  let settings = await AppSettings.findOne().lean();

  if (!settings) {
    await AppSettings.create(defaultAppSettings);
    settings = await AppSettings.findOne().lean();
  }

  if (!settings) return null;

  const platformSettings = platform === "ios" ? settings.iosSettings : settings.androidSettings;

  return {
    name: settings.name,
    uniqueId: settings.uniqueId,
    status: settings.status,
    logo: settings.logo,
    socialMedia: settings.socialMedia,
    notificationSettings: settings.notificationSettings?.[platform],
    platformSettings
  };
};
