
import 'dotenv/config';
import {connectMongoDB} from "./db/connectMongoDB.js";
console.log('MONGODB_URL:', process.env.MONGODB_URL);
import express from 'express';
import cors from "cors";
import pino from "pino-http";

import helmet from "helmet";

import notesRoutes from "./routes/notesRoutes.js";

import {notFoundHandler} from  "./middleware/notFoundHandler.js";
import {errorHandler} from "./middleware/errorHandler.js";



const app = express();
                                      // Middleware
app.use(helmet());
// Middleware CORS
app.use(cors());
// для парсинга JSON тіла запиту
app.use(express.json({
  limit: '500kb'
}));
app.use(pino());

app.use(notesRoutes);
// /test-error
// app.get('/test-error', (req, res) => {
//   throw new Error('Simulated server error');
// });

// 404 Not Found
app.use(notFoundHandler);

// error middleware
app.use(errorHandler);

await connectMongoDB();

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
