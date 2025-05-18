/**
 * Authentication middleware for API requests
 */

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { createLogger } = require('../../common/logger');
const config = require('../../common/config');
const { AuthenticationError } = require('../../common/errors');

const logger = createLogger('middleware:auth');
const dynamoClient = new DynamoDB({ region: config.get('dynamodb.region') });
const documentClient = DynamoDBDocument.from(dynamoClient);

/**
 * Verify API key and attach account info to request
 * @param {object} event API Gateway event
 * @param {object} context Lambda context
 * @returns {Promise<object>} API Gateway event with auth info
 */
async function auth(event, context) {
  logger.debug('Authenticating request');
  
  // Extract API key from header
  const apiKey = getApiKeyFromRequest(event);
  
  if (!apiKey) {
    logger.warn('Missing API key in request');
    throw new AuthenticationError('Missing API key');
  }
  
  try {
    // Look up account by API key
    const account = await getAccountByApiKey(apiKey);
    
    if (!account) {
      logger.warn('Invalid API key');
      throw new AuthenticationError('Invalid API key');
    }
    
    logger.debug('Authentication successful', { accountId: account.accountId });
    
    // Attach account info to the request
    return {
      ...event,
      accountId: account.accountId,
      accountTier: account.tier,
      apiKey,
      account,
    };
    
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    logger.error('Error authenticating request', { error });
    throw new AuthenticationError('Authentication failed');
  }
}

/**
 * Extract API key from request headers
 * @param {object} event API Gateway event
 * @returns {string|null} API key or null if not found
 */
function getApiKeyFromRequest(event) {
  const headers = event.headers || {};
  const lowerCaseHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key];
    return acc;
  }, {});
  
  // Check for API key in different common header formats
  return lowerCaseHeaders['x-api-key'] || 
         lowerCaseHeaders['authorization']?.replace('Bearer ', '') ||
         event.queryStringParameters?.api_key || 
         null;
}

/**
 * Get account by API key
 * @param {string} apiKey API key
 * @returns {Promise<object|null>} Account or null if not found
 */
async function getAccountByApiKey(apiKey) {
  try {
    const params = {
      TableName: config.get('dynamodb.accountsTable'),
      IndexName: 'ApiKeyIndex',
      KeyConditionExpression: 'apiKey = :apiKey',
      ExpressionAttributeValues: {
        ':apiKey': apiKey,
      },
    };
    
    const result = await documentClient.query(params);
    
    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    }
    
    return null;
  } catch (error) {
    logger.error('Error querying DynamoDB for API key', { error });
    throw error;
  }
}

module.exports = auth; 