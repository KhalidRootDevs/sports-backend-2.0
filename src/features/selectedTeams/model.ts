import { Schema, model } from 'mongoose';

export interface TeamDocument extends Document {
  id: number;
  name: string;
  logo: string;
  seasonId: number;
  status: string;
  newsUrl?: string;
  channelId: string;
  position: number;
}

const schema = new Schema<TeamDocument>({
  id: { type: Number, required: true, unique: true },
  seasonId: { type: Number },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: '1',
  },
  newsUrl: { type: String },
  channelId: { type: String },
  position: { type: Number, default: 9999999 },
});

const SelectedTeam = model<TeamDocument>('SelectedTeam', schema, 'selected-teams');

export default SelectedTeam;
