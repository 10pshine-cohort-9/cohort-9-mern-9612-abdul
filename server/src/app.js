import express from 'express';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Notes App Backend is running."
  });
});

app.use('/api/auth', authRouter);

export default app;
