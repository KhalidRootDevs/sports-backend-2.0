import { z } from "zod";

// Schema for app settings validation
export const appSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  uniqueId: z.string().min(1, "Unique ID is required").trim(),
  status: z.string().default("1"),
  logo: z.string().default(""),

  notificationSettings: z
    .object({
      android: z
        .object({
          type: z.string().optional(),
          onesignalAppId: z.string().optional(),
          onesignalApiKey: z.string().optional(),
          firebaseServerKey: z.string().optional(),
          firebaseTopics: z.string().optional()
        })
        .optional(),
      ios: z
        .object({
          type: z.string().optional(),
          onesignalAppId: z.string().optional(),
          onesignalApiKey: z.string().optional(),
          firebaseServerKey: z.string().optional(),
          firebaseTopics: z.string().optional()
        })
        .optional()
    })
    .optional(),

  apiSettings: z
    .object({
      sport: z
        .object({
          baseUrl: z.string().optional(),
          apiKey: z.string().optional()
        })
        .optional()
    })
    .optional(),

  emailSettings: z
    .object({
      supportEmail: z.string().optional(),
      fromEmail: z.string().optional(),
      fromName: z.string().optional(),
      smtp: z
        .object({
          host: z.string().optional(),
          port: z.string().optional(),
          username: z.string().optional(),
          password: z.string().optional(),
          encryption: z.string().optional()
        })
        .optional()
    })
    .optional(),

  socialMedia: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      telegram: z.string().optional(),
      youtube: z.string().optional()
    })
    .optional(),

  androidSettings: z
    .object({
      privacyPolicy: z.string().optional(),
      termsConditions: z.string().optional(),
      appShareLink: z.string().optional(),
      defaultPage: z.string().optional(),
      appPublishingControl: z.string().optional(),
      liveVersionCode: z.string().optional(),
      adType: z.string().optional(),
      adSwitch: z.string().optional(),
      multipleAd: z.string().optional(),
      othersAdType: z
        .array(
          z.object({
            type: z.string().optional(),
            onesignalAppId: z.string().optional(),
            onesignalApiKey: z.string().optional(),
            firebaseServerKey: z.string().optional(),
            firebaseTopics: z.string().optional()
          })
        )
        .optional(),
      appAds: z
        .array(
          z.object({
            type: z.string().optional(),
            onesignalAppId: z.string().optional(),
            onesignalApiKey: z.string().optional(),
            firebaseServerKey: z.string().optional(),
            firebaseTopics: z.string().optional()
          })
        )
        .optional(),
      clickControl: z.string().optional(),
      adStatus: z.string().optional(),
      versionName: z.string().optional(),
      versionCode: z.string().optional(),
      forceUpdate: z.string().default("no"),
      updateFor: z.string().default("in"),
      appUrl: z.string().optional(),
      buttonText: z.string().optional(),
      description: z.string().optional(),
      requiredApp: z
        .object({
          enable: z.string().default("no"),
          applicationId: z.string().optional(),
          url: z.string().optional(),
          name: z.string().optional(),
          description: z.string().optional()
        })
        .optional(),
      promo: z
        .object({
          button: z.string().optional(),
          text: z.string().optional(),
          link: z.string().optional(),
          status: z.string().optional()
        })
        .optional(),
      adSettings: z
        .object({
          type: z.string().optional(),
          onesignalAppId: z.string().optional(),
          onesignalApiKey: z.string().optional(),
          firebaseServerKey: z.string().optional(),
          firebaseTopics: z.string().optional()
        })
        .optional()
    })
    .optional(),

  iosSettings: z
    .object({
      privacyPolicy: z.string().optional(),
      termsConditions: z.string().optional(),
      appShareLink: z.string().optional(),
      appRatingLink: z.string().optional(),
      defaultPage: z.string().optional(),
      appPublishingControl: z.string().optional(),
      liveVersionCode: z.string().optional(),
      adType: z.string().optional(),
      appAds: z
        .array(
          z.object({
            type: z.string().optional(),
            onesignalAppId: z.string().optional(),
            onesignalApiKey: z.string().optional(),
            firebaseServerKey: z.string().optional(),
            firebaseTopics: z.string().optional()
          })
        )
        .optional(),
      multipleAd: z.string().optional(),
      othersAdType: z
        .array(
          z.object({
            type: z.string().optional(),
            onesignalAppId: z.string().optional(),
            onesignalApiKey: z.string().optional(),
            firebaseServerKey: z.string().optional(),
            firebaseTopics: z.string().optional()
          })
        )
        .optional(),
      adSwitch: z.string().optional(),
      clickControl: z.string().optional(),
      adStatus: z.string().optional(),
      versionName: z.string().optional(),
      versionCode: z.string().optional(),
      forceUpdate: z.string().default("no"),
      updateFor: z.string().default("in"),
      appUrl: z.string().optional(),
      buttonText: z.string().optional(),
      description: z.string().optional(),
      requiredApp: z
        .object({
          enable: z.string().default("no"),
          applicationId: z.string().optional(),
          url: z.string().optional(),
          name: z.string().optional(),
          description: z.string().optional()
        })
        .optional(),
      promo: z
        .object({
          button: z.string().optional(),
          text: z.string().optional(),
          link: z.string().optional(),
          status: z.string().optional()
        })
        .optional(),
      adSettings: z.object({}).optional()
    })
    .optional(),

  ip: z.string().optional()
});
