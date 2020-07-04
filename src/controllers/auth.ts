import { Request, Response, NextFunction } from 'express';

import asyncHandler from '../middleware/async';
/**
 * @description Register a user
 * @route POST /api/v1/auth/register
 * @access Public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {} = req.body;

    res.status(200).json({ success: true });
  },
);
