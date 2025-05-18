# API Specification

## Overview
- This document describes the differences and extensions between our AWS Bedrock proxy and the standard OpenAI API
- For complete OpenAI API documentation, refer to [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## API Compatibility Approach
- Our API maintains 1:1 compatibility with OpenAI's API where possible
- Request and response formats follow OpenAI standards
- Authentication methods align with OpenAI's approach (API keys in Authorization header)

## Endpoint Implementations

### Chat Completions Endpoint
**OpenAI Endpoint**: `/v1/chat/completions`

**Implementation Notes**:
- All standard parameters supported (messages, model, temperature, etc.)
- Streaming implementation via SSE follows OpenAI pattern
- Function/tool calling supported with Bedrock models that offer equivalent capability
- **Long-running requests** handled through Lambda response streaming (up to 15 minutes)

**Bedrock-Specific Additions**:
- Additional parameter: `bedrock_model` to explicitly select AWS Bedrock model
- Extended parameter: `model_provider` for specifying "anthropic", "amazon", etc.

**Limitations**:
- Response format variations between model providers
- Token counting differences

### Completions Endpoint
**OpenAI Endpoint**: `/v1/completions`

**Implementation Notes**:
- Legacy endpoint maintained for compatibility
- Chat-optimized models mapped appropriately
- **Long-running requests** handled through Lambda response streaming (up to 15 minutes)

**Limitations**:
- Some Bedrock models may not support non-chat completions
- Performance may differ from chat completions

### Models Endpoint
**OpenAI Endpoint**: `/v1/models`

**Implementation Notes**:
- Returns available Bedrock models mapped to OpenAI-like identifiers
- Model capabilities accurately reflected

**Extensions**:
- Additional metadata fields indicating Bedrock-specific properties
- `provider` field indicating the source model provider

## Error Handling Differences
- Bedrock-specific error codes mapped to OpenAI equivalents
- Additional error types for AWS-specific issues
- Extended error information in response body for troubleshooting
- Streaming-specific error handling for long-running requests

## Rate Limiting
- Based on AWS account limits rather than OpenAI subscription tiers
- Different headers for rate limit information
- Per-model and per-region limitations noted in responses

## Authentication Differences
- API keys managed through AWS infrastructure
- Optional AWS IAM role-based authentication method
- Multi-tenant isolation options

## Streaming Implementation
- Implemented using AWS Lambda response streaming
- Supports responses exceeding standard Lambda timeout (up to 15 minutes)
- Maintains identical streaming format to OpenAI API
- Seamless client experience matching OpenAI's implementation

## Extensions Beyond OpenAI API

### Additional Headers
- `X-Bedrock-Model`: Actual Bedrock model used
- `X-Token-Usage-Input` and `X-Token-Usage-Output`: Token usage information
- `X-Request-ID`: Consistent request identifier for tracing

### Metadata Endpoints
- `/v1/providers`: List available model providers
- `/v1/mappings`: View model mapping configuration
- `/v1/usage`: Account token usage statistics

## Versioning and Compatibility
- Versioning strategy aligned with OpenAI
- Backward compatibility guarantees
- Support for multiple OpenAI API versions

## Appendix
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Anthropic Claude Documentation](https://docs.anthropic.com/claude/reference/)
- [AWS Lambda Response Streaming](https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html) 