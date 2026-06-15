import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function connectDB() {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.warn('MONGO_URI is not defined. Starting an in-memory MongoDB instance for development...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('In-memory MongoDB started at', mongoUri);
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}
