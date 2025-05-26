import mongoose from 'mongoose';
import { env } from '@/lib/config/env.config';

const MONGODB_URI: string = env.DATABASE_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Cached connection for MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
        console.log("Connected to MongoDB.");
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default dbConnect;
