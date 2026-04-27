import mongoose, { Document, Schema } from 'mongoose';

export type Platform = 'both' | 'android' | 'ios';

export type StreamType = 'root_stream' | 'restricted' | 'm3u8' | 'web';

interface RootStreamItem {
  [key: string]: any;
}

export interface IStream extends Document {
  matchId: mongoose.Types.ObjectId;
  id: number;
  match_id: number;
  stream_title: string;
  is_premium: boolean;
  resolution: string;
  stream_status: boolean;
  platform: Platform;
  stream_type?: StreamType;
  portrait_watermark?: string;
  landscape_watermark?: string;
  root_streams?: RootStreamItem[];
  stream_url?: string;
  headers?: string;
  stream_key?: string;
  position?: number;
}

const streamSchema = new Schema<IStream>(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: 'LiveMatch',
      required: [true, 'matchId is required'],
      index: true,
    },
    id: {
      type: Number,
      required: [true, 'id is required'],
      unique: true,
      index: true,
    },
    match_id: {
      type: Number,
      index: true,
    },
    stream_title: {
      type: String,
      required: [true, 'stream_title is required'],
      trim: true,
    },
    is_premium: {
      type: Boolean,
      default: false,
    },
    resolution: {
      type: String,
      required: [true, 'resolution is required'],
      trim: true,
    },
    stream_status: {
      type: Boolean,
      default: true,
    },
    platform: {
      type: String,
      enum: ['both', 'android', 'ios'],
      default: 'both',
    },
    stream_type: {
      type: String,
      enum: ['root_stream', 'restricted', 'm3u8', 'web'],
      default: 'root_stream',
    },
    portrait_watermark: {
      type: String,
      default: '{}',
    },
    landscape_watermark: {
      type: String,
      default: '{}',
    },
    root_streams: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    stream_url: {
      type: String,
      trim: true,
    },
    headers: {
      type: String,
      trim: true,
    },
    stream_key: {
      type: String,
      trim: true,
    },
    position: {
      type: Number,
      default: 99999999,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
streamSchema.index({ matchId: 1, position: 1 });
streamSchema.index({ matchId: 1, is_premium: 1 });
streamSchema.index({ matchId: 1, stream_status: 1 });
streamSchema.index({ match_id: 1, position: 1 });
streamSchema.index({ platform: 1, stream_type: 1 });

const Stream = mongoose.model<IStream>('Stream', streamSchema);

export default Stream;
