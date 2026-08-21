import express from 'express';
import authRouter from './routes/auth.routes.js';
import notesRouter from './routes/notes.routes.js';
import requestLogger from './middleware/requestLogger.js';

const app = express();

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

export default app;
