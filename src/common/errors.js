/**
 * Error handling utilities for the AWS Bedrock OpenAI-compatible proxy
 */

/**
 * Base API error class
 */
class ApiError extends Error {
  constructor(message, statusCode, code, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        type: this.code,
        param: this.details.param,
        code: this.code,
        ...this.details,
      },
    };
  }
}

/**
 * Authentication error
 */
class AuthenticationError extends ApiError {
  constructor(message = 'Invalid authentication', details = {}) {
    super(message, 401, 'authentication_error', details);
  }
}

/**
 * Authorization error
 */
class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions', details = {}) {
    super(message, 403, 'authorization_error', details);
  }
}

/**
 * Bad request error
 */
class BadRequestError extends ApiError {
  constructor(message = 'Bad request', details = {}) {
    super(message, 400, 'bad_request_error', details);
  }
}

/**
 * Not found error
 */
class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details = {}) {
    super(message, 404, 'not_found_error', details);
  }
}

/**
 * Rate limit error
 */
class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded', details = {}) {
    super(message, 429, 'rate_limit_error', details);
  }
}

/**
 * Service error (internal server error)
 */
class ServiceError extends ApiError {
  constructor(message = 'Internal server error', details = {}) {
    super(message, 500, 'service_error', details);
  }
}

/**
 * Bedrock API error
 */
class BedrockError extends ApiError {
  constructor(message = 'Bedrock API error', bedrockError = {}, details = {}) {
    super(
      message,
      503,
      'bedrock_error',
      {
        ...details,
        bedrockError: {
          code: bedrockError.code || 'unknown',
          message: bedrockError.message || message,
        },
      }
    );
  }
}

module.exports = {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  NotFoundError,
  RateLimitError,
  ServiceError,
  BedrockError,
}; 