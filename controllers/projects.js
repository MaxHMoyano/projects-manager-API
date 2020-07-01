const path = require('path');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
/**
 * @description Get all projects
 * @route GET /api/v1/projects
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getProjects = asyncHandler(async (req, res, next) => {
  // OK
  res.status(200).json(res.advancedResults);
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

  if (!project) {
    const error = new ErrorResponse(
      'A project with the requested ID was not found',
      404
    );
    return next(error);
  }

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
    const error = new ErrorResponse(
      'A project with the requested ID was not found',
      404
    );
    return next(error);
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

  if (!project) {
    const error = new ErrorResponse(
      'A project with the requested ID was not found',
      404
    );
    return next(error);
  }

  project.remove();

  res.status(204).json({ success: true, data: {} });
});

/**
 * @description Upload project photo
 * @route PUT /api/v1/projects/:id/photo
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.uploadProjectPhoto = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new ErrorResponse(
      'A project with the requested ID was not found',
      404
    );
    return next(error);
  }

  if (!req.files) {
    return next(new ErrorResponse('A file was not found on the request', 400));
  }
  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse('The uploaded file was not a valid image file', 400)
    );
  }

  // check files size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse('The uploaded file size was grater than 1MB', 400)
    );
  }

  // change name file to avoid replacements
  file.name = `project-photo-${project._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse('There was a problem uploading the file', 500)
      );
    }

    await project.update({ photo: file.name });
    res.status(200).json({ success: true, data: project });
  });
});
