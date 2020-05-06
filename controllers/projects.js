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
  let queryParams, fields, sortBy;
  // Make a copy of the query parameters
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop on removeFields and delete them from query
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryParamsStr = JSON.stringify(reqQuery);

  if (req.query.select) {
    fields = req.query.select.split(',').join(' ');
  }

  //sorting
  if (req.query.sort) {
    sortBy = req.query.sort.split(',').join(' ');
  } else {
    sortBy = 'createdAt';
  }

  // This is for looking fields with operators
  queryParamsStr = queryParamsStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  queryParams = JSON.parse(queryParamsStr);

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Project.countDocuments();

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  // Finding resources
  const projects = await Project.find(queryParams)
    .populate('tasks')
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit);

  // OK
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
    pagination,
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
  if (!project) {
    return next(
      new ErrorResponse('A project with the requested ID was not found', 404)
    );
  }

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
  const project = await Project.findById(req.params.id);
  project.remove();

  res.status(200).json({ success: true, data: {} });
});
