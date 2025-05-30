/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
import { issueController } from '../controllers/issueController';

const issueRoute = Router();

issueRoute.put('/:id', authenticate, issueController.updateIssue);

export default issueRoute;
