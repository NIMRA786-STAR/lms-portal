/**
 * Error Handling Middleware for Express.js
 * Handles all errors in the application
 */

// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user?._id
  });

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(400, message);
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Duplicate field value entered for "${field}". Please use another value.`;
    error = new ApiError(400, message);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    const message = `Invalid input data: ${errors.join(', ')}`;
    error = new ApiError(400, message);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = new ApiError(401, message);
  }

  // Multer Errors (File Upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large. Maximum size is 5MB.';
    error = new ApiError(400, message);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected field in file upload.';
    error = new ApiError(400, message);
  }

  // Send Response
  const statusCode = error.statusCode || err.status || 500;
  const message = error.message || err.message || 'Internal Server Error';

  // Development vs Production Error Response
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      message: message,
      status: statusCode,
      stack: err.stack,
      error: err
    });
  } else {
    // Production - Don't leak error details
    res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? 'Internal Server Error' : message,
      status: statusCode
    });
  }
};

// Async Handler to avoid try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Rate Limit Error Handler
const rateLimitErrorHandler = (err, req, res, next) => {
  if (err.message === 'Too many requests, please try again later.') {
    return res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    });
  }
  next(err);
};

// Validation Error Handler for Express Validator
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  ApiError,
  notFound,
  errorHandler,
  asyncHandler,
  rateLimitErrorHandler,
  validationErrorHandler
};