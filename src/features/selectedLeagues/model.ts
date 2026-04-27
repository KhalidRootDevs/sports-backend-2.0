import mongoose, { Document, Schema } from 'mongoose';

export interface SelectedLeaguesDocument extends Document {
  id: number;
  seasonId?: number;
  name: string;
  logo: string;
  status?: string;
  position?: number;
}

const selectedLeaguesSchema = new Schema<SelectedLeaguesDocument>({
  id: { type: Number, required: true, unique: true },
  seasonId: { type: Number },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  status: { type: String, default: '1' },
  position: { type: Number, default: 9999999 },
});

const SelectedLeagues = mongoose.model<SelectedLeaguesDocument>(
  'SelectedLeagues',
  selectedLeaguesSchema
);

export default SelectedLeagues;
