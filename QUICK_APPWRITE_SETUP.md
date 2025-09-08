# Quick Appwrite Setup for Talkie Gen AI

## Step 1: Create Appwrite Cloud Project

1. Go to https://cloud.appwrite.io
2. Create new project with ID: `talkie-gen-ai-prod`
3. Note the project ID (should match what's in script.js)

## Step 2: Add Platform (Critical!)

In your Appwrite console:
1. Go to **Settings** → **Platforms**
2. Click **Add Platform** → **Web**
3. Add these domains:
   - `https://coen-yin.github.io`
   - `http://localhost:8001` (for development)
   - `https://localhost:8001` (for development)

## Step 3: Create Database

1. Go to **Databases**
2. Create database with ID: `main-database`

## Step 4: Create Collections

### Users Collection (ID: `users`)
**Attributes:**
- `name` (String, Required, 255)
- `email` (Email, Required, 255) 
- `isPro` (Boolean, Default: false)
- `isAdmin` (Boolean, Default: false)
- `isOwner` (Boolean, Default: false)
- `profilePhoto` (String, Optional, 2048)
- `restrictions` (String, Optional, 5000)
- `createdAt` (DateTime, Required)
- `lastLoginAt` (DateTime, Optional)

**Indexes:**
- `email` (Key: email, Type: key, Attributes: [email])

**Permissions:**
- Create: `users`
- Read: `users` 
- Update: `users`
- Delete: `users`

### User Data Collection (ID: `user_data`)
**Attributes:**
- `chats` (String, Optional, 100000)
- `memory` (String, Optional, 50000)
- `settings` (String, Optional, 10000)
- `summaries` (String, Optional, 50000)
- `lastUpdated` (Integer, Required)
- `deviceInfo` (String, Optional, 2000)

**Permissions:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

## Step 5: Enable Authentication

1. Go to **Auth** → **Settings**
2. Enable **Email/Password** method

## Step 6: Test Setup

1. Deploy your site
2. Check browser console for "Cloud sync enabled" message
3. Try creating account - data should appear in Appwrite database

## Troubleshooting

**If still showing "Local Mode":**
1. Check browser console for specific errors
2. Verify project ID matches in script.js
3. Confirm platform domains are exactly correct
4. Try incognito mode to avoid cached errors

**Common Issues:**
- Platform domains must include protocol (https://)
- Project ID is case-sensitive
- Collections must exist before app tries to use them