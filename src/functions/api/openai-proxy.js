/**
 * OpenAI API compatibility handler
 */

const { createLogger } = require('../../common/logger');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');
const cors = require('../middlewares/cors');
const cache = require('../middlewares/cache');

// Routes
const chatRoutes = require('../../openai-proxy/routes/chat');
const completionsRoutes = require('../../openai-proxy/routes/completions');
const modelsRoutes = require('../../openai-proxy/routes/models');

const logger = createLogger('openai-proxy');

/**
 * Handler for OpenAI API compatibility endpoints
 * @param {object} event API Gateway event
 * @param {object} context Lambda context
 * @returns {Promise<object>} API Gateway response
 */
exports.handler = async (event, context) => {
  logger.debug('Received API event', { path: event.path, method: event.httpMethod });
  
  try {
    // Apply middlewares
    const req = await auth(event, context);
    await cors(req);
    await cache(req);
    
    // Route to appropriate handler
    const path = event.path;
    const method = event.httpMethod;
    
    let response;
    
    if (path.startsWith('/v1/chat/completions')) {
      response = await chatRoutes.handleRequest(req, method);
    } else if (path.startsWith('/v1/completions')) {
      response = await completionsRoutes.handleRequest(req, method);
    } else if (path.startsWith('/v1/models')) {
      response = await modelsRoutes.handleRequest(req, method);
    } else {
      response = {
        statusCode: 404,
        body: JSON.stringify({
          error: {
            message: `No such endpoint: ${path}`,
            type: 'invalid_request_error',
            code: 'endpoint_not_found',
          }
        }),
      };
    }
    
    logger.debug('Returning response', { statusCode: response.statusCode });
    return response;
    
  } catch (error) {
    return errorHandler(error);
  }
}; 