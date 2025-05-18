#!/bin/bash
# Deploy script for AWS Bedrock OpenAI-compatible proxy

set -e  # Exit on any error

# Default environment is dev
ENVIRONMENT=${1:-dev}
STACK_NAME="bedrock-proxy-$ENVIRONMENT"

echo "Deploying to $ENVIRONMENT environment..."

# Validate template
echo "Validating SAM template..."
sam validate

# Build
echo "Building Lambda functions..."
sam build

# Deploy 
echo "Deploying stack $STACK_NAME..."
if [ "$ENVIRONMENT" = "production" ]; then
  # Deploy with production parameters
  sam deploy \
    --stack-name $STACK_NAME \
    --no-confirm-changeset \
    --parameter-overrides "$(cat infra/parameters/prod.json)"
else
  # Deploy with dev parameters
  sam deploy \
    --stack-name $STACK_NAME \
    --no-confirm-changeset \
    --parameter-overrides "$(cat infra/parameters/dev.json)"
fi

echo "Deployment to $ENVIRONMENT completed!" 