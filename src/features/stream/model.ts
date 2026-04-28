import mongoose, { Document, Schema } from "mongoose";

export type Platform = "both" | "android" | "ios";
export type StreamType = "root_stream" | "restricted" | "m3u8" | "web";

export interface IHeader {
  key: string;
  value: string;
}

export interface IRootStream {
  root_stream_type: string;
  root_stream_status: string | number;
  root_stream_stream_url: string;
  root_stream_stream_key: string;
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
  root_streams?: IRootStream[];
  stream_url?: string;
  headers?: IHeader[];
  stream_key?: string;
  position?: number;
}

const streamSchema = new Schema<IStream>(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "LiveMatch",
      required: [true, "matchId is required"],
      index: true
    },

    id: {
      type: Number,
      required: [true, "id is required"],
      unique: true,
      index: true
    },

    match_id: {
      type: Number,
      index: true
    },

    stream_title: {
      type: String,
      required: [true, "stream_title is required"],
      trim: true
    },

    is_premium: {
      type: Boolean,
      default: false
    },

    resolution: {
      type: String,
      required: [true, "resolution is required"],
      trim: true
    },

    stream_status: {
      type: Boolean,
      default: true
    },

    platform: {
      type: String,
      enum: ["both", "android", "ios"],
      default: "both"
    },

    stream_type: {
      type: String,
      enum: ["root_stream", "restricted", "m3u8", "web"],
      default: "root_stream"
    },

    portrait_watermark: {
      type: String,
      default: "{}"
    },

    landscape_watermark: {
      type: String,
      default: "{}"
    },

    root_streams: {
      type: [
        {
          root_stream_type: { type: String },
          root_stream_status: { type: Schema.Types.Mixed },
          root_stream_stream_url: { type: String },
          root_stream_stream_key: { type: String }
        }
      ],
      default: []
    },

    stream_url: {
      type: String,
      trim: true
    },

    headers: {
      type: [
        {
          key: { type: String },
          value: { type: String }
        }
      ],
      default: []
    },

    stream_key: {
      type: String,
      trim: true
    },

    position: {
      type: Number,
      default: 1,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for common queries
streamSchema.index({ matchId: 1, position: 1 });
streamSchema.index({ matchId: 1, is_premium: 1 });
streamSchema.index({ matchId: 1, stream_status: 1 });
streamSchema.index({ match_id: 1, position: 1 });
streamSchema.index({ platform: 1, stream_type: 1 });

const Stream = mongoose.model<IStream>("Stream", streamSchema);

export default Stream;
