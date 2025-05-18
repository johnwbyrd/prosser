/**
 * Error handling middleware for API requests
 */

const { createLogger } = require('../../common/logger');
const { ApiError } = require('../../common/errors');

const logger = createLogger('middleware:error-handler');

/**
 * Format API error response
 * @param {Error} error Error object
 * @returns {object} Formatted API Gateway response
 */
function errorHandler(error) {
  logger.error('Error in request', { 
    error: error.message, 
    stack: error.stack, 
    name: error.name 
  });
  
  // If this is an ApiError, use its statusCode and formatted response
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify(error.toJSON()),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
  
  // Otherwise, treat as an internal server error
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: {
        message: 'An unexpected error occurred',
        type: 'server_error',
        code: 'internal_error',
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

module.exports = errorHandler; 