#!/bin/bash
# Local testing script for AWS Bedrock OpenAI-compatible proxy

set -e  # Exit on any error

echo "Starting local API testing..."

# Build first
echo "Building Lambda functions..."
sam build

# Start local API Gateway
echo "Starting local API Gateway..."
sam local start-api \
  --env-vars local-env.json \
  --port 3000 \
  --warm-containers EAGER

# The script will remain in this loop until terminated
echo "Local API Gateway is now running at http://localhost:3000"
echo "Press Ctrl+C to stop..." 