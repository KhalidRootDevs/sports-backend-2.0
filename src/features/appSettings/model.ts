import mongoose, { Document, Schema } from "mongoose";
import { defaultAppSettings } from "./defaultAppSettings";

interface NotificationSettings {
  android: {
    type?: string;
    onesignalAppId?: string;
    onesignalApiKey?: string;
    firebaseServerKey?: string;
    firebaseTopics?: string;
  };
  ios: {
    type?: string;
    onesignalAppId?: string;
    onesignalApiKey?: string;
    firebaseServerKey?: string;
    firebaseTopics?: string;
  };
}

interface ApiSettings {
  sport: {
    baseUrl?: string;
    apiKey?: string;
  };
}

interface EmailSettings {
  supportEmail?: string;
  fromEmail?: string;
  fromName?: string;
  smtp?: {
    host?: string;
    port?: string;
    username?: string;
    password?: string;
    encryption?: string;
  };
}

interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  telegram?: string;
  youtube?: string;
}

interface AndroidSettings {
  privacyPolicy?: string;
  termsConditions?: string;
  appShareLink?: string;
  defaultPage?: string;
  appPublishingControl?: string;
  liveVersionCode?: string;
  adType?: string;
  adSwitch?: string;
  multipleAd?: string;
  othersAdType?: Record<string, any>[];
  appAds?: Record<string, any>[];
  clickControl?: string;
  adStatus?: string;
  versionName?: string;
  versionCode?: string;
  forceUpdate?: string;
  updateFor?: string;
  appUrl?: string;
  buttonText?: string;
  description?: string;
  requiredApp?: {
    enable?: string;
    applicationId?: string;
    url?: string;
    name?: string;
    description?: string;
  };
  promo?: {
    button?: string;
    text?: string;
    link?: string;
    status?: string;
  };
  adSettings?: Record<string, any>;
}

interface IosSettings {
  privacyPolicy?: string;
  termsConditions?: string;
  appShareLink?: string;
  appRatingLink?: string;
  defaultPage?: string;
  appPublishingControl?: string;
  liveVersionCode?: string;
  adType?: string;
  appAds?: Record<string, any>[];
  multipleAd?: string;
  othersAdType?: Record<string, any>[];
  adSwitch?: string;
  clickControl?: string;
  adStatus?: string;
  versionName?: string;
  versionCode?: string;
  forceUpdate?: string;
  updateFor?: string;
  appUrl?: string;
  buttonText?: string;
  description?: string;
  requiredApp?: {
    enable?: string;
    applicationId?: string;
    url?: string;
    name?: string;
    description?: string;
  };
  promo?: {
    button?: string;
    text?: string;
    link?: string;
    status?: string;
  };
  adSettings?: Record<string, any>;
}

interface IAppSettings extends Document {
  name: string;
  uniqueId: string;
  status?: string;
  logo?: string;
  notificationSettings?: NotificationSettings;
  apiSettings?: ApiSettings;
  emailSettings?: EmailSettings;
  socialMedia?: SocialMediaLinks;
  androidSettings?: AndroidSettings;
  iosSettings?: IosSettings;
  ip?: string;
}

// Schema definition
const appSettingsSchema = new Schema<IAppSettings>(
  {
    name: { type: String, required: true, unique: true },
    uniqueId: { type: String, required: true, unique: true },
    status: { type: String, default: "1" },
    logo: { type: String, default: "" },
    notificationSettings: {
      android: {
        type: { type: String },
        onesignalAppId: { type: String },
        onesignalApiKey: { type: String },
        firebaseServerKey: { type: String },
        firebaseTopics: { type: String }
      },
      ios: {
        type: { type: String },
        onesignalAppId: { type: String },
        onesignalApiKey: { type: String },
        firebaseServerKey: { type: String },
        firebaseTopics: { type: String }
      }
    },
    apiSettings: {
      sport: {
        baseUrl: { type: String },
        apiKey: { type: String }
      }
    },
    emailSettings: {
      supportEmail: { type: String },
      fromEmail: { type: String },
      fromName: { type: String },
      smtp: {
        host: { type: String },
        port: { type: String },
        username: { type: String },
        password: { type: String },
        encryption: { type: String }
      }
    },
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      telegram: { type: String },
      youtube: { type: String }
    },
    androidSettings: {
      privacyPolicy: { type: String },
      termsConditions: { type: String },
      appShareLink: { type: String },
      defaultPage: { type: String },
      appPublishingControl: { type: String },
      liveVersionCode: { type: String },
      adType: { type: String },
      adSwitch: { type: String },
      multipleAd: { type: String },
      othersAdType: [{ type: Schema.Types.Mixed }],
      appAds: [{ type: Schema.Types.Mixed }],
      clickControl: { type: String },
      adStatus: { type: String },
      versionName: { type: String },
      versionCode: { type: String },
      forceUpdate: { type: String, default: "no" },
      updateFor: { type: String, default: "in" },
      appUrl: { type: String },
      buttonText: { type: String },
      description: { type: String },
      requiredApp: {
        enable: { type: String, default: "no" },
        applicationId: { type: String },
        url: { type: String },
        name: { type: String },
        description: { type: String }
      },
      promo: {
        button: { type: String },
        text: { type: String },
        link: { type: String },
        status: { type: String }
      },
      adSettings: { type: Schema.Types.Mixed }
    },
    iosSettings: {
      privacyPolicy: { type: String },
      termsConditions: { type: String },
      appShareLink: { type: String },
      appRatingLink: { type: String },
      defaultPage: { type: String },
      appPublishingControl: { type: String },
      liveVersionCode: { type: String },
      adType: { type: String },
      appAds: [{ type: Schema.Types.Mixed }],
      multipleAd: { type: String },
      othersAdType: [{ type: Schema.Types.Mixed }],
      adSwitch: { type: String },
      clickControl: { type: String },
      adStatus: { type: String },
      versionName: { type: String },
      versionCode: { type: String },
      forceUpdate: { type: String, default: "no" },
      updateFor: { type: String, default: "in" },
      appUrl: { type: String },
      buttonText: { type: String },
      description: { type: String },
      requiredApp: {
        enable: { type: String, default: "no" },
        applicationId: { type: String },
        url: { type: String },
        name: { type: String },
        description: { type: String }
      },
      promo: {
        button: { type: String },
        text: { type: String },
        link: { type: String },
        status: { type: String }
      },
      adSettings: { type: Schema.Types.Mixed }
    },
    ip: { type: String }
  },
  {
    timestamps: true
  }
);

appSettingsSchema.pre("save", async function (next) {
  const appSettings = this as any;

  if (!appSettings.isNew) {
    return next();
  }

  if (!appSettings.name) {
    Object.assign(appSettings, defaultAppSettings);
  }

  next();
});

const AppSettings = mongoose.model<IAppSettings>("AppSettings", appSettingsSchema);

export default AppSettings;
