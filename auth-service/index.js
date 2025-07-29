import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // same frontend
  credentials: true               // required to allow cookies
}));


app.use(express.json());
app.use(cookieParser());
app.use('/', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => console.log(`Auth service running on port ${3000}`));
});
