import { prop, modelOptions, pre, getModelForClass, DocumentType, Severity } from '@typegoose/typegoose';
import crypto from 'crypto';
import { env } from '@/lib/config/env.config';
import bcrypt from 'bcryptjs';
import { schemaOptions } from '@/lib/models/utils.model';
import mongoose from 'mongoose';

export enum UserRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

@modelOptions(schemaOptions)

@pre<User>('save', async function (next) {
  if (this.isNew) {
    await this.setPassword(crypto.randomBytes(12).toString('hex'));
  } else if (this.isModified('password')) {
    await this.setPassword(this.password);
  }
  next();
})

export class User {
  @prop({ trim: true })
  public name?: string;

  @prop({ 
    required: [true, 'Email is required'],
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  })
  public email!: string;

  @prop({ 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  })
  public password!: string;

  @prop()
  public avatar?: string;

  @prop()
  public socialAuthId?: string;

  @prop({ 
    type: String, 
    enum: UserRole, 
    required: true, 
    default: UserRole.USER 
  })
  public roles!: UserRole[];

  public async setPassword(this: DocumentType<User>, password: string) {
    this.password = await bcrypt.hash(password, env.SALT);
  }
}

export const UserModel =
  mongoose.models.User || getModelForClass(User, { existingMongoose: mongoose });
