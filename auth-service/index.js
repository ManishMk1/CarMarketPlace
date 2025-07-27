import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => console.log(`Auth service running on port ${3000}`));
});
