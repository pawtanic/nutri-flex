import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// This will create an in-memory MongoDB server for testing
// It will be used instead of the actual database
let mongoServer: MongoMemoryServer;

// Connect to the in-memory database
export const connect = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Override the DATABASE_URI environment variable
  process.env.DATABASE_URI = uri;
  
  await mongoose.connect(uri);
};

// Clear all data in the database
export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Disconnect and close connection
export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
};

// Setup function to be used in beforeAll
export const setupTestDB = async (): Promise<void> => {
  await connect();
};

// Teardown function to be used in afterAll
export const teardownTestDB = async (): Promise<void> => {
  await closeDatabase();
};

// Clear function to be used in afterEach
export const clearTestDB = async (): Promise<void> => {
  await clearDatabase();
};
