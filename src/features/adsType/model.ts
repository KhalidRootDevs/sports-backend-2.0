import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdsType extends Document {
  name: string;
  id: number;
  status: string;
  position: number;
}

const adsTypeSchema: Schema<IAdsType> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    id: {
      type: Number,
      required: true,
      unique: true
    },
    status: {
      type: String,
      default: "1"
    },
    position: {
      type: Number,
      default: 999999999
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create the model
const AdsType: Model<IAdsType> = mongoose.model<IAdsType>("AdsType", adsTypeSchema);

export default AdsType;
