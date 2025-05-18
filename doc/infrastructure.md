# Infrastructure Design

## Overview
- This document outlines the serverless infrastructure design for the AWS Bedrock MCP and OpenAI API Proxy
- Infrastructure follows a zero-cost-at-rest model with AWS Lambda and API Gateway
- All components are deployed via AWS SAM templates

## Core Architecture

### Key Components
- **API Gateway**: Entry point for all API calls
- **Lambda Functions**: Serverless compute handling requests
- **DynamoDB**: Session and cache storage with on-demand capacity
- **Parameter Store**: Configuration and secret management
- **CloudWatch**: Logging and monitoring

### Request Flow
1. Client makes request to API Gateway endpoint
2. API Gateway routes to appropriate Lambda function
3. Lambda authenticates and processes request
4. AWS Bedrock API processes model requests
5. Response streams back to client through Lambda

## Lambda Response Streaming

### Implementation
- Uses AWS Lambda response streaming for model responses
- Enables execution up to 15 minutes while streaming results
- Maintains zero-cost-at-rest architecture
- Sample SAM configuration:

```yaml
Resources:
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      # Standard Lambda configuration
      Runtime: nodejs18.x
      Handler: src/functions/api/openai-proxy.handler
      # Response streaming configuration
      FunctionUrlConfig:
        InvokeMode: RESPONSE_STREAM
```

### API Gateway Integration
- Configured with `AWS_PROXY` integration type
- Set to use `RESPONSE` data passing mode
- Extended timeout configuration
- CORS headers properly configured for streaming responses

### Streaming Implementation
- Uses AWS SDK v3 streaming capabilities
- Pipe streaming responses directly from Bedrock to client
- Preserves streaming format matching OpenAI API
- Handles backpressure and connection interruptions

## DynamoDB Configuration

### Tables
- **Sessions**: Stores MCP session information
  - On-demand capacity for zero-cost-at-rest
  - Time-to-live (TTL) for automatic cleanup
  
- **Cache**: Optional response caching
  - On-demand capacity for zero-cost-at-rest
  - Configurable TTL for cache invalidation

### Access Patterns
- Session lookup by session ID
- Cache lookup by request hash
- Token usage tracking by user/team

## Security Configuration

### IAM Roles
- Lambda execution role with minimal permissions
- Bedrock invocation permissions
- DynamoDB access for session management
- CloudWatch logging permissions

### API Authentication
- API key validation
- Optional IAM-based authentication
- API Gateway request throttling and quotas

## Deployment Topology

### Region Selection
- Primary deployment in AWS regions with Bedrock availability
- Consider client proximity for lowest latency
- Optional multi-region for high availability

### CloudFront Integration (Optional)
- Global distribution for lowest latency
- Response caching for reduced costs
- Custom domain support

## Cost Optimization

### Lambda Optimization
- Minimal memory allocation (starts at 128MB)
- Code optimization for fastest execution
- Optional provisioned concurrency for high-volume scenarios

### DynamoDB Optimization
- On-demand capacity mode (zero-cost-at-rest)
- TTL for automatic cleanup of old data
- Careful index design for cost efficiency

## Monitoring and Observability

### CloudWatch Integration
- Structured logging for all components
- Metrics for performance tracking
- Alerts for error conditions and thresholds

### X-Ray Tracing (Optional)
- Request tracing through the entire stack
- Performance analysis
- Bottleneck identification

## Deployment Configuration

### SAM Template Structure
- Main template for core components
- Nested stacks for complex resources
- Environment-specific parameters

### CI/CD Integration
- GitHub Actions workflows for automated deployment
- Testing before deployment
- Staged rollout process 