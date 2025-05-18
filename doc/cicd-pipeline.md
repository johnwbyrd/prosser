# CI/CD Pipeline Design

## Overview
This document outlines the GitHub Actions workflows required for the AWS Bedrock OpenAI-compatible API proxy service, detailing each action's responsibilities and required permissions.

## GitHub Actions Workflow Components

### 1. Code Validation Workflow
**Trigger**: Pull requests to main, pushes to feature branches

**Actions**:
- `validate-code`: Runs ESLint, Prettier, and TypeScript type checking
- `security-scan`: Performs code security analysis using CodeQL
- `dependency-check`: Scans for vulnerable dependencies using Dependabot

**Permissions**:
- GitHub: Read access to repository code
- No AWS permissions required

### 2. Unit & Integration Test Workflow
**Trigger**: Pull requests to main, pushes to feature branches

**Actions**:
- `run-unit-tests`: Executes Jest/Mocha tests with coverage reporting
- `run-integration-tests`: Tests API functionality against mock services

**Permissions**:
- GitHub: Read access to repository code
- No AWS permissions required

### 3. Infrastructure Validation Workflow
**Trigger**: Pull requests to main, changes to SAM/CloudFormation templates

**Actions**:
- `validate-sam`: Validates SAM templates syntax and structure
- `cfn-nag`: Checks CloudFormation templates for security issues
- `cfn-lint`: Lints CloudFormation templates for best practices
- `iam-policy-check`: Analyzes IAM policies for least privilege violations

**Permissions**:
- GitHub: Read access to repository code
- No AWS permissions required

### 4. Development Deployment Workflow
**Trigger**: Pushes to main branch, manual trigger

**Actions**:
- `build-artifacts`: Compiles TypeScript, bundles Lambda functions
- `deploy-dev`: Deploys to development environment using SAM
- `run-smoke-tests`: Performs basic functionality verification

**Permissions**:
- GitHub: Read access to repository code, write access to GitHub artifacts
- AWS: Short-lived credentials with permissions for:
  - `cloudformation:*` on the dev stack resources
  - `lambda:*` for function deployment
  - `apigateway:*` for API configurations
  - `iam:PassRole` for service roles
  - `s3:*` for deployment artifacts bucket
  - `dynamodb:*` for table creation/updates
  - `logs:*` for CloudWatch log configuration
  - `bedrock:InvokeModel` for testing

### 5. Environment Deployment Workflow
**Trigger**: 
- Release branch creation (for staging)
- Release publication (for production)
- Manual trigger with environment selection

**Actions**:
- `build-artifacts`: Compiles and packages code with production settings
- `set-env-variables`: Determines environment-specific configuration
- `create-backups`: Creates backups for production deployments
- `deploy-environment`: Deploys to target environment using SAM
- `run-tests`: Performs appropriate tests for the environment
- `monitor-deployment`: For production, watches metrics and handles rollback if needed

**Permissions**:
- GitHub: Read access to repository code, write access to GitHub artifacts
- AWS: Short-lived credentials with permissions for:
  - `cloudformation:*` on the environment stack resources
  - `lambda:*` for function deployment
  - `apigateway:*` for API configurations
  - `iam:PassRole` for service roles
  - `s3:*` for deployment artifacts bucket
  - `dynamodb:*` for table operations including backups
  - `logs:*` for CloudWatch log configuration
  - `cloudwatch:*` for metrics and alarms
  - `bedrock:InvokeModel` for testing

### 6. Cleanup/Teardown Workflow
**Trigger**: Manual trigger, PR closure for ephemeral environments

**Actions**:
- `delete-stack`: Removes CloudFormation stack
- `cleanup-artifacts`: Removes deployment artifacts from S3

**Permissions**:
- GitHub: Read access to repository code
- AWS: Short-lived credentials with permissions for:
  - `cloudformation:DeleteStack` for the target environment
  - `s3:DeleteObject` for artifact cleanup

## AWS IAM Configuration

### OIDC Integration for GitHub Actions
To avoid storing long-lived AWS credentials, the pipeline will use GitHub's OIDC provider to obtain short-lived AWS credentials:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:sub": "repo:organization/repo-name:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### Role Structure
- `bedrock-proxy-cicd-dev-role`: Used for development deployments
- `bedrock-proxy-cicd-staging-role`: Used for staging deployments
- `bedrock-proxy-cicd-prod-role`: Used for production deployments with stricter permissions

Each role will have a trust relationship with the GitHub Actions OIDC provider and contain only the permissions required for that specific environment.

## Secrets Management

### Required Secrets
- `AWS_ROLE_TO_ASSUME`: ARN of the IAM role for GitHub Actions to assume
- `OPENAI_API_KEY`: For integration testing
- `TEST_ACCOUNT_ID`: For running tests against a test tenant
- `ROLLBACK_SNS_TOPIC`: SNS topic ARN for production deployment alerts

### Secrets Handling
- All secrets stored as GitHub Actions secrets
- Environment-specific secrets segregated using GitHub environments
- No hard-coded credentials in code or workflows
- Production credentials require manual approval from authorized users

## Workflow Implementation

The actual workflow implementation files are located in the `.github/workflows` directory:

- `validate-code.yml` - Code validation workflow
- `run-tests.yml` - Unit and integration tests
- `validate-infrastructure.yml` - Infrastructure validation
- `deploy-dev.yml` - Development environment deployment
- `deploy-environment.yml` - Unified staging/production deployment
- `cleanup.yml` - Environment cleanup and teardown 