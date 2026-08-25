import logger from '../config/logger.js';
import { AppError } from '../errors/AppError.js';

const SAFE_STATUS_CODES = new Set([400, 401, 403, 404, 409, 422, 429, 500, 503]);

const isProduction = process.env.NODE_ENV === 'production';

function resolveStatus(err) {
  if (err instanceof AppError && SAFE_STATUS_CODES.has(err.statusCode)) {
    return err.statusCode;
  }

  const candidate = err.statusCode ?? err.status;
  if (typeof candidate === 'number' && SAFE_STATUS_CODES.has(candidate)) {
    return candidate;
  }

  return 500;
}

function isOperational(err) {
  return err instanceof AppError && err.isOperational === true;
}

function resolveMessage(err, status, operational) {
  if (operational && err.message) {
    return err.message;
  }

  const genericMessages = {
    400: 'Bad request.',
    401: 'Authentication required.',
    403: 'Access denied.',
    404: 'Resource not found.',
    409: 'Conflict.',
    503: 'Service temporarily unavailable. Please try again later.',
  };

  return genericMessages[status] ?? 'An unexpected error occurred. Please try again later.';
}

export function errorHandler(err, req, res, _next) {
  const status = resolveStatus(err);
  const operational = isOperational(err);
  const message = resolveMessage(err, status, operational);

  const logContext = {
    method: req.method,
    url: req.url,
    status,
    errorName: err.name ?? 'Error',
    errorMessage: err.message,
  };

  if (operational) {
    logger.warn(logContext, 'Operational error handled.');
  } else {
    logger.error(
      { ...logContext, stack: isProduction ? undefined : err.stack },
      'Unexpected error caught by error handler.',
    );
  }

  res.status(status).json({ message });
}
