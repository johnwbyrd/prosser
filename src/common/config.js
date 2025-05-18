/**
 * Configuration management for the AWS Bedrock OpenAI-compatible proxy
 */

const DEFAULT_CONFIG = {
  // Environment variables take precedence over defaults
  environment: process.env.NODE_ENV || 'dev',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // API configuration
  api: {
    port: process.env.PORT || 3000,
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
  },
  
  // DynamoDB configuration
  dynamodb: {
    region: process.env.AWS_REGION || 'us-east-1',
    accountsTable: process.env.ACCOUNTS_TABLE || 'bedrock-proxy-accounts',
    sessionsTable: process.env.SESSIONS_TABLE || 'bedrock-proxy-sessions',
    cacheTable: process.env.CACHE_TABLE || 'bedrock-proxy-cache',
  },
  
  // Bedrock configuration
  bedrock: {
    region: process.env.BEDROCK_REGION || 'us-east-1',
    defaultModel: process.env.DEFAULT_MODEL || 'anthropic.claude-3-sonnet-20240229-v1',
    maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10),
    defaultTemperature: parseFloat(process.env.DEFAULT_TEMPERATURE || '0.7'),
  },
  
  // Cache configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour default
  },
  
  // Security configuration
  security: {
    apiKeyLength: parseInt(process.env.API_KEY_LENGTH || '40', 10),
    apiKeyPrefix: process.env.API_KEY_PREFIX || 'bproxy_',
    apiKeyExpiryDays: parseInt(process.env.API_KEY_EXPIRY_DAYS || '90', 10),
  },
};

/**
 * Get configuration value
 * @param {string} key Dot-notation path to configuration value
 * @param {any} defaultValue Default value if key not found
 * @returns {any} Configuration value
 */
function get(key, defaultValue) {
  const keys = key.split('.');
  let result = DEFAULT_CONFIG;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return defaultValue;
    }
  }
  
  return result;
}

/**
 * Check if running in production environment
 * @returns {boolean} True if in production
 */
function isProduction() {
  return get('environment') === 'production';
}

/**
 * Check if running in development environment
 * @returns {boolean} True if in development
 */
function isDevelopment() {
  return get('environment') === 'dev';
}

module.exports = {
  get,
  isProduction,
  isDevelopment,
  DEFAULT_CONFIG,
}; 