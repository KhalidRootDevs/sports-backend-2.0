import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMatch extends Document {
  id: number;
  fixture_id?: number;
  match_title: string;
  match_time: number;
  time: string;
  is_hot?: boolean;
  status: boolean;
  team_one_name: string;
  team_two_name: string;
  team_one_image?: string;
  team_two_image?: string;
  team_one_id?: number;
  team_two_id?: number;
  position?: number;
  streaming_sources?: mongoose.Types.ObjectId[];
}

const matchSchema = new Schema<IMatch>(
  {
    id: {
      type: Number,
      required: [true, 'id is required'],
      unique: true,
      index: true,
    },
    fixture_id: {
      type: Number,
      index: true,
    },
    match_title: {
      type: String,
      required: [true, 'match_title is required'],
      trim: true,
      index: true,
    },
    match_time: {
      type: Number,
      required: [true, 'match_time is required'],
    },
    time: {
      type: String,
      required: [true, 'time is required'],
    },
    is_hot: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    team_one_name: {
      type: String,
      required: [true, 'team_one_name is required'],
      trim: true,
      index: true,
    },
    team_two_name: {
      type: String,
      required: [true, 'team_two_name is required'],
      trim: true,
      index: true,
    },
    team_one_image: {
      type: String,
      trim: true,
    },
    team_two_image: {
      type: String,
      trim: true,
    },
    team_one_id: {
      type: Number,
      index: true,
    },
    team_two_id: {
      type: Number,
      index: true,
    },
    position: {
      type: Number,
      default: 999999999,
      index: true,
    },
    streaming_sources: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stream',
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ status: 1, position: 1 });
matchSchema.index({ is_hot: -1, position: 1 });
matchSchema.index({ status: 1, is_hot: 1, position: 1 });
matchSchema.index({ team_one_name: 1, team_two_name: 1 });
matchSchema.index({ match_title: 'text' });

const LiveMatch = mongoose.model<IMatch>('LiveMatch', matchSchema);

export default LiveMatch;
