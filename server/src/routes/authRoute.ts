import { Router } from 'express';
import { authController } from '../controllers/authController';

const authRoute = Router();

authRoute.get('/', authController.accessToken);

export default authRoute;
