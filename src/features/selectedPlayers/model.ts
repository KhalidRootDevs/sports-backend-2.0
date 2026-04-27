import { Schema, model } from "mongoose";

export interface PlayerDocument extends Document {
  id: number;
  name: string;
  logo: string;
  team_logo?: string;
  nationality_logo?: string;
  player_position: string;
  status: string;
  newsUrl?: string;
  channelId: string;
  position: number;
}

const schema = new Schema<PlayerDocument>({
  id: { type: Number, required: true, unique: true },
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  team_logo: { type: String },
  nationality_logo: { type: String },
  player_position: { type: String },
  status: {
    type: String,
    default: "1"
  },
  newsUrl: { type: String },
  channelId: { type: String },
  position: { type: Number, default: 9999999 }
});

const SelectedPlayer = model<PlayerDocument>("SelectedPlayer", schema, "selected-players");

export default SelectedPlayer;
