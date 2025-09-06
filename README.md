# Talkie Gen AI

A modern, intelligent AI chat application powered by advanced language models.

## Deployment

This application uses GitHub Actions for automated deployment to GitHub Pages. The API key is securely managed through GitHub environment secrets.

### Setting up the GROQ_API_KEY secret

To deploy this application, you need to set up the `GROQ_API_KEY` environment secret:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Environments**
3. Create or edit the `github-pages` environment
4. Add a new secret named `GROQ_API_KEY`
5. Set the value to your actual GROQ API key
6. Save the secret

### How it works

- The source code contains a placeholder `{{GROQ_API_KEY}}` instead of the actual API key
- During the GitHub Actions build process, this placeholder is replaced with the real API key from the environment secret
- The built application is then deployed to GitHub Pages
- The API key never appears in the source code or repository history

### Manual Setup

If you want to run this locally for development:

1. Clone the repository
2. Create a copy of the site files
3. Replace `{{GROQ_API_KEY}}` in `script.js` with your actual API key
4. Serve the files using a local web server

**Important:** Never commit the actual API key to the repository!

## Features

- Intelligent AI conversations
- Memory system for personalized interactions
- Code syntax highlighting and copying
- Multiple themes (Light, Dark, Pro)
- User authentication and profiles
- Chat history management
- Export functionality
- Responsive design

## Security

- API keys are managed through GitHub environment secrets
- No sensitive data is stored in the source code
- Build-time injection ensures security while maintaining functionality