# Talkie Gen AI

An intelligent AI chat assistant powered by OpenRouter API using the OpenAI SDK.

## Recent Changes

### OpenAI SDK Integration

The project has been updated to use the official OpenAI SDK instead of direct fetch calls, even when using OpenRouter as the API provider. This provides:

- Better type safety and error handling
- Consistent API interface
- Future-proof compatibility
- Standard OpenAI SDK patterns

### Build System

Added a build system using Rollup to bundle the OpenAI SDK for browser usage:

- `package.json` - Project dependencies and build scripts
- `rollup.config.js` - Rollup configuration for bundling
- `src/script.js` - Source code with ES6 imports
- `script.js` - Bundled output for browser

### Usage

#### Development
```bash
npm install
npm run build    # Build the project
npm run dev      # Build with watch mode
npm run serve    # Serve locally for testing
```

#### OpenAI SDK Configuration

The OpenAI SDK is configured to work with OpenRouter:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    dangerouslyAllowBrowser: true
});

// Usage
const completion = await openai.chat.completions.create({
    model: 'deepseek/deepseek-chat-v3.1:free',
    messages: messages,
    temperature: 0.3,
    max_tokens: 65536,
    top_p: 1,
    stream: false
});
```

### File Structure

```
├── src/
│   └── script.js          # Source code with ES6 imports
├── script.js              # Built bundle for browser
├── index.html             # Main HTML file
├── styles.css             # Styling
├── package.json           # Dependencies and scripts
├── rollup.config.js       # Build configuration
└── .gitignore            # Git ignore patterns
```

### Key Benefits

1. **Standards Compliance**: Uses the official OpenAI SDK patterns
2. **Error Handling**: Better error handling with proper status codes
3. **Type Safety**: Better development experience with TypeScript support
4. **Future Compatibility**: Easy to switch between different OpenAI-compatible providers
5. **Maintainability**: Standard SDK patterns make the code more maintainable

### Notes

- The `dangerouslyAllowBrowser: true` option is required for browser usage of the OpenAI SDK
- Build artifacts are excluded from git via `.gitignore`
- The original functionality remains unchanged - only the underlying API client implementation has been improved