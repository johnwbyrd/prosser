/**
 * AWS Bedrock client initialization and configuration
 */

const { BedrockRuntime } = require('@aws-sdk/client-bedrock-runtime');
const config = require('../common/config');
const { createLogger } = require('../common/logger');
const { BedrockError } = require('../common/errors');

const logger = createLogger('bedrock-client');

// Cached Bedrock clients by region
const clients = {};

/**
 * Get a Bedrock client for the specified region
 * @param {string} region AWS region
 * @returns {BedrockRuntime} Bedrock client
 */
function getClient(region = null) {
  const targetRegion = region || config.get('bedrock.region');
  
  if (!clients[targetRegion]) {
    logger.debug(`Creating new Bedrock client for region ${targetRegion}`);
    
    clients[targetRegion] = new BedrockRuntime({
      region: targetRegion,
      maxAttempts: 3,
    });
  }
  
  return clients[targetRegion];
}

/**
 * Invoke a Bedrock model
 * @param {object} params Invoke parameters
 * @param {string} params.modelId Model ID
 * @param {object} params.body Request body
 * @param {boolean} params.stream Whether to stream the response
 * @param {string} params.region Optional region override
 * @returns {Promise<object>} Bedrock response
 */
async function invokeModel({ modelId, body, stream = false, region = null }) {
  const client = getClient(region);
  const method = stream ? 'invokeModelWithResponseStream' : 'invokeModel';
  
  try {
    logger.debug(`Invoking Bedrock model ${modelId}`, { stream });
    
    const response = await client[method]({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body),
    });
    
    return response;
  } catch (error) {
    logger.error(`Error invoking Bedrock model ${modelId}`, { error });
    throw new BedrockError(
      `Error invoking model: ${error.message}`,
      { code: error.name, message: error.message }
    );
  }
}

module.exports = {
  getClient,
  invokeModel,
}; 