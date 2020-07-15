import express from 'express';
const router = express.Router({ mergeParams: true });

// local imports
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks';
import Task from '../models/Task';
import advancedResults from '../middleware/advancedResults';

router
  .route('/')
  .get(
    // advancedResults(Task, {
    //   path: 'project',
    //   select: 'name description estimatedEndDate',
    // }),
    getTasks,
  )
  .post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

export default router;
