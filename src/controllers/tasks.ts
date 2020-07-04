import { Request, Response, NextFunction } from 'express';

// local imports
import Task from '../models/Task';
import Project from '../models/Project';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';

/**
 * @description Get all tasks
 * @route GET /api/v1/tasks
 * @route GET /api/v1/projects/:projectId/tasks
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.projectId) {
      const tasks = await Task.find({ project: req.params.projectId });
      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  },
);

/**
 * @description Create Task
 * @route POST /api/v1/projects/:projectId/tasks/
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add project to the request body
    req.body.project = req.params.projectId;
    const project = Project.findById(req.body.project);

    if (!project) {
      return next(
        new ErrorResponse(`No project was found with the requested ID`, 404),
      );
    }

    const task = await Task.create(req.body);
    res.status(201).json({
      success: true,
      data: task,
    });
  },
);

/**
 * @description Get task
 * @route GET /api/v1/projects/:projectId/tasks/:id
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Verify if the request contains a projectId
    if (req.params.projectId) {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        if (!project) {
          const error = new ErrorResponse(
            'A project with the requested ID was not found',
            404,
          );
          return next(error);
        }
      }
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new ErrorResponse(
        'A task with the requested ID was not found',
        404,
      );
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  },
);

/**
 * @description Update task
 * @route PUT /api/v1/projects/:projectId/tasks/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Verify if the request contains a projectId
    if (req.params.projectId) {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        if (!project) {
          const error = new ErrorResponse(
            'A project with the requested ID was not found',
            404,
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
        404,
      );
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  },
);

/**
 * @description Delete task
 * @route DELETE /api/v1/projects/:projectId/tasks/:id
 * @access Private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Verify if the request contains a projectId
    if (req.params.projectId) {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        if (!project) {
          const error = new ErrorResponse(
            'A project with the requested ID was not found',
            404,
          );
          return next(error);
        }
      }
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new ErrorResponse(
        'A task with the requested ID was not found',
        404,
      );
      return next(error);
    }

    task.remove();
    res.status(204).json({ success: true, data: {} });
  },
);
