import express from 'express';
const router = express.Router();

// local imports
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectPhoto,
} from '../controllers/projects';
import Project from '../models/Project';
import advancedResults from '../middleware/advancedResults';

// Include all other dependent resources routers
import taskRouter from './tasks';

// Re-route into other resources
router.use('/:projectId/tasks', taskRouter);

router
  .route('/')
  .get(advancedResults(Project, 'tasks'), getProjects)
  .post(createProject);
router.route('/:id/photo').put(uploadProjectPhoto);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

export default router;
