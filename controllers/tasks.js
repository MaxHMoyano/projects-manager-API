const Task = require('../models/Task');
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
 * @route POST /api/v1/tasks/
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  const task = await Task.create(req.body);
  res.status(201).json({
    success: true,
    data: task,
  });
});

/**
 * @description Get task
 * @route GET /api/v1/tasks/:id
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @description Update task
 * @route PUT /api/v1/tasks/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return next(
      new ErrorResponse('A task with the requested ID was not found', 404)
    );
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @description Delete task
 * @route DELETE /api/v1/tasks/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  task.remove();

  res.status(200).json({ success: true, data: {} });
});
