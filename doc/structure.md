# Project Structure

```
bedrock-mcp-proxy/
│
├── .github/                           # GitHub configurations
│   ├── workflows/                     # CI/CD workflows
│   │   ├── build.yml                  # Build and test workflow
│   │   └── deploy.yml                 # Deployment workflow
│   └── CODEOWNERS                     # Code ownership definitions
│
├── docs/                              # Documentation
│   ├── architecture.md                # System architecture document
│   ├── security.md                    # Security considerations
│   ├── cost-estimation.md             # Cost projections and analysis
│   ├── api-reference.md               # API endpoint documentation
│   ├── model-mapping.md               # Model compatibility documentation
│   ├── images/                        # Diagrams and screenshots
│   └── client-guides/                 # Client-specific setup guides
│       ├── cursor.md                  # Cursor IDE integration guide
│       └── vscode.md                  # VS Code integration guide
│
├── infra/                             # Infrastructure as code
│   ├── template.yaml                  # Main SAM template
│   ├── parameters/                    # Environment-specific parameters
│   │   ├── dev.json                   # Development parameters
│   │   └── prod.json                  # Production parameters
│   └── resources/                     # Additional CloudFormation resources
│       ├── api-gateway.yaml           # API Gateway resources
│       ├── iam.yaml                   # IAM roles and policies
│       └── custom-domain.yaml         # Route 53 and domain configuration
│
├── templates/                         # Client configuration templates
│   ├── cursor/                        # Cursor IDE templates
│   │   └── mcp.json                   # MCP configuration for Cursor
│   └── vscode/                        # VS Code templates
│       └── mcp.json                   # MCP configuration for VS Code
│
├── src/                               # Source code
│   ├── common/                        # Shared utilities
│   │   ├── config.js                  # Configuration management
│   │   ├── logger.js                  # Logging utilities
│   │   └── errors.js                  # Error handling utilities
│   │
│   ├── functions/                     # Lambda function entry points
│   │   ├── api/                       # API handlers (optimized for cold starts)
│   │   │   ├── openai-proxy.js        # OpenAI API compatibility handler
│   │   │   └── mcp-server.js          # MCP server handler
│   │   └── middlewares/               # Lambda function middlewares
│   │       ├── auth.js                # Authentication middleware
│   │       ├── error-handler.js       # Error handling middleware
│   │       └── cors.js                # CORS middleware
│   │
│   ├── openai-proxy/                  # OpenAI API compatibility service
│   │   ├── routes/                    # API route handlers
│   │   │   ├── chat.js                # Chat completions endpoint
│   │   │   ├── completions.js         # Completions endpoint
│   │   │   └── models.js              # Models endpoint
│   │   └── transformers/              # Request/response transformers
│   │       ├── bedrock.js             # Bedrock-specific transformations
│   │       └── openai.js              # OpenAI-specific transformations
│   │
│   ├── mcp-server/                    # MCP server implementation
│   │   ├── capabilities.js            # Capability definitions
│   │   ├── tools/                     # Tool implementations
│   │   │   ├── filesystem/            # Filesystem tools
│   │   │   ├── command/               # Command execution tools
│   │   │   ├── bedrock-chat.js        # Bedrock chat tool
│   │   │   └── bedrock-completion.js  # Bedrock completion tool
│   │   ├── transport/                 # Transport implementations
│   │   │   ├── http.js                # HTTP transport
│   │   │   └── sse.js                 # Server-sent events transport
│   │   └── session/                   # Session management
│   │       ├── store.js               # Session storage
│   │       └── manager.js             # Session lifecycle management
│   │
│   └── bedrock/                       # AWS Bedrock integration
│       ├── client.js                  # Bedrock client initialization
│       ├── models.js                  # Model mapping and selection
│       ├── streaming.js               # Streaming response handling
│       └── token-usage.js             # Token usage tracking
│
├── tests/                             # Tests
│   ├── unit/                          # Unit tests
│   │   ├── openai-proxy/              # OpenAI proxy tests
│   │   ├── mcp-server/                # MCP server tests
│   │   └── bedrock/                   # Bedrock integration tests
│   ├── integration/                   # Integration tests
│   │   ├── api.test.js                # API endpoint tests
│   │   └── mcp.test.js                # MCP protocol tests
│   └── mocks/                         # Test mocks and fixtures
│       ├── bedrock-responses.js       # Mock Bedrock responses
│       └── config.js                  # Test configuration
│
├── scripts/                           # Utility scripts
│   ├── deploy.sh                      # Deployment script
│   ├── undeploy.sh                    # Undeployment script
│   ├── local-test.sh                  # Local testing script
│   └── setup-dev.sh                   # Development environment setup
│
├── layers/                            # Lambda layers for dependency optimization
│   ├── core-dependencies/             # Shared dependencies for all functions
│   │   └── package.json               # Dependencies specification
│   └── mcp-dependencies/              # MCP-specific dependencies
│       └── package.json               # Dependencies specification
│
├── .eslintrc.js                       # ESLint configuration
├── .gitignore                         # Git ignore file
├── jest.config.js                     # Jest test configuration
├── package.json                       # Node.js package configuration
├── samconfig.toml                     # SAM CLI configuration
├── README.md                          # Project overview
└── LICENSE                            # Project license
```

## Key Design Considerations

### Lambda Function Organization
- Lambda functions are organized to minimize cold starts
- Common dependencies are separated into layers for optimization
- Core functionality is organized into well-defined modules

### API Gateway Integration
- Single API Gateway with multiple routes for both OpenAI API and MCP server
- Custom domain support for friendly URLs
- Appropriate CORS configuration for client integration

### Client Integration
- Configuration templates for Cursor and VS Code
- Clear separation between server-side implementation and client configuration
- Simplified setup process with ready-to-use mcp.json templates
- Sample configurations for different usage scenarios

### Performance Optimization
- Minimal dependencies in each Lambda function
- Efficient request handling for low latency
- Shared layers for common dependencies
- Stateless design for horizontal scaling

### Security Architecture
- Appropriate IAM roles with least privilege
- API key authentication
- Request validation
- Secure handling of credentials and secrets

### Deployment Strategy
- AWS SAM for infrastructure as code
- Environment-specific parameters
- CI/CD integration through GitHub Actions
- Simple deployment and cleanup scripts

This structure prioritizes serverless performance while maintaining clean separation of concerns and follows Node.js best practices for maintainability and testability.