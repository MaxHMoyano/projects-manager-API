const colors = require('colors');
const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  console.log(error.code);

  // Mongoose bad objectId
  if (error.name === 'CastError') {
    error = new ErrorResponse(
      `The resource with the requested ID of ${error.value} was not found`,
      404
    );
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    error = new ErrorResponse(
      `A resource is already created with those values`,
      400
    );
  }

  // Mongoose validation Error
  if (error.name === 'ValidationError') {
    error = new ErrorResponse(
      Object.values(err.errors)
        .map((e) => e.message)
        .join(' ---  '),
      400
    );
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
