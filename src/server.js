
import 'dotenv/config';
import {connectMongoDB} from "./db/connectMongoDB.js";
console.log('MONGODB_URL:', process.env.MONGODB_URL);
import express from 'express';
import cors from "cors";
import pino from "pino-http";
import { errors } from "celebrate";
import cokieParser from "cookie-parser";
import helmet from "helmet";

import notesRoutes from "./routes/notesRoutes.js";

import {notFoundHandler} from  "./middleware/notFoundHandler.js";
import {errorHandler} from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
// const PORT = process.env.PORT ;
                                      // Middleware
app.use(helmet());
// Middleware CORS
app.use(cors());
// для парсинга JSON тіла запиту
app.use(express.json({
  limit: '500kb'
}));
app.use(cokieParser());
app.use(pino());

app.use(authRoutes);
app.use(notesRoutes);
// /test-error
// app.get('/test-error', (req, res) => {
//   throw new Error('Simulated server error');
// });

// 404 Not Found
app.use(notFoundHandler);
app.use(errors());
// error middleware
app.use(errorHandler);

await connectMongoDB();

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
