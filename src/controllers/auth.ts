import { Request, Response, NextFunction } from 'express';

// Local imports
import asyncHandler from '../middleware/async';
import User from '../models/User';
import { JsonResponse } from '../utils/models';

/**
 * @description Register a user
 * @route POST /api/v1/auth/register
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const register = asyncHandler(
  async (req: Request, res: JsonResponse, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = User.create({
      name,
      email,
      password,
      role,
    });

    res.status(200).json({ success: true, data: 'hola' });
  },
);
