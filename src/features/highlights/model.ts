import mongoose, { Document, Schema } from "mongoose";

export interface IHighlight extends Document {
  title: string;
  category: string;
  league_id?: number;
  league_image?: string;
  date: string;
  short_description?: string;
  video_type: string;
  youtube_url?: string;
  thumbnail_type?: string;
  highlight_image?: string;
  fixture_id?: string;
  videos?: string[];
  status?: string;
}

const highlightSchema = new Schema<IHighlight>(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    league_id: {
      type: Number
    },
    league_image: {
      type: String
    },
    date: {
      type: String,
      required: true
    },
    short_description: {
      type: String
    },
    video_type: {
      type: String,
      required: true
    },
    youtube_url: {
      type: String
    },
    thumbnail_type: {
      type: String
    },
    highlight_image: {
      type: String
    },
    fixture_id: {
      type: String,
      trim: true
    },
    videos: {
      type: [String]
    },
    status: {
      type: String,
      default: "1"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create the model for Highlight
const Highlight = mongoose.model<IHighlight>("Highlight", highlightSchema);

export default Highlight;
