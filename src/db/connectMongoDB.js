import mongoose from 'mongoose';

export const connectMongoDB = async () => {
 try { const mongoURL = process.env.MONGODB_URL;
  await mongoose.connect(mongoURL);
  console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);

  process.exit(1);
}
  };
