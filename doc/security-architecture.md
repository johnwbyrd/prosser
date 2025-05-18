# Security Architecture

## Overview
This document outlines the essential security components for the AWS Bedrock OpenAI-compatible API proxy service, focusing on the most critical security aspects.

## Authentication and Authorization

### API Key Management
- **Generation**: API keys will be generated using a CSPRNG with sufficient entropy (256-bit)
- **Storage**: Keys stored only as salted SHA-256 hashes in DynamoDB
- **Distribution**: Initial keys delivered via secure channel (AWS Console or encrypted email)
- **Rotation**: 90-day rotation policy with 2-week overlap period for transition
- **Revocation**: Immediate revocation capability with audit logging

### AWS IAM Configuration
- **Service Roles**:
  - `bedrock-proxy-api-role`: Limited permissions to invoke Lambdas and log to CloudWatch
  - `bedrock-proxy-lambda-role`: Permissions to invoke Bedrock models and access DynamoDB
  - `bedrock-proxy-metrics-role`: Read-only access to usage metrics
  
- **Principle of Least Privilege**:
  - Resource-level policies with specific ARN restrictions
  - Scoped permissions using conditions (e.g., `aws:SourceIp`, `aws:RequestedRegion`)
  - Time-bound permissions for administrative access

- **Cross-Account Configuration**:
  - Trust relationships for enterprise customer AWS accounts
  - Role assumption with external ID requirement
  - Cross-account access for centralized logging (optional)

## Multi-tenant Considerations

### Tenant Isolation
- **Logical Isolation**: Each tenant identified by unique account ID
- **Request Tracking**: All API calls tagged with tenant identifier
- **Resource Limits**: Per-tenant quotas enforced at API Gateway and Lambda levels

### Resource Partitioning
- **Data Partitioning**: DynamoDB partition keys based on tenant ID
- **Log Segregation**: Tenant-specific log groups with access controls
- **Cost Attribution**: Usage metrics and CloudWatch dashboards partitioned by tenant

### Key Separation
- **Tenant Keys**: Each tenant has unique API keys with individual permissions
- **Key Scoping**: API keys can be restricted to specific endpoints or rate limits
- **Tenant-specific Configuration**: Separate configuration items in parameter store by tenant

## Client-Side Security Boundaries

### MCP Integration Security
- **Command Execution Limits**: Restrict permitted operations based on client authorization level
- **Filesystem Access Controls**: Enforce read-only access to non-critical paths
- **Permission Prompting**: Require explicit user confirmation for sensitive operations
- **Tool Call Validation**: Verify tool calls against allowed list before execution

## CI/CD Security

### GitHub Secrets Integration
- **Secret Storage**: API keys and AWS credentials stored as encrypted GitHub secrets
- **Environment Separation**: Different secret sets for dev/staging/production environments
- **Secret Injection**: GitHub Action workflows use secrets via secure environment variables
- **Rotation Automation**: Scheduled workflows to rotate GitHub-stored credentials

### Deployment Security
- **Infrastructure as Code**: All IAM configurations managed through SAM/CloudFormation templates
- **Pipeline Validation**: Security checks integrated into CI/CD pipeline (cfn-lint, cfn-nag)
- **Automated Testing**: Automated security scanning before deployment to production

## Implementation Priority
1. AWS IAM configuration - foundational for secure service operation
2. API key management - required for secure client interactions
3. Multi-tenant isolation - critical for SaaS deployment model
4. GitHub secrets integration - needed for secure CI/CD operation
5. Client-side security boundaries - important for secure MCP integration

## References
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Multi-Tenant SaaS Reference](https://aws.amazon.com/solutions/implementations/saas-tenant-isolation/) 