/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Controller
 */
import { projectController } from '../controllers/projectController';

const projectRoute = Router();

projectRoute.get('/', projectController.getProjects);

export default projectRoute
