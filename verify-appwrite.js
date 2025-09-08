// Appwrite Configuration Verification Script for Cloud-Only Mode
// Run this in browser console to verify your Appwrite setup

async function verifyAppwriteSetup() {
    console.log('🔍 Verifying Appwrite Configuration (Cloud-Only Mode)...');
    console.log('==========================================');
    
    // Expected configuration
    const expectedProjectId = '68bb8b8b00136de837e5';
    const expectedDatabaseId = '68bee8a90023e3b30eeb';
    const expectedEndpoint = 'https://cloud.appwrite.io/v1';
    
    console.log('📍 Expected Project ID:', expectedProjectId);
    console.log('🗄️ Expected Database ID:', expectedDatabaseId);
    console.log('🌐 Expected Endpoint:', expectedEndpoint);
    console.log('');
    
    // Check if Appwrite SDK is loaded
    if (typeof Appwrite === 'undefined') {
        console.error('❌ Appwrite SDK not loaded');
        console.log('💡 Make sure the Appwrite CDN is accessible');
        console.log('💡 In cloud-only mode, this will show a fatal error');
        return false;
    }
    
    console.log('✅ Appwrite SDK loaded successfully');
    
    // Check configuration values
    console.log('📍 Actual Project ID:', APPWRITE_PROJECT_ID);
    console.log('🗄️ Actual Database ID:', DATABASE_ID);
    console.log('🌐 Actual Endpoint:', APPWRITE_ENDPOINT);
    
    // Verify configuration matches expected values
    if (APPWRITE_PROJECT_ID !== expectedProjectId) {
        console.warn('⚠️ Project ID does not match expected value');
    }
    if (DATABASE_ID !== expectedDatabaseId) {
        console.warn('⚠️ Database ID does not match expected value');
    }
    if (APPWRITE_ENDPOINT !== expectedEndpoint) {
        console.warn('⚠️ Endpoint does not match expected value');
    }
    
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
        
        // Test database access for each required collection
        const requiredCollections = ['users', 'user_data', 'chats', 'stats'];
        
        for (const collectionId of requiredCollections) {
            try {
                await databases.listDocuments(DATABASE_ID, collectionId, []);
                console.log(`✅ Collection "${collectionId}" accessible`);
            } catch (error) {
                console.error(`❌ Collection "${collectionId}" access failed:`, error.message);
                console.log('💡 Check that collection exists in the "auth" database');
                console.log('💡 Verify collection permissions');
            }
        }
        
        console.log('==========================================');
        console.log('🎉 Appwrite setup verification complete!');
        console.log('💡 Note: This app runs in cloud-only mode (no localStorage fallback)');
        return true;
        
    } catch (error) {
        console.error('❌ Appwrite setup verification failed:', error);
        console.log('💡 Common fixes:');
        console.log('   - Verify project ID matches:', expectedProjectId);
        console.log('   - Check platform domains in Appwrite console');
        console.log('   - Ensure "auth" database exists with ID:', expectedDatabaseId);
        console.log('   - Verify network connectivity');
        console.log('   - In cloud-only mode, any failures will show fatal errors');
        return false;
    }
}

// Auto-run verification if this script is run directly
if (typeof window !== 'undefined' && window.console) {
    console.log('🔧 Appwrite verification script loaded (Cloud-Only Mode)');
    console.log('📞 Run verifyAppwriteSetup() to test your configuration');
}