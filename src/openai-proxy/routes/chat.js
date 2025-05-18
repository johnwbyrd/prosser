/**
 * Chat completions endpoint handler
 */

const { createLogger } = require('../../common/logger');
const { BadRequestError } = require('../../common/errors');
const { mapModel, getParameterTransformer } = require('../../bedrock/models');
const { invokeModel } = require('../../bedrock/client');
const { transformOpenAIRequest, transformBedrockResponse } = require('../transformers/bedrock');
const { handleStreamingResponse } = require('../../bedrock/streaming');

const logger = createLogger('openai-proxy:chat');

/**
 * Handle chat completions request
 * @param {object} req Request object
 * @param {string} method HTTP method
 * @returns {Promise<object>} API Gateway response
 */
async function handleRequest(req, method) {
  if (method !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: {
          message: 'Method not allowed',
          type: 'invalid_request_error',
          code: 'method_not_allowed',
        }
      }),
    };
  }
  
  const body = JSON.parse(req.body);
  logger.debug('Processing chat request', { model: body.model });
  
  // Validate required fields
  if (!body.model) {
    throw new BadRequestError('Missing required parameter: model');
  }
  
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    throw new BadRequestError('Missing required parameter: messages');
  }
  
  // Map OpenAI model to Bedrock model
  const bedrockModel = mapModel(body.model);
  const parameterTransformer = getParameterTransformer(bedrockModel);
  
  // Transform OpenAI parameters to Bedrock parameters
  const bedrockParams = transformOpenAIRequest(body, bedrockModel, parameterTransformer);
  
  // Handle streaming vs non-streaming
  if (body.stream) {
    return handleStreamingResponse(bedrockModel, bedrockParams, req.accountId);
  }
  
  // Invoke Bedrock model
  const bedrockResponse = await invokeModel({
    modelId: bedrockModel,
    body: bedrockParams,
  });
  
  // Transform Bedrock response to OpenAI response
  const openaiResponse = transformBedrockResponse(bedrockResponse, body, bedrockModel);
  
  return {
    statusCode: 200,
    body: JSON.stringify(openaiResponse),
  };
}

module.exports = {
  handleRequest,
}; 