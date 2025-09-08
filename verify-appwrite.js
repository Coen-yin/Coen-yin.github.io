// Appwrite Configuration Verification Script
// Run this in browser console to verify your Appwrite setup

async function verifyAppwriteSetup() {
    console.log('🔍 Verifying Appwrite Configuration...');
    console.log('==========================================');
    
    // Check if Appwrite SDK is loaded
    if (typeof Appwrite === 'undefined') {
        console.error('❌ Appwrite SDK not loaded');
        console.log('💡 Make sure the Appwrite CDN is accessible');
        return false;
    }
    
    console.log('✅ Appwrite SDK loaded successfully');
    
    // Check configuration values
    console.log('📍 Project ID:', APPWRITE_PROJECT_ID);
    console.log('🌐 Endpoint:', APPWRITE_ENDPOINT);
    
    try {
        // Initialize client
        const client = new Appwrite.Client();
        client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
        
        const account = new Appwrite.Account(client);
        const databases = new Appwrite.Databases(client);
        
        console.log('✅ Appwrite client initialized');
        
        // Test connection
        try {
            await account.get();
            console.log('✅ Appwrite connection successful (user logged in)');
        } catch (error) {
            if (error.code === 401) {
                console.log('✅ Appwrite connection successful (no active session)');
            } else {
                throw error;
            }
        }
        
        // Test database access
        try {
            await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, []);
            console.log('✅ Database and collections accessible');
        } catch (error) {
            console.error('❌ Database access failed:', error.message);
            console.log('💡 Check that database and collections exist');
            console.log('💡 Verify collection permissions');
        }
        
        console.log('==========================================');
        console.log('🎉 Appwrite setup verification complete!');
        return true;
        
    } catch (error) {
        console.error('❌ Appwrite setup verification failed:', error);
        console.log('💡 Common fixes:');
        console.log('   - Verify project ID is correct');
        console.log('   - Check platform domains in Appwrite console');
        console.log('   - Ensure database and collections exist');
        console.log('   - Verify network connectivity');
        return false;
    }
}

// Auto-run verification if this script is run directly
if (typeof window !== 'undefined' && window.console) {
    console.log('🔧 Appwrite verification script loaded');
    console.log('📞 Run verifyAppwriteSetup() to test your configuration');
}