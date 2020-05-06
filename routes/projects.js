const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projects');
const router = express.Router();

// Include all other dependent resources routers
const taskRouter = require('./tasks');

// Re-route into other resources
router.use('/:projectId/tasks', taskRouter);

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;
