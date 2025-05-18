bedrock-mcp-proxy/
│
├── .github/                           # GitHub configurations
│   ├── workflows/                     # CI/CD workflows
│   │   ├── build.yml                  # Build pipeline
│   │   ├── test.yml                   # Test pipeline
│   │   └── deploy.yml                 # Deployment pipeline
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
├── src/                               # Source code
│   ├── common/                        # Shared code
│   │   ├── config.js                  # Configuration management
│   │   ├── logger.js                  # Logging utilities
│   │   └── errors.js                  # Error handling utilities
│   │
│   ├── openai-proxy/                  # OpenAI API compatibility layer
│   │   ├── index.js                   # Main entry point
│   │   ├── routes/                    # API route handlers
│   │   │   ├── chat.js                # Chat completions endpoint
│   │   │   ├── completions.js         # Completions endpoint
│   │   │   └── models.js              # Models endpoint
│   │   ├── middleware/                # API middleware
│   │   │   ├── auth.js                # Authentication middleware
│   │   │   └── validation.js          # Request validation middleware
│   │   └── transformers/              # Request/response transformers
│   │       ├── bedrock.js             # Bedrock-specific transformations
│   │       └── openai.js              # OpenAI-specific transformations
│   │
│   ├── mcp-server/                    # MCP server implementation
│   │   ├── index.js                   # Main entry point
│   │   ├── server.js                  # Server initialization
│   │   ├── capabilities.js            # Capability definitions
│   │   ├── tools/                     # Tool implementations
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
├── .eslintrc.js                       # ESLint configuration
├── .gitignore                         # Git ignore file
├── package.json                       # Node.js package configuration
├── samconfig.toml                     # SAM CLI configuration
├── README.md                          # Project overview
└── LICENSE                            # Project license