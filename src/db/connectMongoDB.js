import mongoose from 'mongoose';
import { setServers } from "node:dns/promises";
import Note from '../models/note.js';

setServers(["1.1.1.1", "8.8.8.8"]);

export const connectMongoDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');

    await Note.syncIndexes();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
