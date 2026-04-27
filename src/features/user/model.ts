import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator"
}

export interface UserPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  role: UserRole;
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    permissions: {
      canRead: { type: Boolean, default: true },
      canWrite: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
