# API Specification

## Overview
- Purpose of the API
- Core principles
- Compatibility goals

## OpenAI API Compatibility Layer

### Chat Completions Endpoint
- Endpoint: `/v1/chat/completions`
- HTTP Methods: POST
- Request format
- Response format
- Streaming implementation
- Example request/response pairs

### Completions Endpoint
- Endpoint: `/v1/completions`
- HTTP Methods: POST
- Request format
- Response format
- Streaming implementation
- Example request/response pairs

### Models Endpoint
- Endpoint: `/v1/models`
- HTTP Methods: GET
- Response format
- Model mapping approach
- Example response

## Error Handling
- Error response format
- Common error codes
- Error translation from Bedrock to OpenAI format
- Retry mechanisms

## Rate Limiting
- Rate limit implementation
- Headers for rate limit information
- Handling rate limit exceeded scenarios

## Authentication
- API key requirements
- Authentication header format
- Key rotation strategy

## Cross-Origin Resource Sharing (CORS)
- CORS configuration
- Allowed origins
- Preflight request handling

## API Versioning
- Version handling strategy
- Backward compatibility approach

## Appendix
- OpenAI API Reference links
- Bedrock API Reference links
- Mapping implementation notes 