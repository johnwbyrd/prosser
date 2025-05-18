# AWS Bedrock MCP and OpenAI API Proxy

## Project Overview

This project implements a serverless bridge connecting modern AI-powered development tools to AWS Bedrock models through dual interfaces: the Model Context Protocol (MCP) and an OpenAI-compatible API. It enables developers to leverage AWS Bedrock's powerful AI models directly within coding environments like Cursor IDE and Visual Studio Code, while maintaining a zero-cost-at-rest infrastructure.

## Core Requirements

### 1. AWS Bedrock Integration

- **Bedrock Model Access**: Connect to and utilize all available AWS Bedrock models, including Claude, Titan, and others
- **Authentication**: Securely manage Bedrock API credentials through AWS IAM roles
- **Model Parameter Control**: Support fine-tuning of all relevant model parameters (temperature, top_p, etc.)
- **Response Streaming**: Implement streaming responses for real-time interaction
- **Token Usage Tracking**: Monitor and report on token consumption for cost awareness

### 2. OpenAI API Compatibility Layer

- **API Endpoint Parity**: Implement OpenAI-compatible endpoints (/v1/chat/completions, /v1/completions, /v1/models)
- **Request Format Compatibility**: Accept requests in OpenAI format and transform them for Bedrock
- **Response Format Compatibility**: Transform Bedrock responses back to OpenAI format
- **Model Mapping**: Provide configurable mapping between OpenAI model names and Bedrock models
- **Error Handling**: Translate Bedrock errors into OpenAI-compatible error responses

### 3. Model Context Protocol (MCP) Server

- **MCP Protocol Compliance**: Fully implement the MCP specification for tool discovery and execution
- **IDE Integration**: Enable seamless integration with Cursor IDE and VS Code
- **Codebase Interaction**: Allow the AI to browse, search, and understand local code repositories
- **Command Execution**: Enable running of development commands (build, test, lint) with output capture
- **Code Editing**: Support AI-assisted code modifications and generation
- **Project Context**: Provide tools for understanding project structure and dependencies
- **Transport Options**: Support HTTP and SSE transport mechanisms for different client needs

### 4. Development Environment Intelligence

- **File System Access**: Tools for listing directories and reading file contents
- **Code Search**: Capability to search across codebase with pattern matching
- **Code Analysis**: Tools for parsing and understanding code structure
- **Command Execution**: Securely run local development commands and capture output
- **Terminal Integration**: Interact with command-line interfaces
- **Environment Inspection**: Analyze development environment and dependencies

### 5. AWS Infrastructure

- **Serverless Architecture**: Implement using AWS Lambda and API Gateway
- **Zero-Cost-at-Rest**: Ensure no costs are incurred when the system is idle
- **Custom Domain Support**: Enable custom domain names via Route 53
- **Secure Deployment**: Implement proper IAM roles with least privilege
- **Easy Deployment/Undeployment**: Create simple deployment and cleanup processes with AWS SAM

### 6. Security Requirements

- **API Key Management**: Secure handling of API credentials
- **Access Control**: Properly scoped permissions for all components
- **Command Execution Safety**: Whitelist-based restrictions on executable commands
- **File System Safety**: Controls on accessible directories and files
- **Request Validation**: Thorough validation of all incoming requests
- **Rate Limiting**: Protection against excessive usage
- **Secure Communications**: HTTPS for all endpoints

### 7. User Experience

- **Simple Setup**: Straightforward deployment process with minimal steps
- **Client Configuration**: Clear instructions for configuring Cursor IDE and VS Code
- **Customization Options**: Configurable model preferences and behavior
- **Troubleshooting**: Comprehensive error messages and debugging guidance
- **Documentation**: Thorough user guides and reference materials

### 8. Performance and Reliability

- **Cold Start Optimization**: Minimize Lambda cold start latency
- **Error Resilience**: Graceful handling of service disruptions
- **Efficient Processing**: Optimize request/response handling for speed
- **Scalability**: Support for concurrent usage

## Success Criteria

1. A developer can deploy the complete system with a single command using AWS SAM
2. Cursor IDE can connect to the MCP server and utilize it for code browsing, analysis, and editing
3. VS Code (with GitHub Copilot) can connect to the MCP server in agent mode
4. Applications using the OpenAI API can be redirected to use AWS Bedrock models without code changes
5. The system incurs zero costs when not actively processing requests
6. The AI can effectively analyze code, suggest improvements, and implement changes
7. The system can be completely removed with a single command when no longer needed
8. All interactions are secure, with proper authentication and authorization

This project aims to create a bridge that gives developers the best of both worlds: the powerful capabilities of AWS Bedrock models with the familiar interfaces of popular development tools, all while maintaining security, cost efficiency, and ease of use.