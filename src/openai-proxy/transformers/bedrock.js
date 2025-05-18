/**
 * Bedrock transformers for request and response format conversions
 */

const { createLogger } = require('../../common/logger');

const logger = createLogger('transformers:bedrock');

/**
 * Transform OpenAI request to Bedrock parameters
 * @param {object} openaiRequest OpenAI API request
 * @param {string} bedrockModel Bedrock model ID
 * @param {Function} parameterTransformer Model-specific parameter transformer
 * @returns {object} Bedrock parameters
 */
function transformOpenAIRequest(openaiRequest, bedrockModel, parameterTransformer) {
  logger.debug('Transforming OpenAI request for Bedrock', { model: bedrockModel });
  
  // Common parameters that are standardized
  const commonParams = {
    temperature: openaiRequest.temperature,
    max_tokens: openaiRequest.max_tokens,
    top_p: openaiRequest.top_p,
    stop_sequences: openaiRequest.stop,
  };
  
  // Apply model-specific transformations
  return parameterTransformer(openaiRequest, commonParams);
}

/**
 * Transform Bedrock response to OpenAI response format
 * @param {object} bedrockResponse Bedrock API response
 * @param {object} originalRequest Original OpenAI request
 * @param {string} bedrockModel Bedrock model ID
 * @returns {object} OpenAI-compatible response
 */
function transformBedrockResponse(bedrockResponse, originalRequest, bedrockModel) {
  logger.debug('Transforming Bedrock response to OpenAI format');
  
  // Extract the response body based on provider
  const provider = bedrockModel.split('.')[0];
  const responseTransformer = getResponseTransformer(provider);
  
  return responseTransformer(bedrockResponse, originalRequest, bedrockModel);
}

/**
 * Get the appropriate response transformer for a provider
 * @param {string} provider Provider name (e.g., 'anthropic')
 * @returns {Function} Response transformer function
 */
function getResponseTransformer(provider) {
  switch (provider) {
    case 'anthropic':
      return transformClaudeResponse;
    case 'meta':
      return transformLlamaResponse;
    case 'cohere':
      return transformCohereResponse;
    case 'amazon':
      return transformTitanResponse;
    case 'stability':
      return transformStabilityResponse;
    default:
      return defaultResponseTransformer;
  }
}

/**
 * Transform Claude parameters
 * @param {object} openaiRequest OpenAI request
 * @param {object} commonParams Common parameters
 * @returns {object} Claude parameters
 */
function transformClaudeParameters(openaiRequest, commonParams) {
  const claudeParams = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens_to_sample: commonParams.max_tokens || 4096,
    temperature: commonParams.temperature !== undefined ? commonParams.temperature : 0.7,
    top_p: commonParams.top_p !== undefined ? commonParams.top_p : 0.95,
    stop_sequences: commonParams.stop_sequences || [],
  };
  
  // Handle system message
  let systemPrompt = '';
  let messages = [];
  
  if (openaiRequest.messages && Array.isArray(openaiRequest.messages)) {
    // Extract system message if present
    const systemMessage = openaiRequest.messages.find(msg => msg.role === 'system');
    if (systemMessage) {
      systemPrompt = systemMessage.content;
    }
    
    // Convert other messages to Claude format
    messages = openaiRequest.messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));
  }
  
  if (systemPrompt) {
    claudeParams.system = systemPrompt;
  }
  
  claudeParams.messages = messages;
  
  return claudeParams;
}

/**
 * Transform Llama parameters
 * @param {object} openaiRequest OpenAI request
 * @param {object} commonParams Common parameters
 * @returns {object} Llama parameters
 */
function transformLlamaParameters(openaiRequest, commonParams) {
  // Stub implementation
  return {
    prompt: formatLlamaPrompt(openaiRequest.messages),
    temperature: commonParams.temperature !== undefined ? commonParams.temperature : 0.7,
    top_p: commonParams.top_p !== undefined ? commonParams.top_p : 0.9,
    max_gen_len: commonParams.max_tokens || 2048,
  };
}

/**
 * Transform Cohere parameters
 * @param {object} openaiRequest OpenAI request
 * @param {object} commonParams Common parameters
 * @returns {object} Cohere parameters
 */
function transformCohereParameters(openaiRequest, commonParams) {
  // Stub implementation
  return {
    texts: [openaiRequest.input || ''],
  };
}

/**
 * Transform Titan parameters
 * @param {object} openaiRequest OpenAI request
 * @param {object} commonParams Common parameters
 * @returns {object} Titan parameters
 */
function transformTitanParameters(openaiRequest, commonParams) {
  // Stub implementation
  return {
    inputText: openaiRequest.input || '',
  };
}

/**
 * Transform Stability parameters
 * @param {object} openaiRequest OpenAI request
 * @param {object} commonParams Common parameters
 * @returns {object} Stability parameters
 */
function transformStabilityParameters(openaiRequest, commonParams) {
  // Stub implementation
  return {
    text_prompts: [
      {
        text: openaiRequest.prompt,
        weight: 1.0,
      },
    ],
    cfg_scale: 7.0,
    steps: 30,
  };
}

/**
 * Format messages for Llama prompt
 * @param {Array<object>} messages OpenAI messages array
 * @returns {string} Formatted prompt
 */
function formatLlamaPrompt(messages) {
  // Stub implementation
  let prompt = '';
  let systemPrompt = '';
  
  // Extract system prompt if present
  const systemMessage = messages.find(msg => msg.role === 'system');
  if (systemMessage) {
    systemPrompt = systemMessage.content;
  }
  
  if (systemPrompt) {
    prompt += `<|system|>\n${systemPrompt}\n`;
  }
  
  // Process conversation messages
  messages
    .filter(msg => msg.role !== 'system')
    .forEach(msg => {
      const role = msg.role === 'assistant' ? 'assistant' : 'user';
      prompt += `<|${role}|>\n${msg.content}\n`;
    });
  
  // Add final assistant prefix for the response
  prompt += '<|assistant|>\n';
  
  return prompt;
}

/**
 * Transform Claude response to OpenAI format
 * @param {object} bedrockResponse Bedrock response
 * @param {object} originalRequest Original OpenAI request
 * @param {string} bedrockModel Bedrock model ID
 * @returns {object} OpenAI-compatible response
 */
function transformClaudeResponse(bedrockResponse, originalRequest, bedrockModel) {
  // Parse the response body
  const body = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
  
  return {
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: originalRequest.model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: body.content[0].text,
        },
        finish_reason: mapStopReason(body.stop_reason),
      },
    ],
    usage: {
      prompt_tokens: body.usage?.input_tokens || 0,
      completion_tokens: body.usage?.output_tokens || 0,
      total_tokens: (body.usage?.input_tokens || 0) + (body.usage?.output_tokens || 0),
    },
  };
}

/**
 * Default response transformer
 * @param {object} bedrockResponse Bedrock response
 * @param {object} originalRequest Original OpenAI request
 * @returns {object} OpenAI-compatible response
 */
function defaultResponseTransformer(bedrockResponse, originalRequest) {
  // Stub implementation
  return {
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: originalRequest.model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: 'Response not properly transformed',
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };
}

/**
 * Transform Llama response
 * @param {object} bedrockResponse Bedrock response
 * @param {object} originalRequest Original OpenAI request
 * @returns {object} OpenAI-compatible response
 */
function transformLlamaResponse(bedrockResponse, originalRequest) {
  // Stub implementation - actual parsing would be required
  return defaultResponseTransformer(bedrockResponse, originalRequest);
}

/**
 * Transform Cohere response
 * @param {object} bedrockResponse Bedrock response
 * @param {object} originalRequest Original OpenAI request
 * @returns {object} OpenAI-compatible response
 */
function transformCohereResponse(bedrockResponse, originalRequest) {
  // Stub implementation - actual parsing would be required
  return defaultResponseTransformer(bedrockResponse, originalRequest);
}

/**
 * Transform Titan response
 * @param {object} bedrockResponse Bedrock response
 * @param {object} originalRequest Original OpenAI request
 * @returns {object} OpenAI-compatible response
 */
function transformTitanResponse(bedrockResponse, originalRequest) {
  // Stub implementation - actual parsing would be required
  return defaultResponseTransformer(bedrockResponse, originalRequest);
}

/**
 * Transform Stability response
 * @param {object} bedrockResponse Bedrock response
 * @param {object} originalRequest Original OpenAI request
 * @returns {object} OpenAI-compatible response
 */
function transformStabilityResponse(bedrockResponse, originalRequest) {
  // Stub implementation - actual parsing would be required
  return defaultResponseTransformer(bedrockResponse, originalRequest);
}

/**
 * Map Bedrock stop reason to OpenAI finish reason
 * @param {string} stopReason Bedrock stop reason
 * @returns {string} OpenAI finish reason
 */
function mapStopReason(stopReason) {
  switch (stopReason) {
    case 'stop_sequence':
    case 'max_tokens':
      return 'stop';
    case 'max_tokens_reached':
      return 'length';
    default:
      return 'stop';
  }
}

module.exports = {
  transformOpenAIRequest,
  transformBedrockResponse,
  transformClaudeParameters,
  transformLlamaParameters,
  transformCohereParameters,
  transformTitanParameters,
  transformStabilityParameters,
}; 