/**
 * Logging utilities for the AWS Bedrock OpenAI-compatible proxy
 */

const config = require('./config');

// Log levels in order of verbosity
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Get configured log level
const configuredLevel = config.get('logLevel', 'info');
const currentLogLevel = LOG_LEVELS[configuredLevel] || LOG_LEVELS.info;

/**
 * Create a logger for a specific component
 * @param {string} component Component name
 * @returns {object} Logger object with log methods
 */
function createLogger(component) {
  const formatMessage = (level, message, data) => {
    const timestamp = new Date().toISOString();
    const dataString = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp} [${level.toUpperCase()}] [${component}] ${message}${dataString}`;
  };

  return {
    error: (message, data) => {
      if (currentLogLevel >= LOG_LEVELS.error) {
        console.error(formatMessage('error', message, data));
      }
    },
    
    warn: (message, data) => {
      if (currentLogLevel >= LOG_LEVELS.warn) {
        console.warn(formatMessage('warn', message, data));
      }
    },
    
    info: (message, data) => {
      if (currentLogLevel >= LOG_LEVELS.info) {
        console.info(formatMessage('info', message, data));
      }
    },
    
    debug: (message, data) => {
      if (currentLogLevel >= LOG_LEVELS.debug) {
        console.debug(formatMessage('debug', message, data));
      }
    },
    
    // Create a child logger with a sub-component
    child: (subComponent) => {
      return createLogger(`${component}:${subComponent}`);
    },
  };
}

module.exports = {
  createLogger,
}; 