#!/bin/bash
# Simple deploy script for Prosser (single deployment approach)

set -e  # Exit on any error

STACK_NAME="prosser"

echo "Deploying Prosser..."

# Validate template
echo "Validating SAM template..."
sam validate

# Build
echo "Building Lambda functions..."
sam build

# Deploy 
echo "Deploying stack $STACK_NAME..."
sam deploy \
  --stack-name $STACK_NAME \
  --no-confirm-changeset

echo "Deployment completed!"
echo "Your API is now available at the URL shown in the outputs above." 