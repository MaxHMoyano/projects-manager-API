const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');

/**
 * @description Get all projects
 * @route GET /api/v1/projects
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find();

  // OK
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

/**
 * @description Get project
 * @route GET /api/v1/projects/:id
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @description Create project
 * @route POST /api/v1/projects/
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await Project.create(req.body);
  res.status(201).json({
    success: true,
    data: project,
  });
});

/**
 * @description Update project
 * @route PUT /api/v1/projects/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: project });
});

/**
 * @description Delete project
 * @route DELETE /api/v1/projects/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  res.status(400).json({ success: true, data: {} });
});
