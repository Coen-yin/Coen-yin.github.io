# Appwrite Setup Guide for Talkie Gen AI

This application is now configured to use Appwrite cloud authentication exclusively (no localStorage fallback).

## Current Configuration

The application is pre-configured with:
- **Project ID**: `68bb8b8b00136de837e5`
- **Database ID**: `68bee8a90023e3b30eeb` (named "auth")
- **Endpoint**: `https://cloud.appwrite.io/v1`

## Database Structure

The application expects the following collections in the "auth" database:

### Add Platform (Web App)

1. In your Appwrite console, go to **Settings** → **Platforms**
2. Click **Add Platform** → **Web**
3. Add your domain(s):
   - `https://yourdomain.com` (production)
   - `https://coen-yin.github.io` (GitHub Pages)
   - `http://localhost:8001` (development)

## Required Collections

Create the following collections in the "auth" database (`68bee8a90023e3b30eeb`):

#### 1. Users Collection (`users`)

**Attributes:**
- `name` (String, Required, Size: 255)
- `email` (Email, Required, Size: 255)
- `isPro` (Boolean, Default: false)
- `isAdmin` (Boolean, Default: false) 
- `isOwner` (Boolean, Default: false)
- `profilePhoto` (String, Optional, Size: 2048)
- `restrictions` (String, Optional, Size: 5000) - JSON object
- `createdAt` (DateTime, Required)
- `lastLoginAt` (DateTime, Optional)

**Indexes:**
- `email` (Key: email, Type: key, Attributes: [email])

**Permissions:**
- **Create**: `users`
- **Read**: `users`
- **Update**: `users` 
- **Delete**: `users`

#### 2. User Data Collection (`user_data`)

**Attributes:**
- `chats` (String, Optional, Size: 100000) - JSON object
- `memory` (String, Optional, Size: 50000) - JSON object
- `settings` (String, Optional, Size: 10000) - JSON object
- `summaries` (String, Optional, Size: 50000) - JSON object
- `lastUpdated` (Integer, Required)
- `deviceInfo` (String, Optional, Size: 2000) - JSON object

**Permissions:**
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`
- **Delete**: `users`

#### 3. Stats Collection (`stats`) - Optional

**Attributes:**
- `totalVisits` (Integer, Default: 0)
- `uniqueVisitors` (Integer, Default: 0)
- `dailyVisits` (String, Optional, Size: 10000) - JSON object
- `lastUpdate` (DateTime, Required)

**Permissions:**
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`

## Important Notes

### Cloud-Only Mode
This application **requires** Appwrite cloud authentication and **does not** fall back to localStorage. Users must have:
- Active internet connection
- Access to Appwrite cloud services
- Properly configured Appwrite project

### No Local Storage Fallback
Unlike previous versions, this application will show a "Service Unavailable" error if:
- Appwrite SDK cannot be loaded
- Project is not properly configured  
- Network connectivity issues prevent cloud access

## Troubleshooting

### Enable Email/Password Auth

1. Go to **Auth** → **Settings**
2. Enable **Email/Password** authentication method
3. Configure session settings as needed

### Optional: Google OAuth Setup

1. Go to **Auth** → **Settings** 
2. Enable **Google** OAuth provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Update the Google client ID in `script.js`:

```javascript
const GOOGLE_CLIENT_ID = 'your-google-oauth-client-id.apps.googleusercontent.com';
```

## Step 5: Test the Setup

1. Deploy your updated code
2. Try creating a new account
3. Check if you see "🌟 Cloud sync enabled" in success messages
4. Verify data appears in your Appwrite database

## Troubleshooting

### Common Issues

**"Collection not found" errors:**
- Verify collection IDs match the constants in script.js
- Check that collections exist in the correct database

**Permission errors:**
- Ensure all collections have proper permissions set
- Make sure users can create, read, update their own documents

**Authentication errors:**
- Verify platform domains are correctly configured
- Check that the project ID is correct

**CDN/Loading issues:**
- If Appwrite SDK fails to load, the app will automatically fall back to localStorage
- Check browser console for specific error messages

### Fallback Behavior

The application is designed to work in **three modes**:

1. **🌟 Cloud Sync Mode**: Full Appwrite integration working
2. **💾 Local Storage Mode**: Appwrite unavailable, data stored locally  
3. **🔄 Hybrid Mode**: Some features work with Appwrite, others fall back to local

The app will automatically detect which mode to use and inform users accordingly.

## Security Notes

- Never commit sensitive credentials to version control
- Use environment variables for production deployments
- Regularly review and update permissions
- Monitor usage through Appwrite analytics

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Appwrite project configuration
3. Test with a fresh browser session
4. Refer to [Appwrite Documentation](https://appwrite.io/docs)

The authentication system is designed to be resilient - if Appwrite is unavailable, users can still sign up and log in using localStorage until cloud sync is restored.