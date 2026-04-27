import mongoose, { Document, Schema } from "mongoose";

export interface NewsDocument extends Document {
  title?: string;
  category?: string;
  source_name?: string;
  news?: string;
  league_id?: number;
  league_image?: string;
  slug?: string;
  url?: string;
  image?: string;
  description?: string;
  publish_date?: string;
  status?: string;
}

const newsSchema = new Schema<NewsDocument>(
  {
    title: { type: String },
    category: { type: String },
    source_name: { type: String },
    news: { type: String },
    league_id: { type: Number },
    league_image: { type: String },
    slug: { type: String, unique: true },
    url: { type: String },
    image: { type: String },
    description: { type: String },
    publish_date: { type: String },
    status: { type: String, default: "1" }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const News = mongoose.model<NewsDocument>("News", newsSchema);

export default News;
