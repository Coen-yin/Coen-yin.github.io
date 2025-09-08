# Admin Login Troubleshooting Guide

## Admin Account Details
- **Email**: `coenyin9@gmail.com`
- **Password**: `Carronshore93`
- **Account Type**: Owner with Administrator and Pro privileges
- **Authentication**: Powered by Appwrite

## Quick Fix Steps

If you're experiencing login issues, try these steps in order:

### Step 1: Create Owner Account (First Time Setup)
1. Go to the website and click **Sign Up**
2. Enter the following details:
   - **Name**: Coen Yin (or any name you prefer)
   - **Email**: `coenyin9@gmail.com`
   - **Password**: `Carronshore93`
   - **Confirm Password**: `Carronshore93`
3. Click **Create Account**
4. Owner privileges will be automatically assigned

### Step 2: Sign In to Existing Account
1. Click **Sign In** on the website
2. Enter:
   - **Email**: `coenyin9@gmail.com` 
   - **Password**: `Carronshore93`
3. Click **Sign In**

### Step 3: Hard Refresh
1. Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac) to hard refresh
2. Try logging in again

### Step 4: Check Browser Console
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for any error messages
4. Refresh the page and check console for initialization messages

### Step 5: Verify Appwrite Connection
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Type: `checkAdminAccount()`
4. Press Enter
5. You should see Appwrite connection status and current user info

## Expected Behavior

When login is successful, you should see:
- ✅ User avatar changes from "G" (Guest) to "C" (Coen)
- ✅ Status shows "Coen Yin Owner" (with Owner badge)
- ✅ User status shows "Owner"
- ✅ Success toast: "Welcome back, Coen Yin!"
- ✅ Admin Panel option appears in user menu
- ✅ Owner theme becomes available in theme toggle

## Common Issues & Solutions

### Issue: "Invalid email or password"
- **Cause**: Wrong credentials or account doesn't exist in Appwrite
- **Solution**: Create the account first using Sign Up, then try logging in

### Issue: Login button doesn't respond
- **Cause**: JavaScript errors or blocked Appwrite requests
- **Solution**: Check console for errors, ensure network connectivity

### Issue: Account created but no admin privileges
- **Cause**: Different email used (case sensitive)
- **Solution**: Must use exactly `coenyin9@gmail.com` (lowercase)

### Issue: "Network error" or connection issues
- **Cause**: Appwrite service unavailable or network restrictions
- **Solution**: Check internet connection, try different network, or contact admin

## Browser Compatibility

The admin system works best with:
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ All modern browsers with JavaScript enabled

## Technical Details

The admin system now:
- Uses Appwrite for secure user authentication
- Automatically assigns owner privileges to `coenyin9@gmail.com`
- Stores user sessions securely in Appwrite
- Maintains local user state for UI consistency
- Connects to: `https://syd.cloud.appwrite.io/v1`
- Project ID: `68bb8b8b00136de837e5`

## Admin Management Features

As the owner, you have access to:
- 👥 **User Management**: View and manage all user accounts
- 📊 **Analytics Dashboard**: Site statistics and user activity
- 🛡️ **Admin Panel**: Promote users to admin or pro status
- 🎨 **Owner Theme**: Exclusive colorful theme with special effects
- ⚙️ **System Control**: Full access to all administrative functions

## Still Having Issues?

If none of the above steps work:
1. Try a different browser
2. Disable browser extensions temporarily  
3. Check if JavaScript is enabled
4. Try accessing from a private/incognito window
5. Verify network connection to Appwrite (https://syd.cloud.appwrite.io)
6. Contact technical support with console error messages

The admin login system is now powered by Appwrite for enhanced security and reliability. All user data is stored securely in the cloud while maintaining the same user experience.