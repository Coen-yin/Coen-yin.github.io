# Talkie Gen AI Chat Function

This is an Appwrite cloud function that handles AI chat requests securely for the Talkie Gen AI application.

## Features

- Secure API key handling (server-side only)
- Support for both Free and Pro user types with different AI capabilities
- Comprehensive error handling and logging
- CORS support for browser compatibility
- Rate limiting protection
- Content filtering and safety guidelines

## Environment Variables

The following environment variable must be set in your Appwrite function:

- `GROQ_API_KEY`: Your Groq API key for accessing the AI model

## Deployment Instructions

### 1. Using Appwrite Console

1. Log in to your Appwrite Console
2. Navigate to **Functions**
3. Click **Create Function**
4. Choose **Node.js 18.0** as the runtime
5. Upload the contents of this directory (index.js and package.json)
6. Set the environment variable `GROQ_API_KEY` with your API key
7. Set the entry point to `index.js`
8. Deploy the function

### 2. Using Appwrite CLI

```bash
# Install Appwrite CLI if not already installed
npm install -g appwrite-cli

# Login to your Appwrite account
appwrite login

# Initialize your project (if not already done)
appwrite init function

# Deploy the function
appwrite functions createDeployment \
  --functionId=[YOUR_FUNCTION_ID] \
  --entrypoint=index.js \
  --code=.

# Set the environment variable
appwrite functions updateVariable \
  --functionId=[YOUR_FUNCTION_ID] \
  --key=GROQ_API_KEY \
  --value=[YOUR_GROQ_API_KEY]
```

## API Usage

### Endpoint
POST to your function's execution URL

### Request Body
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "userType": "free" // or "pro"
}
```

### Response
```json
{
  "success": true,
  "message": "Hello! I'm doing well, thank you for asking...",
  "model": "openai/gpt-oss-120b",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details"
}
```

## Security Features

- API key is stored securely in environment variables
- No sensitive data exposed to client-side code
- Input validation and sanitization
- Rate limiting protection via Groq API
- CORS headers properly configured

## Function Configuration

- **Runtime**: Node.js 18.0+
- **Memory**: 256MB (recommended)
- **Timeout**: 30 seconds
- **Entry Point**: index.js

## Local Development

To test locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   ```bash
   export GROQ_API_KEY=your_api_key_here
   ```

3. Create a test script to call your function locally

## Monitoring

Monitor your function performance through the Appwrite Console:
- Execution logs
- Error rates
- Response times
- Resource usage

## Troubleshooting

### Common Issues

1. **Function timeout**: Increase timeout in function settings
2. **Memory issues**: Increase memory allocation
3. **API key errors**: Verify environment variable is set correctly
4. **CORS errors**: Ensure headers are properly set (already configured)

### Debug Mode

Add debugging by setting log statements:
```javascript
console.log('Debug info:', debugData);
```

Logs are available in the Appwrite Console under Function Logs.