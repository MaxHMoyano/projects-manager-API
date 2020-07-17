import express from 'express';
import chalk from 'chalk';

// Local imports
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  let error = err;

  // Mongoose bad objectId
  if (error.name === 'CastError') {
    error = new ErrorResponse(
      `The resource with the requested ID of ${error.value} was not found`,
      404,
    );
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    error = new ErrorResponse(
      `A resource is already created with those values`,
      400,
    );
  }

  // Mongoose validation Error
  if (error.name === 'ValidationError') {
    error = new ErrorResponse(
      Object.values(err.errors)
        .map((e: any) => e.message)
        .join(' ---  '),
      400,
    );
  }

  console.log(chalk.bgRedBright(error.message));
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
