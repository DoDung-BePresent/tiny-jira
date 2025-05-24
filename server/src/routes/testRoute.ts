/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controllers
 */
import { testController } from '../controllers/testController';

const testRoute = Router();

testRoute.post('/create-account', testController.createDatabase);

export default testRoute;
