import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './authRouter.js';

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGODB_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

async function startApp() {
  try {
    mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(PORT, () => console.log('Сервер запущен на 5000'));
  } catch (error) {
    console.log(error);
  }
}

startApp();
