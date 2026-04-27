import mongoose, { Document, Schema } from "mongoose";

export interface NotificationDocument extends Document {
  id: number;
  title: string;
  body: string;
  image?: string;
  notification_type?: string;
  action_url?: string;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String },
    notification_type: { type: String, default: "in_app" },
    action_url: { type: String }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model<NotificationDocument>("Notification", notificationSchema);

export default Notification;
