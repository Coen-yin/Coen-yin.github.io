# Deployment Checklist

## Pre-Deployment
- [ ] Appwrite account created
- [ ] New project created in Appwrite Console
- [ ] Project ID noted down

## Function Deployment
- [ ] Navigate to Functions in Appwrite Console
- [ ] Create new function: `ai-chat`
- [ ] Runtime: Node.js 18.0
- [ ] Upload `functions/ai-chat/index.js` and `package.json`
- [ ] Set environment variable: `GROQ_API_KEY`
- [ ] Deploy function successfully
- [ ] Function URL copied

## Client Configuration
- [ ] Update `APPWRITE_FUNCTION_URL` in `script.js`
- [ ] Set `DEVELOPMENT_MODE = false` in `script.js`
- [ ] Remove `GROQ_API_KEY` line from `script.js`
- [ ] Remove `callGroqDirectly` function from `script.js`

## Testing
- [ ] Test new chat creation
- [ ] Test AI responses for free users
- [ ] Test AI responses for pro users
- [ ] Check browser console for errors
- [ ] Verify no API keys in client-side code

## Production
- [ ] Push changes to repository
- [ ] Monitor function logs in Appwrite Console
- [ ] Test from live website
- [ ] Verify security improvements

## Post-Deployment
- [ ] Monitor function usage and performance
- [ ] Set up alerts for function errors
- [ ] Document function URL for team
- [ ] Update project documentation

---

**Security Note**: After deployment, ensure no API keys are present in the client-side code. The Groq API key should only exist in the Appwrite function environment variables.