/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

/**
 * Configs
 */
dotenv.config();

/**
 * App
 */
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from Supabase + Prisma backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

