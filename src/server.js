import express from 'express';
import cors from "cors";
import pino from "pino-http";
import 'dotenv/config';
import helmet from "helmet";


const app = express();
                                      // Middleware
app.use(helmet());
// Middleware CORS
app.use(cors());
// для парсинга JSON тіла запиту
app.use(express.json());
app.use(pino());

// localhost.get/notes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: "Retrieved all notes" });
});

// GET /notes/:noteId
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});
// /test-error
app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message, message: "повідомлення про помилку" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
