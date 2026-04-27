import mongoose, { Document, Schema } from "mongoose";

interface IContactUs extends Document {
  email: string;
  name: string;
  subject: string;
  message: string;
}

const contactUsSchema = new Schema<IContactUs>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create the model for ContactUs
const ContactUs = mongoose.model<IContactUs>("ContactUs", contactUsSchema);

export default ContactUs;
