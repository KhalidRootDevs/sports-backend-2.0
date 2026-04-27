import mongoose, { Document, Schema } from 'mongoose';

interface IGeneralSettings extends Document {
  company_name?: string;
  site_title?: string;
  timezone?: Record<string, any>;
  language?: Record<string, any>;
  terms?: string;
  policy?: string;
  contact_us?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  site_logo?: string;
  site_icon?: string;
}

const generalSettingSchema = new Schema<IGeneralSettings>({
  company_name: { type: String },
  site_title: { type: String },
  timezone: { type: Schema.Types.Mixed },
  language: { type: Schema.Types.Mixed },
  terms: { type: String },
  policy: { type: String },
  contact_us: { type: String },
  facebook: { type: String, default: '' },
  youtube: { type: String, default: '' },
  instagram: { type: String, default: '' },
  site_logo: { type: String, default: '' },
  site_icon: { type: String, default: '' },
});

const GeneralSettings = mongoose.model<IGeneralSettings>('GeneralSettings', generalSettingSchema);

export default GeneralSettings;
