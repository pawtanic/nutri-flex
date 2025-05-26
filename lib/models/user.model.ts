import mongoose, { Schema, Document, Model } from 'mongoose'

// 🔹 Base interface
export interface IUser {
  name?: string
  email: string
  password: string
  avatar?: string
  authJSId?: string
  roles: 'user' | 'editor' | 'admin'
}

// 🔹 Create & Update interfaces
export interface ICreateUser extends Omit<IUser, 'password'> {
  password: string
}

export interface IUpdateUser extends Partial<IUser> {
  password?: string
}

// 🔹 Mongoose Document type
export interface IUserDoc extends IUser, Document {}

const UserSchema: Schema<IUserDoc> = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // managed by NextAuth or local
    avatar: { type: String }, // could be a URL
    authJSId: { type: String },
    roles: {
      type: String,
      enum: ['user', 'editor', 'admin'],
      default: 'user',
      required: true,
    },
  },
  { timestamps: true }
)

export const User: Model<IUserDoc> = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema)
