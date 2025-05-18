/**
 * Model mapping and selection for AWS Bedrock
 */

const config = require('../common/config');
const { createLogger } = require('../common/logger');
const { BadRequestError } = require('../common/errors');

const logger = createLogger('bedrock-models');

// OpenAI to Bedrock model mapping
const MODEL_MAPPING = {
  // GPT-4 family to Claude
  'gpt-4': 'anthropic.claude-3-opus-20240229-v1:0',
  'gpt-4-0613': 'anthropic.claude-3-opus-20240229-v1:0',
  'gpt-4-32k': 'anthropic.claude-3-opus-20240229-v1:0',
  'gpt-4-32k-0613': 'anthropic.claude-3-opus-20240229-v1:0',
  'gpt-4-0125-preview': 'anthropic.claude-3-sonnet-20240229-v1:0',
  
  // GPT-3.5 family to Claude
  'gpt-3.5-turbo': 'anthropic.claude-3-haiku-20240307-v1:0',
  'gpt-3.5-turbo-0613': 'anthropic.claude-3-haiku-20240307-v1:0',
  'gpt-3.5-turbo-16k': 'anthropic.claude-3-haiku-20240307-v1:0',
  'gpt-3.5-turbo-16k-0613': 'anthropic.claude-3-haiku-20240307-v1:0',
  
  // GPT models to Llama
  'gpt-4-llama': 'meta.llama3-70b-instruct-v1:0',
  'gpt-3.5-turbo-llama': 'meta.llama3-8b-instruct-v1:0',
  
  // Special purpose models
  'text-embedding-ada-002': 'amazon.titan-embed-text-v1',
  'text-embedding-3-small': 'amazon.titan-embed-text-v2:0',
  'text-embedding-3-large': 'cohere.embed-english-v3',
  'dall-e-3': 'stability.stable-diffusion-xl-v1',
};

// Mapping of provider prefixes to parameter transformers
const PROVIDER_TRANSFORMERS = {
  'anthropic': require('../openai-proxy/transformers/bedrock').transformClaudeParameters,
  'meta': require('../openai-proxy/transformers/bedrock').transformLlamaParameters,
  'cohere': require('../openai-proxy/transformers/bedrock').transformCohereParameters,
  'amazon': require('../openai-proxy/transformers/bedrock').transformTitanParameters,
  'stability': require('../openai-proxy/transformers/bedrock').transformStabilityParameters,
};

/**
 * Map an OpenAI model ID to a Bedrock model ID
 * @param {string} openaiModel OpenAI model ID
 * @returns {string} Bedrock model ID
 */
function mapModel(openaiModel) {
  const bedrockModel = MODEL_MAPPING[openaiModel];
  
  if (!bedrockModel) {
    logger.warn(`Unknown model mapping for ${openaiModel}`);
    throw new BadRequestError(`Unsupported model: ${openaiModel}`);
  }
  
  logger.debug(`Mapped ${openaiModel} to ${bedrockModel}`);
  return bedrockModel;
}

/**
 * Get the parameter transformer for a Bedrock model
 * @param {string} bedrockModel Bedrock model ID
 * @returns {Function} Parameter transformer function
 */
function getParameterTransformer(bedrockModel) {
  const provider = bedrockModel.split('.')[0];
  const transformer = PROVIDER_TRANSFORMERS[provider];
  
  if (!transformer) {
    logger.warn(`No parameter transformer for provider ${provider}`);
    throw new BadRequestError(`Unsupported model provider: ${provider}`);
  }
  
  return transformer;
}

/**
 * List available OpenAI-compatible models
 * @returns {Array<object>} List of model objects
 */
function listModels() {
  return Object.keys(MODEL_MAPPING).map(id => ({
    id,
    object: 'model',
    created: Date.now(),
    owned_by: 'aws-bedrock',
  }));
}

module.exports = {
  mapModel,
  getParameterTransformer,
  listModels,
  MODEL_MAPPING,
}; 