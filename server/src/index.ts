/**
 * Node modules
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

/**
 * Routes
 */
import testRoute from './routes/testRoute';
import authRoute from './routes/authRoute';
import issueRoute from './routes/issueRoute';
import projectRoute from './routes/projectRoute';

/**
 * Middlewares
 */
import { errorHandler } from './middlewares/errorHandler';

/**
 * App
 */
const app = express();
app.use(cors());
app.use(express.json());

/**
 * ENV
 */
const PORT = process.env.PORT || 5000;
const BASE_PATH = process.env.BASE_PATH;
const NODE_ENV = process.env.NODE_ENV;

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello',
  });
});

/**
 * Use routes
 */
app.use(`${BASE_PATH}/test`, testRoute);
app.use(`${BASE_PATH}/project`, projectRoute);
app.use(`${BASE_PATH}/auth`, authRoute);
app.use(`${BASE_PATH}/issue`, issueRoute);

/**
 * Error Handler
 */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
