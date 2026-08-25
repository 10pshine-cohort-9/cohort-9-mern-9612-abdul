import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js';
import requestLogger from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Notes App Backend is running."
  });
});

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.use(errorHandler);

export default app;
