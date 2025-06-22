import 'dotenv/config';  // This loads .env or .env.local automatically

// Now you can safely use envsafe
import { str, envsafe, port, url } from 'envsafe';
import * as process from 'node:process';

// export const env = envsafe({
//   NODE_ENV: str({
//     devDefault: 'development',
//     choices: ['development', 'production', 'test'],
//   }),
//   PORT: port({
//     devDefault: 3000,
//   }),
//   DATABASE_URI: url({
//     devDefault: 'mongodb://localhost:27017/nutri-flex',
//   }),
//
//   GEMINI_API_KEY: str(),
//   GEMINI_MODEL: str({
//     default: 'gemini-1.5-flash'
//   }),
//
//   AUTH_GOOGLE_ID: str(),
//   AUTH_GOOGLE_SECRET: str(),
//
//   NEXTAUTH_SECRET: str(),
//
//   PAYLOAD_SECRET: str()
// });

interface EnvConfig {
  APP_URL: string;
  isDevelopment: () => boolean;
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URI: string;
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  NEXTAUTH_SECRET: string;
  PAYLOAD_SECRET: string;
  SALT: number;
}

export const env: EnvConfig = {
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  isDevelopment: () => process.env.NODE_ENV === 'development',
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test' || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URI: process.env.DATABASE_URI || 'mongodb://localhost:27017/local',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || '',
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || '',
  SALT: parseInt(process.env.SALT || '12', 10),
};
