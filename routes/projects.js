const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectPhoto,
} = require('../controllers/projects');
const Project = require('../models/Project');
const advancedResults = require('../middleware/advancedResults');

// Include all other dependent resources routers
const taskRouter = require('./tasks');

// Re-route into other resources
router.use('/:projectId/tasks', taskRouter);

router
  .route('/')
  .get(advancedResults(Project, 'tasks'), getProjects)
  .post(createProject);
router.route('/:id/photo').put(uploadProjectPhoto);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;
