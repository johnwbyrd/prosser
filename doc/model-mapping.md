# Model Mapping Reference

## Overview
This document defines mappings between OpenAI API models and AWS Bedrock models, including parameter translations, response format transformations, and implementation guidance for the proxy service.

## OpenAI to AWS Bedrock Model Mapping

### GPT Models to Claude Equivalent

| OpenAI Model | AWS Bedrock Model | Description |
|--------------|-------------------|-------------|
| gpt-4, gpt-4-0613 | anthropic.claude-3-opus-20240229-v1:0 | Highest capability Claude model for complex reasoning |
| gpt-4-32k, gpt-4-32k-0613 | anthropic.claude-3-opus-20240229-v1:0 | High context window capability |
| gpt-4-0125-preview | anthropic.claude-3-sonnet-20240229-v1:0 | Good balance of capability and cost |
| gpt-3.5-turbo, gpt-3.5-turbo-0613 | anthropic.claude-3-haiku-20240307-v1:0 | Fast, cost-effective model for simpler tasks |
| gpt-3.5-turbo-16k, gpt-3.5-turbo-16k-0613 | anthropic.claude-3-haiku-20240307-v1:0 | Medium context window capability |

### GPT Models to Llama 3 Equivalent

| OpenAI Model | AWS Bedrock Model | Description |
|--------------|-------------------|-------------|
| gpt-4 | meta.llama3-70b-instruct-v1:0 | High capability open model for complex reasoning |
| gpt-3.5-turbo | meta.llama3-8b-instruct-v1:0 | Fast, cost-effective open model |

### Special Purpose Models

| OpenAI Model | AWS Bedrock Model | Description |
|--------------|-------------------|-------------|
| text-embedding-ada-002 | amazon.titan-embed-text-v1 | Text embedding model |
| text-embedding-3-small | amazon.titan-embed-text-v2:0 | Improved text embedding model |
| text-embedding-3-large | cohere.embed-english-v3 | High performance text embedding model |
| dall-e-3 | stability.stable-diffusion-xl-v1 | Image generation model |

## Parameter Translation

### Common Parameters

| OpenAI Parameter | AWS Bedrock Parameter | Applicable Models | Notes |
|------------------|----------------------|-------------------|-------|
| model | modelId | All | Maps to corresponding AWS model ID |
| temperature | temperature | All | Direct mapping (0-2 → 0-1 for some models) |
| top_p | top_p | All | Direct mapping (0-1) |
| max_tokens | max_tokens_to_sample | Claude | Direct mapping |
| max_tokens | maxTokenCount | Llama, Mistral | Direct mapping |
| n | - | - | Not directly supported; requires multiple API calls |
| stream | stream | All | Direct boolean mapping |
| stop | stop_sequences | Claude | Array of strings |
| stop | stop | Llama, Mistral | Array of strings |
| presence_penalty | - | - | Not directly supported in Bedrock |
| frequency_penalty | - | - | Not directly supported in Bedrock |
| logit_bias | - | - | Not directly supported in Bedrock |

### Model-Specific Parameters

#### Claude Models

| OpenAI Parameter | Claude Parameter | Notes |
|------------------|-----------------|-------|
| messages | anthropic_version, messages | Requires format conversion and anthropic_version="bedrock-2023-05-31" |
| system (in messages) | system | Extracted from messages array |
| - | top_k | Claude-specific, optional |

#### Llama 3 Models

| OpenAI Parameter | Llama Parameter | Notes |
|------------------|---------------|-------|
| messages | prompt | Requires format conversion to Llama chat format |
| - | max_gen_len | Llama-specific, optional |

#### Mistral Models

| OpenAI Parameter | Mistral Parameter | Notes |
|------------------|-----------------|-------|
| messages | prompt | Requires format conversion to Mistral chat format |
| - | topK | Mistral-specific, optional |
| - | seed | Mistral-specific, optional for reproducibility |

## Response Format Transformation

### Token Usage Counting
- OpenAI response includes `{prompt_tokens, completion_tokens, total_tokens}`
- Bedrock models return varying usage information:
  - Claude: `{input_tokens, output_tokens}`
  - Llama/Mistral: No direct token count (must be estimated)

### Completion Formatting
- OpenAI: `{id, object, created, model, choices[{message, finish_reason}], usage}`
- Claude: `{id, completion, stop_reason}`
- Llama: `{generation, prompt_token_count, generation_token_count, stop_reason}`
- Mistral: `{outputs[{text}]}`

### Streaming Response
- OpenAI: Chunks with partial deltas
- Bedrock: Model-specific formats requiring conversion to match OpenAI chunk format

## Prompt Engineering Adaptations

### System Prompt Handling
- Claude: Dedicated system parameter
- Llama/Mistral: System messages incorporated into prompt with specific formatting

### Tool/Function Calling
- Claude: Supports JSON mode and tool use
- Llama: Limited structured output
- Mistral: JSON output via special prompting

## Model Configuration

### Default Configuration
- Temperature: 0.7
- Top-p: 0.95
- Max context window varies by model mapping
- Rate limiting appropriate to each Bedrock model's capacity

## Fallback Strategy
- Primary/secondary model configuration based on capability similarity
- Error handling with automatic retry on appropriate alternative models
- HTTP 429 (rate limit) triggers automatic downgrade to less capable but more available models

## Versioning and Updates
- Model version tracking via modelId versioning in Bedrock
- Mapping updates recommended monthly based on new model releases
- Deprecation notices to be issued 60 days before removing support for legacy mappings

## Appendix
- Complete mapping table
- Performance benchmarks
- Token cost comparison 