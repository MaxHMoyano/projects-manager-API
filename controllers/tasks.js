const Task = require('../models/Task');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @description Get all tasks
 * @route GET /api/v1/tasks
 * @route GET /api/v1/projects/:projectId/tasks
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getTasks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.projectId) {
    query = Task.find({ project: req.params.projectId });
  } else {
    query = Task.find().populate({
      path: 'project',
      select: 'name description estimatedEndDate',
    });
  }
  // Finding resources
  const tasks = await query;
  // OK
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
    // pagination,
  });
});

/**
 * @description Create Task
 * @route POST /api/v1/projects/:projectId/tasks/
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add project to the request body
  req.body.project = req.params.projectId;
  const project = Project.findById(req.body.project);

  if (!project) {
    return next(
      new ErrorResponse(`No project was found with the requested ID`, 404)
    );
  }

  const task = await Task.create(req.body);
  res.status(201).json({
    success: true,
    data: task,
  });
});

/**
 * @description Get task
 * @route GET /api/v1/projects/:projectId/tasks/:id
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  // Verify if the request contains a projectId
  if (req.params.projectId) {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      if (!project) {
        const error = new ErrorResponse(
          'A project with the requested ID was not found',
          404
        );
        return next(error);
      }
    }
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new ErrorResponse(
      'A task with the requested ID was not found',
      404
    );
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @description Update task
 * @route PUT /api/v1/projects/:projectId/tasks/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  // Verify if the request contains a projectId
  if (req.params.projectId) {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      if (!project) {
        const error = new ErrorResponse(
          'A project with the requested ID was not found',
          404
        );
        return next(error);
      }
    }
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    const error = new ErrorResponse(
      'A task with the requested ID was not found',
      404
    );
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @description Delete task
 * @route DELETE /api/v1/projects/:projectId/tasks/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  // Verify if the request contains a projectId
  if (req.params.projectId) {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      if (!project) {
        const error = new ErrorResponse(
          'A project with the requested ID was not found',
          404
        );
        return next(error);
      }
    }
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    const error = new ErrorResponse(
      'A task with the requested ID was not found',
      404
    );
    return next(error);
  }

  task.remove();
  res.status(204).json({ success: true, data: {} });
});
