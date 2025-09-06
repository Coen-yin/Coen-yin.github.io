# Deployment Guide: Migrating to Appwrite Functions

This guide explains how to deploy the Talkie Gen AI chat function to Appwrite and update the client-side code.

## Overview

The migration moves the AI functionality from client-side (exposing API keys) to server-side (secure) using Appwrite Functions.

### What's Changed

- ✅ **Removed**: Exposed Groq API key from client-side code
- ✅ **Added**: Secure Appwrite function (`functions/ai-chat/`)
- ✅ **Updated**: Client-side code to call Appwrite function instead of direct API
- ✅ **Maintained**: All existing functionality and user experience

## Step 1: Set Up Appwrite Project

1. **Create Appwrite Account** (if you don't have one):
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io)
   - Sign up for a free account

2. **Create New Project**:
   - Click "Create Project"
   - Name it "Talkie Gen AI"
   - Note down your **Project ID**

## Step 2: Deploy the Function

### Option A: Using Appwrite Console (Recommended)

1. **Navigate to Functions**:
   - In your Appwrite Console, go to "Functions" in the sidebar
   - Click "Create Function"

2. **Configure Function**:
   - **Name**: `ai-chat`
   - **Function ID**: `ai-chat` (or note what you choose)
   - **Runtime**: `Node.js 18.0`
   - **Entry Point**: `index.js`

3. **Upload Code**:
   - Create a ZIP file with `functions/ai-chat/index.js` and `functions/ai-chat/package.json`
   - Upload the ZIP file
   - Or copy-paste the code from the files

4. **Set Environment Variables**:
   - Go to "Settings" → "Variables"
   - Add variable: `GROQ_API_KEY` = `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`

5. **Deploy**:
   - Click "Deploy" and wait for completion
   - Note down the **Function URL**

### Option B: Using Appwrite CLI

```bash
# Install CLI
npm install -g appwrite-cli

# Login
appwrite login

# Set up your project
appwrite init project

# Create function
appwrite functions create \
  --functionId=ai-chat \
  --name="AI Chat Function" \
  --runtime=node-18.0 \
  --entrypoint=index.js

# Deploy code
cd functions/ai-chat
appwrite functions createDeployment \
  --functionId=ai-chat \
  --entrypoint=index.js \
  --code=.

# Set environment variable
appwrite functions createVariable \
  --functionId=ai-chat \
  --key=GROQ_API_KEY \
  --value=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
```

## Step 3: Update Client Configuration

1. **Get Function URL**:
   - In Appwrite Console → Functions → ai-chat
   - Copy the "Endpoint URL"
   - It looks like: `https://[PROJECT_ID].appwrite.global/functions/[FUNCTION_ID]/executions`

2. **Update script.js**:
   ```javascript
   // Replace this line in script.js:
   const APPWRITE_FUNCTION_URL = 'https://[YOUR_APPWRITE_PROJECT_ID].appwrite.global/functions/[YOUR_FUNCTION_ID]/executions';
   
   // With your actual URL:
   const APPWRITE_FUNCTION_URL = 'https://675c8f3f003d40e8d9c5.appwrite.global/functions/ai-chat/executions';
   ```

3. **Disable Development Mode**:
   ```javascript
   // Change this line:
   const DEVELOPMENT_MODE = true;
   
   // To:
   const DEVELOPMENT_MODE = false;
   ```

4. **Remove API Key** (IMPORTANT for security):
   ```javascript
   // Remove or comment out this line:
   // const GROQ_API_KEY = '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';
   ```

## Step 4: Test the Integration

1. **Open the website** in your browser
2. **Start a new chat** and send a message
3. **Check browser console** for any errors
4. **Verify AI responses** are working correctly

### Troubleshooting

If you see errors:

1. **Function not found (404)**:
   - Double-check the APPWRITE_FUNCTION_URL
   - Ensure function is deployed and active

2. **CORS errors**:
   - Function should handle CORS automatically
   - Try accessing from the same domain

3. **Function timeout**:
   - Check Appwrite Console → Functions → Logs
   - Increase function timeout if needed

4. **API key errors**:
   - Verify GROQ_API_KEY is set in function environment variables
   - Check function logs for details

## Step 5: Production Deployment

1. **Remove development fallback**:
   - Set `DEVELOPMENT_MODE = false`
   - Remove the `GROQ_API_KEY` line from script.js
   - Remove the `callGroqDirectly` function

2. **Test thoroughly**:
   - Test with both free and pro users
   - Test error scenarios
   - Verify no API keys are exposed in client code

3. **Deploy to production**:
   - Push changes to your GitHub Pages repository
   - Monitor function usage in Appwrite Console

## Security Benefits

After migration:
- ✅ API key is secure on server-side
- ✅ Rate limiting handled by Appwrite
- ✅ Request logging and monitoring
- ✅ Centralized error handling
- ✅ Function-level access controls

## Cost Considerations

- Appwrite Functions: Free tier includes generous limits
- Function executions are metered (check pricing)
- Consider implementing client-side caching for repeated requests

## Monitoring

Monitor your function:
1. **Appwrite Console** → Functions → ai-chat → Logs
2. **Usage Statistics** for call volume
3. **Error Rates** and response times

## Next Steps

After successful deployment:
1. Consider implementing request caching
2. Add function-level rate limiting
3. Implement user authentication for enhanced security
4. Monitor and optimize function performance