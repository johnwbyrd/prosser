# Prosser: AWS Bedrock OpenAI-compatible API Proxy

A serverless proxy service that provides OpenAI API compatibility for AWS Bedrock models.

## Features

- Compatible with the OpenAI API specification
- Integrates with AWS Bedrock models (Claude, Llama, etc.)
- Supports streaming responses
- Multi-tenant with API key authentication
- Response caching for improved performance
- Cost tracking and usage metrics
- MCP (Model Control Protocol) server implementation
- Client templates for VS Code and Cursor

## Architecture

This service is built using AWS serverless technologies:
- AWS Lambda for compute
- API Gateway for HTTP endpoints
- DynamoDB for data storage
- CloudWatch for metrics and logging
- AWS SAM for infrastructure as code

## Setup

### Prerequisites

- Node.js 18 or later
- AWS CLI
- AWS SAM CLI
- AWS account with Bedrock access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/johnbyrd/prosser.git
   cd prosser
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Deploy to AWS:
   ```
   npm run deploy:dev
   ```

## Usage

### OpenAI API Compatibility

The service provides a drop-in replacement for the OpenAI API with endpoints for:

- `/v1/chat/completions` - Chat completions API
- `/v1/completions` - Legacy completions API
- `/v1/models` - List available models

### Client Integration

#### Cursor

1. Add a new model provider
2. Import the configuration from `templates/cursor/mcp.json`
3. Replace the API key placeholder with your actual API key

#### VS Code

1. Install a suitable MCP extension
2. Import the configuration from `templates/vscode/mcp.json`
3. Replace the API key placeholder with your actual API key

## Development

### Local Development

Start the local development server:
```
npm start
```

### Testing

Run unit tests:
```
npm run test:unit
```

Run integration tests:
```
npm run test:integration
```

Run load tests:
```
npm run test:load
```

### Deployment

Deploy to development:
```
npm run deploy:dev
```

Deploy to production:
```
npm run deploy:prod
```