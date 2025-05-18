# CloudWatch Metrics Observability Plan

## Purpose
This document outlines the implementation of AWS CloudWatch metrics for monitoring the AWS Bedrock OpenAI-compatible API proxy service, with specific focus on tracking:
- Per-account usage and costs
- API performance and reliability
- Model usage patterns
- Error rates and types

## CloudWatch Metrics Implementation

### Standard Service Metrics

#### API Gateway Metrics
| Metric Name | Description | Dimension | Statistical Function |
|------------|-------------|-----------|---------------------|
| Count | Total number of API requests | ApiId, Stage, Resource, Method | SUM |
| Latency | Request latency in ms | ApiId, Stage, Resource, Method | AVG, P90, P99 |
| IntegrationLatency | Backend processing latency | ApiId, Stage, Resource, Method | AVG, P90, P99 |
| 4XXError | Client error count | ApiId, Stage, Resource, Method | SUM |
| 5XXError | Server error count | ApiId, Stage, Resource, Method | SUM |

#### Lambda Function Metrics
| Metric Name | Description | Dimension | Statistical Function |
|------------|-------------|-----------|---------------------|
| Invocations | Number of function invocations | FunctionName | SUM |
| Duration | Execution time in ms | FunctionName | AVG, MAX |
| Errors | Number of failed executions | FunctionName | SUM |
| Throttles | Number of throttled attempts | FunctionName | SUM |
| ConcurrentExecutions | Concurrent executions count | FunctionName | MAX |
| IteratorAge | Age of event in event source mappings | FunctionName | MAX |

#### Bedrock API Metrics
| Metric Name | Description | Dimension | Statistical Function |
|------------|-------------|-----------|---------------------|
| InvokeModel.Latency | Model invocation latency | Operation | AVG, P90, P99 |
| InvokeModel.Invocations | Model invocation count | Operation, ModelId | SUM |
| InvokeModel.ClientErrors | Client error count | Operation, ModelId | SUM |
| InvokeModel.ServerErrors | Server error count | Operation, ModelId | SUM |
| InvokeModel.Throttles | Throttling count | Operation, ModelId | SUM |

### Custom Metrics

#### Account Usage Metrics
| Metric Name | Description | Dimensions | Statistical Function |
|------------|-------------|------------|---------------------|
| AccountApiRequests | API requests per account | AccountId, ApiEndpoint | SUM |
| AccountBedrockCost | Estimated Bedrock cost per account | AccountId, ModelId | SUM |
| AccountTokensInput | Input tokens per account | AccountId, ModelId | SUM |
| AccountTokensOutput | Output tokens per account | AccountId, ModelId | SUM |
| AccountErrorRate | Error rate percentage | AccountId, ErrorType | AVG |

#### Model Usage Metrics
| Metric Name | Description | Dimensions | Statistical Function |
|------------|-------------|------------|---------------------|
| ModelInvocations | Model invocation count | ModelId, AccountId | SUM |
| AverageTokensPerRequest | Average tokens per request | ModelId, RequestType | AVG |
| ModelMappingUsage | Usage of each OpenAI to Bedrock mapping | OpenAIModel, BedrockModel | SUM |
| ModelLatency | Model-specific latency | ModelId | AVG, P90, P99 |

## CloudWatch Logs Configuration

### Log Groups
1. `/aws/apigateway/bedrock-proxy-api`
2. `/aws/lambda/bedrock-proxy-handler`
3. `/aws/lambda/bedrock-proxy-authorizer`
4. `/aws/lambda/usage-metrics-processor`

### Metric Filters

#### Token Usage Filter
```
filter: [request_id, account_id, model_id, input_tokens, output_tokens, duration]
metric: AccountTokenUsage
dimensions: [AccountId, ModelId]
```

#### Cost Estimation Filter
```
filter: [request_id, account_id, model_id, estimated_cost]
metric: AccountCost
dimensions: [AccountId, ModelId]
```

#### Error Pattern Filter
```
filter: ?ERROR ?Error ?error
metric: ServiceErrors
dimensions: [ErrorType]
```

## Implementation Details

### Custom Metrics Collection Approach

The custom metrics will be collected by adding metrics reporting functionality directly within the existing Lambda functions that handle API requests. This approach:

1. **Integrates with Request Processing**: 
   - Metrics collection occurs as part of normal request processing
   - No separate service or middleware Lambda required
   - Minimal performance impact on request handling

2. **Captures Key Data Points**:
   - Account ID from the authentication context
   - Model ID from the request parameters
   - Input and output token counts from Bedrock responses
   - Calculated cost estimation based on token usage

3. **Publishing Method**:
   - Uses AWS SDK to publish metrics to CloudWatch
   - Batches metrics where possible to reduce API calls
   - Includes structured logging for log-based metrics

4. **Token Cost Calculation**:
   - Maintains a configuration mapping of model IDs to token costs
   - Calculates estimated costs for both input and output tokens
   - Updates costs through configuration, not code changes

## CloudWatch Dashboards

### Account Usage Dashboard
- Widgets:
  - Daily API requests by account (bar chart)
  - Daily cost by account (bar chart)
  - Tokens processed by account (line chart)
  - Error rate by account (line chart)

### API Performance Dashboard
- Widgets:
  - API latency by endpoint (line chart)
  - Error rate by endpoint (line chart)
  - Lambda execution duration (line chart)
  - Concurrent Lambda executions (line chart)

### Cost Analysis Dashboard
- Widgets:
  - Total Bedrock cost over time (line chart)
  - Cost by model (pie chart)
  - Cost by account (pie chart)
  - Cost per request average (line chart)
  
## Alerts and Thresholds

### Critical Alerts
- 5XX error rate > 1% (5-minute period)
- API Latency P99 > 5000ms (5-minute period)
- Lambda throttles > 10 (5-minute period)
- Account cost > $X within 24 hours (threshold per account)

### Warning Alerts
- 4XX error rate > 5% (5-minute period)
- API Latency P90 > 2000ms (5-minute period)
- Lambda duration > 5000ms (5-minute period)
- Unusual spike in token usage (anomaly detection)

## Implementation Schedule

1. **Phase 1: Basic Metrics** (Week 1)
   - Configure standard CloudWatch metrics for all services
   - Implement basic CloudWatch dashboards
   - Set up critical alerts

2. **Phase 2: Custom Metrics** (Week 2)
   - Implement Lambda middleware for custom metrics
   - Create metric filters on log groups
   - Set up account-specific dashboards

3. **Phase 3: Cost Analysis** (Week 3)
   - Implement cost estimation logic
   - Create cost analysis dashboard
   - Configure cost-based alerts

## Maintenance and Updates

- Review and update token cost mappings monthly
- Adjust alert thresholds based on usage patterns
- Archive and rotate CloudWatch logs (7-day retention for raw logs)
- Schedule quarterly review of metrics effectiveness 