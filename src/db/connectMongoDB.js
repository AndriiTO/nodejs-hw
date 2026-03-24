import mongoose from 'mongoose';
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

export const connectMongoDB = async () => {
 try { const mongoURL = process.env.MONGODB_URL;
  await mongoose.connect(mongoURL);
  console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);

  process.exit(1);
}
  };
