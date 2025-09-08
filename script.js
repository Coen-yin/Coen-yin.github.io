// API Configuration - Updated with working API key
const GROQ_API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Appwrite Configuration
// Update these values with your actual Appwrite project details
const APPWRITE_PROJECT_ID = 'talkie-gen-ai-prod'; // Replace with your project ID
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Use global endpoint for better connectivity

// Alternative regional endpoints (uncomment if needed):
// const APPWRITE_ENDPOINT = 'https://syd.cloud.appwrite.io/v1'; // Sydney
// const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'; // New York

// Appwrite instances
let appwrite = null;
let account = null;
let databases = null;
let isAppwriteReady = false;

// Database and Collection IDs
const DATABASE_ID = 'main-database';
const USERS_COLLECTION_ID = 'users';
const USER_DATA_COLLECTION_ID = 'user_data';
const CHATS_COLLECTION_ID = 'chats';
const STATS_COLLECTION_ID = 'stats';

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const newChatBtn = document.getElementById('newChatBtn');
const chatHistory = document.getElementById('chatHistory');
const userMenu = document.getElementById('userMenu');
const userDropdown = document.getElementById('userDropdown');
const themeToggle = document.getElementById('themeToggle');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportAllBtn = document.getElementById('exportAllBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const messagesArea = document.getElementById('messagesArea');
const typingIndicator = document.getElementById('typingIndicator');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const wordCount = document.getElementById('wordCount');
const toastContainer = document.getElementById('toastContainer');
const attachBtn = document.getElementById('attachBtn');
const voiceBtn = document.getElementById('voiceBtn');

// Settings DOM Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModalOverlay = document.getElementById('settingsModalOverlay');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');

// Memory DOM Elements
const memoryModalOverlay = document.getElementById('memoryModalOverlay');
const memoryModal = document.getElementById('memoryModal');
const closeMemoryModal = document.getElementById('closeMemoryModal');

// Share DOM Elements
const shareBtn = document.getElementById('shareBtn');
const shareModalOverlay = document.getElementById('shareModalOverlay');
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');

// Documentation DOM Elements
const docsBtn = document.getElementById('docsBtn');
const docsModalOverlay = document.getElementById('docsModalOverlay');
const docsModal = document.getElementById('docsModal');
const closeDocsModal = document.getElementById('closeDocsModal');

// Authentication DOM Elements
const authModalOverlay = document.getElementById('authModalOverlay');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const adminBtn = document.getElementById('adminBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const showSignupModal = document.getElementById('showSignupModal');
const showLoginModal = document.getElementById('showLoginModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const userAvatar = document.getElementById('userAvatar');
const displayUsername = document.getElementById('displayUsername');
const userStatus = document.getElementById('userStatus');

// Admin DOM Elements
const adminModalOverlay = document.getElementById('adminModalOverlay');
const adminModal = document.getElementById('adminModal');
const closeAdminModal = document.getElementById('closeAdminModal');

// Profile DOM Elements
const profileModalOverlay = document.getElementById('profileModalOverlay');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const profileForm = document.getElementById('profileForm');
const profilePhotoInput = document.getElementById('profilePhotoInput');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const removePhotoBtn = document.getElementById('removePhotoBtn');
const currentPhoto = document.getElementById('currentPhoto');
const photoPreview = document.getElementById('photoPreview');

// State
let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('talkie-chats') || '{}');
let isGenerating = false;
let currentUser = JSON.parse(localStorage.getItem('talkie-user') || 'null');

// Sync state management
let isOnlineMode = false; // Whether cloud sync is active
let lastSyncTime = localStorage.getItem('talkie-last-sync') || null;
let pendingSync = false; // Whether we have unsaved changes to sync

// Enhanced Context and Memory State
let userMemory = JSON.parse(localStorage.getItem('talkie-user-memory') || '{}');
let conversationSettings = JSON.parse(localStorage.getItem('talkie-conversation-settings') || JSON.stringify({
    contextLength: 10,
    responseStyle: 'balanced',
    enableMemory: true,
    enableFollowUps: true,
    personalityMode: 'friendly',
    rememberPreferences: true,
    enableWebSearch: true,
    searchBehavior: 'auto',
    showSearchResults: true
}));
let conversationSummaries = JSON.parse(localStorage.getItem('talkie-conversation-summaries') || '{}');

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAppwrite(); // Initialize Appwrite first
    initializeTheme();
    initializeAuth();
    initializeAdmin(); // Initialize admin system
    initializeGoogleAuth(); // Initialize Google OAuth
    trackVisitor(); // Track visitor statistics
    checkProUpgrade(); // Check for pro upgrade URL
    initializeMemorySystem(); // Initialize enhanced memory system
    handleDocumentationRouting(); // Handle docs URL routing
    setupEventListeners();
    loadChatHistory();
    autoResizeTextarea();
    
    // Wait for Appwrite before syncing
    setTimeout(() => {
        if (currentUser && isAppwriteReady) {
            syncUserDataFromCloud();
        }
    }, 2000);
});

// Appwrite initialization
async function initializeAppwrite() {
    console.log('🔄 Initializing Appwrite...');
    console.log('📍 Project ID:', APPWRITE_PROJECT_ID);
    console.log('🌐 Endpoint:', APPWRITE_ENDPOINT);
    
    // Check if Appwrite is loaded
    if (typeof Appwrite === 'undefined') {
        console.log('❌ Appwrite SDK not loaded - using localStorage mode');
        console.log('💡 This can happen when CDN is blocked or in offline mode');
        showAuthModeStatus('localStorage', 'Appwrite SDK not available');
        return;
    }
    
    try {
        // Initialize Appwrite client
        appwrite = new Appwrite.Client();
        appwrite
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID);
        
        // Initialize services
        account = new Appwrite.Account(appwrite);
        databases = new Appwrite.Databases(appwrite);
        
        console.log('✅ Appwrite client created successfully');
        
        // Test connection by trying to get project details
        try {
            await testAppwriteConnection();
            isAppwriteReady = true;
            isOnlineMode = true;
            console.log('🌟 Appwrite connection successful - cloud sync enabled');
            showAuthModeStatus('cloud');
            
            // Check if user is already logged in
            checkCurrentSession();
        } catch (connectionError) {
            console.error('❌ Appwrite connection test failed:', connectionError);
            console.log('💡 Possible causes:');
            console.log('   - Project does not exist');
            console.log('   - Platform domain not configured in Appwrite');
            console.log('   - Network connectivity issues');
            console.log('   - Incorrect project ID or endpoint');
            
            isAppwriteReady = false;
            isOnlineMode = false;
            showAuthModeStatus('localStorage', 'Appwrite connection test failed');
        }
        
    } catch (error) {
        console.error('❌ Appwrite initialization failed:', error);
        isAppwriteReady = false;
        isOnlineMode = false;
        showAuthModeStatus('localStorage', 'Appwrite initialization failed');
    }
}

// Test Appwrite connection
async function testAppwriteConnection() {
    if (!account) throw new Error('Account service not initialized');
    
    try {
        // Try to get current session (will fail gracefully if not logged in)
        await account.get();
        console.log('✅ Appwrite session check successful');
    } catch (error) {
        // If error is "missing scope" or similar auth error, connection is working
        if (error.code === 401 || error.code === 'unauthorized') {
            console.log('✅ Appwrite connection verified (no active session)');
            return;
        }
        // If it's a different error, connection might be broken
        throw error;
    }
}

// Show authentication mode status to user
function showAuthModeStatus(mode, errorDetails = null) {
    const indicator = document.getElementById('authModeIndicator');
    const text = document.getElementById('authModeText');
    const dot = indicator?.querySelector('.mode-dot');
    
    if (!indicator || !text || !dot) return;
    
    if (mode === 'cloud') {
        console.log('✅ Cloud sync enabled - your data will be saved to the cloud');
        indicator.style.display = 'flex';
        text.textContent = 'Cloud Sync';
        dot.className = 'mode-dot cloud';
    } else {
        console.log('💾 Local storage mode - your data will be saved locally');
        indicator.style.display = 'flex';
        text.textContent = 'Local Mode';
        dot.className = 'mode-dot';
        if (errorDetails) {
            console.log('ℹ️  Details:', errorDetails);
        }
    }
}

// Check current session
async function checkCurrentSession() {
    if (!isAppwriteReady) return;
    
    try {
        const session = await account.get();
        if (session) {
            // User is logged in, get their profile
            await loadUserFromAppwrite(session);
        }
    } catch (error) {
        console.log('No active session found');
        // Clear any local user data if session is invalid
        currentUser = null;
        localStorage.removeItem('talkie-user');
        updateUserInterface();
    }
}

// Load user data from Appwrite
async function loadUserFromAppwrite(session) {
    try {
        // Get user document from database
        const userDoc = await databases.getDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            session.$id
        );
        
        currentUser = {
            id: session.$id,
            name: userDoc.name || session.name,
            email: session.email,
            isPro: userDoc.isPro || false,
            isAdmin: userDoc.isAdmin || false,
            isOwner: userDoc.isOwner || false,
            profilePhoto: userDoc.profilePhoto || null,
            restrictions: userDoc.restrictions || {
                maxChatsPerDay: 50,
                maxMessagesPerChat: 100,
                canExportData: true,
                canUploadImages: true
            }
        };
        
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        updateUserInterface();
        initializeTheme();
        
        // Load user's data
        await syncUserDataFromCloud();
        
    } catch (error) {
        console.error('Error loading user from Appwrite:', error);
        
        // Handle different error scenarios
        if (error.code === 404) {
            console.log('User document not found, creating new one');
            await createUserDocument(session);
        } else if (error.code === 401) {
            console.log('Authentication error, session may be invalid');
            showToast('Authentication error. Please sign in again.', 'error');
            await handleLogout();
        } else {
            console.log('Database error, falling back to localStorage');
            showToast('Cloud sync temporarily unavailable. Using local storage.', 'warning');
            isAppwriteReady = false;
            
            // Create local user as fallback
            currentUser = {
                id: session.$id,
                name: session.name,
                email: session.email,
                isPro: false,
                isAdmin: false,
                isOwner: session.email === 'coenyin9@gmail.com',
                profilePhoto: null,
                restrictions: {
                    maxChatsPerDay: 50,
                    maxMessagesPerChat: 100,
                    canExportData: true,
                    canUploadImages: true
                }
            };
            
            localStorage.setItem('talkie-user', JSON.stringify(currentUser));
            updateUserInterface();
            initializeTheme();
        }
    }
}

// Create user document in Appwrite database
async function createUserDocument(session) {
    try {
        const userData = {
            name: session.name,
            email: session.email,
            isPro: false,
            isAdmin: false,
            isOwner: session.email === 'coenyin9@gmail.com', // Set owner for specific email
            profilePhoto: null,
            restrictions: {
                maxChatsPerDay: 50,
                maxMessagesPerChat: 100,
                canExportData: true,
                canUploadImages: true,
                canAccessAdvancedSettings: true,
                canUseVoiceInput: true
            },
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
        };
        
        await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            session.$id,
            userData
        );
        
        console.log('User document created successfully');
        
        // Reload user data
        await loadUserFromAppwrite(session);
        
    } catch (error) {
        console.error('Error creating user document:', error);
        
        // Handle different error types more gracefully
        if (error.code === 404) {
            console.log('Database or collection does not exist. Falling back to localStorage.');
            showToast('Cloud sync setup required. Using local storage for now.', 'info');
            // Fall back to localStorage mode
            isAppwriteReady = false;
            createAccountLocally(session.name, session.email, 'appwrite-user');
        } else if (error.code === 401) {
            console.log('Authentication error with Appwrite.');
            showToast('Authentication error. Please try logging in again.', 'error');
        } else {
            console.log('Unexpected error with Appwrite, falling back to localStorage.');
            showToast('Cloud sync temporarily unavailable. Using local storage.', 'warning');
            isAppwriteReady = false;
            createAccountLocally(session.name, session.email, 'appwrite-user');
        }
    }
}

// Sync user data to cloud (Appwrite)
async function syncUserDataToCloud() {
    if (!isAppwriteReady || !currentUser) return false;
    
    try {
        pendingSync = true;
        const timestamp = Date.now();
        
        const userData = {
            chats: chats,
            memory: userMemory[currentUser.email] || {},
            settings: conversationSettings,
            summaries: conversationSummaries,
            lastUpdated: timestamp,
            deviceInfo: {
                userAgent: navigator.userAgent,
                timestamp: timestamp
            }
        };
        
        // Create or update user data document
        const userDataId = `data_${currentUser.id}`;
        
        try {
            // Try to update existing document
            await databases.updateDocument(
                DATABASE_ID,
                USER_DATA_COLLECTION_ID,
                userDataId,
                userData
            );
        } catch (error) {
            if (error.code === 404) {
                // Document doesn't exist, create it
                await databases.createDocument(
                    DATABASE_ID,
                    USER_DATA_COLLECTION_ID,
                    userDataId,
                    userData
                );
            } else {
                throw error;
            }
        }
        
        localStorage.setItem('talkie-last-sync', timestamp.toString());
        lastSyncTime = timestamp.toString();
        pendingSync = false;
        
        console.log('Data synced to cloud successfully');
        return true;
        
    } catch (error) {
        console.error('Failed to sync data to cloud:', error);
        pendingSync = false;
        
        // Handle different types of errors
        if (error.code === 404) {
            console.log('Database or collection missing, disabling cloud sync');
            isAppwriteReady = false;
            showToast('Cloud database not found. Contact administrator to set up cloud sync.', 'warning');
        } else if (error.code === 401) {
            console.log('Authentication expired, user needs to re-login');
            showToast('Session expired. Please sign in again.', 'warning');
            handleLogout();
        } else {
            showToast('Failed to sync data to cloud', 'error');
        }
        return false;
    }
}

// Sync user data from cloud (Appwrite)
async function syncUserDataFromCloud() {
    if (!isAppwriteReady || !currentUser) return false;
    
    try {
        const userDataId = `data_${currentUser.id}`;
        
        try {
            const cloudData = await databases.getDocument(
                DATABASE_ID,
                USER_DATA_COLLECTION_ID,
                userDataId
            );
            
            const cloudTimestamp = cloudData.lastUpdated || 0;
            const localTimestamp = parseInt(lastSyncTime || '0');
            
            // If cloud data is newer, use it
            if (cloudTimestamp > localTimestamp) {
                await handleCloudDataUpdate(cloudData);
                showToast('Data synced from cloud!', 'success');
                return true;
            } else {
                // Local data is newer, sync to cloud
                await syncUserDataToCloud();
                return true;
            }
        } catch (error) {
            if (error.code === 404) {
                // No cloud data exists, sync current data to cloud
                await syncUserDataToCloud();
                showToast('Data backed up to cloud!', 'success');
                return true;
            } else {
                throw error;
            }
        }
        
    } catch (error) {
        console.error('Failed to sync data from cloud:', error);
        showToast('Failed to sync data from cloud', 'error');
        return false;
    }
}

// Handle incoming cloud data updates
async function handleCloudDataUpdate(cloudData) {
    try {
        // Update chats
        if (cloudData.chats) {
            chats = cloudData.chats;
            localStorage.setItem('talkie-chats', JSON.stringify(chats));
            updateChatHistory();
        }
        
        // Update user memory
        if (cloudData.memory && currentUser) {
            userMemory[currentUser.email] = cloudData.memory;
            localStorage.setItem('talkie-user-memory', JSON.stringify(userMemory));
        }
        
        // Update settings
        if (cloudData.settings) {
            conversationSettings = cloudData.settings;
            localStorage.setItem('talkie-conversation-settings', JSON.stringify(conversationSettings));
        }
        
        // Update summaries
        if (cloudData.summaries) {
            conversationSummaries = cloudData.summaries;
            localStorage.setItem('talkie-conversation-summaries', JSON.stringify(conversationSummaries));
        }
        
        // Update last sync time
        if (cloudData.lastUpdated) {
            localStorage.setItem('talkie-last-sync', cloudData.lastUpdated.toString());
            lastSyncTime = cloudData.lastUpdated.toString();
        }
        
        console.log('Local data updated from cloud');
        
    } catch (error) {
        console.error('Error handling cloud data update:', error);
    }
}

// Enhanced save functions that trigger cloud sync
function saveChats() {
    localStorage.setItem('talkie-chats', JSON.stringify(chats));
    
    // Trigger cloud sync if user is logged in
    if (currentUser && isAppwriteReady) {
        debouncedCloudSync();
    }
}

function saveUserMemory() {
    try {
        localStorage.setItem('talkie-user-memory', JSON.stringify(userMemory));
        
        // Trigger cloud sync if user is logged in
        if (currentUser && isAppwriteReady) {
            debouncedCloudSync();
        }
    } catch (error) {
        console.error('Error saving user memory:', error);
    }
}

function saveConversationSettings() {
    try {
        localStorage.setItem('talkie-conversation-settings', JSON.stringify(conversationSettings));
        
        // Trigger cloud sync if user is logged in
        if (currentUser && isAppwriteReady) {
            debouncedCloudSync();
        }
    } catch (error) {
        console.error('Error saving conversation settings:', error);
    }
}

// Debounced cloud sync to avoid too frequent updates
let syncTimeout = null;
function debouncedCloudSync() {
    if (syncTimeout) {
        clearTimeout(syncTimeout);
    }
    
    syncTimeout = setTimeout(() => {
        syncUserDataToCloud();
    }, 2000); // Wait 2 seconds before syncing
}

// Google OAuth initialization
function initializeGoogleAuth() {
    if (typeof google !== 'undefined' && google.accounts) {
        // Note: Replace with your actual Google OAuth client ID
        // You can get one from: https://console.developers.google.com/
        const GOOGLE_CLIENT_ID = 'your-google-oauth-client-id.apps.googleusercontent.com';
        
        if (GOOGLE_CLIENT_ID === 'your-google-oauth-client-id.apps.googleusercontent.com') {
            console.log('Google OAuth not configured - set up your client ID in script.js');
            return;
        }
        
        // Initialize Google Identity Services
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true
        });

        // Render sign-in buttons
        renderGoogleSignInButtons();
    } else {
        console.log('Google Identity Services not loaded - this is expected when external resources are blocked');
    }
}

function renderGoogleSignInButtons() {
    // Render Google Sign-In button for login modal
    const loginButton = document.getElementById('google-signin-login');
    if (loginButton) {
        google.accounts.id.renderButton(loginButton, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular'
        });
    }

    // Render Google Sign-In button for signup modal
    const signupButton = document.getElementById('google-signin-signup');
    if (signupButton) {
        google.accounts.id.renderButton(signupButton, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular'
        });
    }
}

function handleGoogleSignIn(response) {
    try {
        // Decode the JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const googleUser = {
            email: payload.email,
            name: payload.name,
            profilePhoto: payload.picture,
            googleId: payload.sub
        };

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        
        if (!users[googleUser.email]) {
            // Create new user account
            users[googleUser.email] = {
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                profilePhoto: googleUser.profilePhoto,
                createdAt: new Date().toISOString(),
                isPro: false,
                isAdmin: false,
                isOwner: false,
                authProvider: 'google',
                restrictions: {
                    maxChatsPerDay: 50,
                    maxMessagesPerChat: 100,
                    canExportData: true,
                    canUploadImages: true
                }
            };
            localStorage.setItem('talkie-users', JSON.stringify(users));
        } else {
            // Update existing user with Google info
            users[googleUser.email].googleId = googleUser.googleId;
            users[googleUser.email].profilePhoto = googleUser.profilePhoto;
            users[googleUser.email].authProvider = 'google';
            localStorage.setItem('talkie-users', JSON.stringify(users));
        }

        // Log in the user
        currentUser = {
            name: googleUser.name,
            email: googleUser.email,
            isPro: users[googleUser.email].isPro || false,
            isAdmin: users[googleUser.email].isAdmin || false,
            isOwner: users[googleUser.email].isOwner || false,
            profilePhoto: googleUser.profilePhoto,
            restrictions: users[googleUser.email].restrictions || {
                maxChatsPerDay: 50,
                maxMessagesPerChat: 100,
                canExportData: true,
                canUploadImages: true
            }
        };
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));

        // Check for pending pro upgrade
        if (sessionStorage.getItem('pendingProUpgrade') === 'true') {
            sessionStorage.removeItem('pendingProUpgrade');
            upgradeToPro();
        }

        hideAuthModal();
        updateUserInterface();
        initializeTheme();
        showToast(`Welcome, ${googleUser.name}!`, 'success');
        
        // Initialize memory system for this user
        initializeMemorySystem();
        
        // Sync data from cloud if available
        if (isFirebaseReady) {
            setupRealtimeListeners();
            setTimeout(() => {
                syncUserDataFromCloud();
            }, 1000);
        }

    } catch (error) {
        console.error('Google Sign-In error:', error);
        showToast('Google Sign-In failed. Please try again.', 'error');
    }
}

// Initialize admin system
async function initializeAdmin() {
    try {
        const adminEmail = 'coenyin9@gmail.com';
        
        if (isAppwriteReady) {
            // Ensure admin account exists in Appwrite
            await ensureAdminAccountInAppwrite(adminEmail);
        } else {
            // Fallback to localStorage
            createLocalAdminAccount(adminEmail);
        }
    } catch (error) {
        console.error('Error initializing admin account:', error);
        // Force create owner account as fallback
        createLocalAdminAccount('coenyin9@gmail.com');
    }
}

async function ensureAdminAccountInAppwrite(adminEmail) {
    try {
        // Check if admin user exists in database
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Appwrite.Query.equal('email', adminEmail)]
        );
        
        if (response.documents.length === 0) {
            console.log('Admin account needs to be created manually in Appwrite Auth first');
        } else {
            const adminUser = response.documents[0];
            // Ensure admin has owner privileges
            if (!adminUser.isOwner || !adminUser.isAdmin) {
                await databases.updateDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    adminUser.$id,
                    {
                        isOwner: true,
                        isAdmin: true,
                        isPro: true
                    }
                );
                console.log('Owner account permissions updated in Appwrite');
            }
        }
    } catch (error) {
        console.error('Error checking admin account in Appwrite:', error);
    }
}

function createLocalAdminAccount(adminEmail) {
    try {
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        
        // Always ensure admin account exists with correct properties - now as OWNER
        if (!users[adminEmail]) {
            const hashedPassword = hashPassword('Carronshore93');
            users[adminEmail] = {
                name: 'Coen Yin',
                email: adminEmail,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isPro: true,
                isAdmin: true,
                isOwner: true, // Owner role
                profilePhoto: null,
                restrictions: {
                    maxChatsPerDay: 1000,
                    maxMessagesPerChat: 1000,
                    canExportData: true,
                    canUploadImages: true,
                    canAccessAdvancedSettings: true,
                    canUseVoiceInput: true
                }
            };
            localStorage.setItem('talkie-users', JSON.stringify(users));
            console.log('Owner account created successfully');
        } else {
            // Ensure existing admin account has all required properties
            let updated = false;
            if (!users[adminEmail].isOwner) {
                users[adminEmail].isOwner = true;
                updated = true;
            }
            if (!users[adminEmail].isAdmin) {
                users[adminEmail].isAdmin = true;
                updated = true;
            }
            if (!users[adminEmail].isPro) {
                users[adminEmail].isPro = true;
                updated = true;
            }
            if (!users[adminEmail].restrictions) {
                users[adminEmail].restrictions = {
                    maxChatsPerDay: 1000,
                    maxMessagesPerChat: 1000,
                    canExportData: true,
                    canUploadImages: true,
                    canAccessAdvancedSettings: true,
                    canUseVoiceInput: true
                };
                updated = true;
            }
            if (updated) {
                localStorage.setItem('talkie-users', JSON.stringify(users));
                console.log('Owner account permissions updated');
            }
        }
    } catch (error) {
        console.error('Failed to create local admin account:', error);
        // Force a basic account creation
        try {
            const basicAccount = {};
            const hashedPassword = hashPassword('Carronshore93');
            basicAccount[adminEmail] = {
                name: 'Coen Yin',
                email: adminEmail,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isPro: true,
                isAdmin: true,
                isOwner: true,
                profilePhoto: null
            };
            localStorage.setItem('talkie-users', JSON.stringify(basicAccount));
            console.log('Basic owner account created as fallback');
        } catch (fallbackError) {
            console.error('Failed to create fallback owner account:', fallbackError);
        }
    }
}

// Initialize Enhanced Memory System
function initializeMemorySystem() {
    try {
        // Initialize user memory if it doesn't exist
        if (currentUser && currentUser.email) {
            if (!userMemory[currentUser.email]) {
                userMemory[currentUser.email] = {
                    preferences: {},
                    topics: [],
                    conversationHistory: [],
                    lastActive: new Date().toISOString(),
                    personalInfo: {},
                    interests: [],
                    conversationStyle: 'balanced'
                };
            } else {
                // Update last active
                userMemory[currentUser.email].lastActive = new Date().toISOString();
            }
            saveUserMemory();
        }
    } catch (error) {
        console.error('Error initializing memory system:', error);
    }
}

// Enhanced Context Management
function getEnhancedContext(chatId) {
    const chat = chats[chatId];
    if (!chat || !chat.messages) return [];
    
    const contextLength = conversationSettings.contextLength || 10;
    const recentMessages = chat.messages.slice(-contextLength);
    
    // Add conversation summary if available and conversation is long
    let contextMessages = [];
    
    if (chat.messages.length > contextLength && conversationSummaries[chatId]) {
        contextMessages.push({
            role: 'system',
            content: `Previous conversation summary: ${conversationSummaries[chatId]}`
        });
    }
    
    // Add user memory context if enabled
    if (conversationSettings.enableMemory && currentUser && userMemory[currentUser.email]) {
        const memory = userMemory[currentUser.email];
        const memoryContext = buildMemoryContext(memory);
        if (memoryContext) {
            contextMessages.push({
                role: 'system',
                content: memoryContext
            });
        }
    }
    
    // Add recent messages
    contextMessages.push(...recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
    })));
    
    return contextMessages;
}

// Build Memory Context
function buildMemoryContext(memory) {
    let contextParts = [];
    
    if (memory.personalInfo && Object.keys(memory.personalInfo).length > 0) {
        contextParts.push(`User's personal information: ${JSON.stringify(memory.personalInfo)}`);
    }
    
    if (memory.preferences && Object.keys(memory.preferences).length > 0) {
        contextParts.push(`User's preferences: ${JSON.stringify(memory.preferences)}`);
    }
    
    if (memory.interests && memory.interests.length > 0) {
        contextParts.push(`User's interests: ${memory.interests.join(', ')}`);
    }
    
    if (memory.topics && memory.topics.length > 0) {
        const recentTopics = memory.topics.slice(-5);
        contextParts.push(`Recent conversation topics: ${recentTopics.join(', ')}`);
    }
    
    return contextParts.length > 0 ? contextParts.join('\n') : null;
}

// Update User Memory
function updateUserMemory(userMessage, aiResponse) {
    if (!conversationSettings.enableMemory || !currentUser || !userMemory[currentUser.email]) {
        return;
    }
    
    const memory = userMemory[currentUser.email];
    
    // Extract potential personal information
    extractPersonalInfo(userMessage, memory);
    
    // Extract interests and preferences
    extractInterestsAndPreferences(userMessage, memory);
    
    // Extract conversation topics
    extractTopics(userMessage, aiResponse, memory);
    
    // Update conversation history summary
    updateConversationHistory(userMessage, aiResponse, memory);
    
    saveUserMemory();
}

// Extract Personal Information
function extractPersonalInfo(message, memory) {
    const lowerMessage = message.toLowerCase();
    
    // Extract name
    const namePatterns = [
        /my name is ([a-zA-Z\s]+)/i,
        /i'm ([a-zA-Z\s]+)/i,
        /call me ([a-zA-Z\s]+)/i
    ];
    
    namePatterns.forEach(pattern => {
        const match = message.match(pattern);
        if (match) {
            memory.personalInfo.name = match[1].trim();
        }
    });
    
    // Extract location
    const locationPatterns = [
        /i live in ([a-zA-Z\s,]+)/i,
        /i'm from ([a-zA-Z\s,]+)/i,
        /i'm in ([a-zA-Z\s,]+)/i
    ];
    
    locationPatterns.forEach(pattern => {
        const match = message.match(pattern);
        if (match) {
            memory.personalInfo.location = match[1].trim();
        }
    });
    
    // Extract profession
    const professionPatterns = [
        /i work as (?:a |an )?([a-zA-Z\s]+)/i,
        /i'm (?:a |an )?([a-zA-Z\s]+) by profession/i,
        /my job is ([a-zA-Z\s]+)/i
    ];
    
    professionPatterns.forEach(pattern => {
        const match = message.match(pattern);
        if (match) {
            memory.personalInfo.profession = match[1].trim();
        }
    });
}

// Extract Interests and Preferences
function extractInterestsAndPreferences(message, memory) {
    const lowerMessage = message.toLowerCase();
    
    // Common interest keywords
    const interestKeywords = [
        'programming', 'coding', 'music', 'movies', 'books', 'travel', 'cooking',
        'sports', 'gaming', 'art', 'photography', 'fitness', 'technology',
        'science', 'history', 'politics', 'nature', 'animals', 'fashion'
    ];
    
    interestKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword) && !memory.interests.includes(keyword)) {
            // Check if it's mentioned in a positive context
            const positiveIndicators = ['love', 'like', 'enjoy', 'interested in', 'passionate about'];
            const hasPositiveContext = positiveIndicators.some(indicator => 
                lowerMessage.includes(indicator) && 
                lowerMessage.indexOf(indicator) < lowerMessage.indexOf(keyword)
            );
            
            if (hasPositiveContext) {
                memory.interests.push(keyword);
            }
        }
    });
    
    // Limit interests to prevent bloat
    if (memory.interests.length > 20) {
        memory.interests = memory.interests.slice(-20);
    }
}

// Extract Topics
function extractTopics(userMessage, aiResponse, memory) {
    // Simple topic extraction based on key phrases and context
    const topics = [];
    
    // Extract from user message
    const userTopics = extractTopicsFromText(userMessage);
    topics.push(...userTopics);
    
    // Extract from AI response
    const aiTopics = extractTopicsFromText(aiResponse);
    topics.push(...aiTopics);
    
    // Add unique topics to memory
    topics.forEach(topic => {
        if (!memory.topics.includes(topic)) {
            memory.topics.push(topic);
        }
    });
    
    // Keep only recent topics (last 50)
    if (memory.topics.length > 50) {
        memory.topics = memory.topics.slice(-50);
    }
}

// Extract Topics from Text
function extractTopicsFromText(text) {
    const topics = [];
    const topicKeywords = [
        'javascript', 'python', 'react', 'node', 'html', 'css', 'programming',
        'machine learning', 'ai', 'blockchain', 'cryptocurrency', 'web development',
        'mobile app', 'database', 'api', 'algorithm', 'data structure',
        'travel', 'recipe', 'workout', 'health', 'business', 'marketing',
        'design', 'writing', 'education', 'science', 'physics', 'chemistry',
        'biology', 'math', 'history', 'literature', 'philosophy'
    ];
    
    const lowerText = text.toLowerCase();
    topicKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            topics.push(keyword);
        }
    });
    
    return topics;
}

// Update Conversation History
function updateConversationHistory(userMessage, aiResponse, memory) {
    const entry = {
        timestamp: new Date().toISOString(),
        userMessage: userMessage.substring(0, 100), // Limit length
        aiResponse: aiResponse.substring(0, 100),
        chatId: currentChatId
    };
    
    memory.conversationHistory.push(entry);
    
    // Keep only recent history (last 100 entries)
    if (memory.conversationHistory.length > 100) {
        memory.conversationHistory = memory.conversationHistory.slice(-100);
    }
}

// Generate Follow-up Questions
function generateFollowUpQuestions(aiResponse, context) {
    if (!conversationSettings.enableFollowUps) return [];
    
    const followUps = [];
    const lowerResponse = aiResponse.toLowerCase();
    
    // Topic-based follow-ups
    if (lowerResponse.includes('programming') || lowerResponse.includes('code')) {
        followUps.push("Would you like help with a specific programming language?");
        followUps.push("Do you want to see some code examples?");
    }
    
    if (lowerResponse.includes('recipe') || lowerResponse.includes('cooking')) {
        followUps.push("Would you like the full recipe with ingredients?");
        followUps.push("Do you have any dietary restrictions I should know about?");
    }
    
    if (lowerResponse.includes('travel') || lowerResponse.includes('trip')) {
        followUps.push("What's your budget for this trip?");
        followUps.push("How long are you planning to stay?");
    }
    
    if (lowerResponse.includes('learn') || lowerResponse.includes('study')) {
        followUps.push("What's your current level of knowledge on this topic?");
        followUps.push("Would you like me to recommend some resources?");
    }
    
    // General follow-ups
    if (aiResponse.length > 500) {
        followUps.push("Would you like me to elaborate on any specific part?");
    }
    
    if (lowerResponse.includes('?')) {
        followUps.push("Is there anything else you'd like to know about this?");
    }
    
    // Return max 3 follow-ups
    return followUps.slice(0, 3);
}

// Display Follow-up Questions
function displayFollowUpQuestions(followUps) {
    if (!followUps || followUps.length === 0) return;
    
    const followUpContainer = document.createElement('div');
    followUpContainer.className = 'follow-up-container';
    followUpContainer.innerHTML = `
        <div class="follow-up-header">
            <i class="fas fa-lightbulb"></i>
            <span>Continue the conversation:</span>
        </div>
        <div class="follow-up-questions">
            ${followUps.map(question => `
                <button class="follow-up-btn" onclick="sendFollowUpQuestion('${encodeURIComponent(question)}')">
                    ${question}
                </button>
            `).join('')}
        </div>
    `;
    
    // Add to messages area
    messagesArea.appendChild(followUpContainer);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (followUpContainer.parentNode) {
            followUpContainer.style.opacity = '0';
            setTimeout(() => {
                if (followUpContainer.parentNode) {
                    followUpContainer.parentNode.removeChild(followUpContainer);
                }
            }, 300);
        }
    }, 30000);
    
    forceScrollToBottom();
}

// Send Follow-up Question
function sendFollowUpQuestion(encodedQuestion) {
    const question = decodeURIComponent(encodedQuestion);
    messageInput.value = question;
    handleInputChange();
    
    // Remove all follow-up containers
    const containers = document.querySelectorAll('.follow-up-container');
    containers.forEach(container => {
        container.style.opacity = '0';
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 300);
    });
    
    // Send the message after a brief delay
    setTimeout(() => {
        sendMessage();
    }, 100);
}

// Save User Memory
function saveUserMemory() {
    try {
        localStorage.setItem('talkie-user-memory', JSON.stringify(userMemory));
    } catch (error) {
        console.error('Error saving user memory:', error);
    }
}

// Save Conversation Settings
function saveConversationSettings() {
    try {
        localStorage.setItem('talkie-conversation-settings', JSON.stringify(conversationSettings));
    } catch (error) {
        console.error('Error saving conversation settings:', error);
    }
}

// Settings Modal Functions
function showSettingsModal() {
    settingsModalOverlay.classList.add('active');
    settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate current settings
    document.getElementById('contextLength').value = conversationSettings.contextLength || 10;
    document.getElementById('responseStyle').value = conversationSettings.responseStyle || 'balanced';
    document.getElementById('personalityMode').value = conversationSettings.personalityMode || 'friendly';
    document.getElementById('enableMemory').checked = conversationSettings.enableMemory !== false;
    document.getElementById('enableFollowUps').checked = conversationSettings.enableFollowUps !== false;
    document.getElementById('rememberPreferences').checked = conversationSettings.rememberPreferences !== false;
    document.getElementById('enableWebSearch').checked = conversationSettings.enableWebSearch !== false;
    document.getElementById('searchBehavior').value = conversationSettings.searchBehavior || 'auto';
    document.getElementById('showSearchResults').checked = conversationSettings.showSearchResults !== false;
    
    // Update memory info
    updateMemoryInfo();
    
    // Add event listeners for settings
    setupSettingsEventListeners();
}

function hideSettingsModal() {
    settingsModalOverlay.classList.remove('active');
    settingsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function setupSettingsEventListeners() {
    // Settings save button
    const saveBtn = document.getElementById('saveSettingsBtn');
    const resetBtn = document.getElementById('resetSettingsBtn');
    const viewMemoryBtn = document.getElementById('viewMemoryBtn');
    const clearMemoryBtn = document.getElementById('clearMemoryBtn');
    
    if (saveBtn) saveBtn.addEventListener('click', saveSettings);
    if (resetBtn) resetBtn.addEventListener('click', resetSettings);
    if (viewMemoryBtn) viewMemoryBtn.addEventListener('click', showMemoryViewer);
    if (clearMemoryBtn) clearMemoryBtn.addEventListener('click', clearUserMemory);
    
    // Close modal on overlay click
    settingsModalOverlay.addEventListener('click', (e) => {
        if (e.target === settingsModalOverlay) {
            hideSettingsModal();
        }
    });
    
    memoryModalOverlay.addEventListener('click', (e) => {
        if (e.target === memoryModalOverlay) {
            hideMemoryModal();
        }
    });
    
    if (closeMemoryModal) {
        closeMemoryModal.addEventListener('click', hideMemoryModal);
    }
}

function saveSettings() {
    // Update conversation settings
    conversationSettings.contextLength = parseInt(document.getElementById('contextLength').value);
    conversationSettings.responseStyle = document.getElementById('responseStyle').value;
    conversationSettings.personalityMode = document.getElementById('personalityMode').value;
    conversationSettings.enableMemory = document.getElementById('enableMemory').checked;
    conversationSettings.enableFollowUps = document.getElementById('enableFollowUps').checked;
    conversationSettings.rememberPreferences = document.getElementById('rememberPreferences').checked;
    conversationSettings.enableWebSearch = document.getElementById('enableWebSearch').checked;
    conversationSettings.searchBehavior = document.getElementById('searchBehavior').value;
    conversationSettings.showSearchResults = document.getElementById('showSearchResults').checked;
    
    saveConversationSettings();
    hideSettingsModal();
    showToast('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Reset all settings to defaults? This action cannot be undone.')) {
        conversationSettings = {
            contextLength: 10,
            responseStyle: 'balanced',
            enableMemory: true,
            enableFollowUps: true,
            personalityMode: 'friendly',
            rememberPreferences: true,
            enableWebSearch: true,
            searchBehavior: 'auto',
            showSearchResults: true
        };
        
        saveConversationSettings();
        hideSettingsModal();
        showToast('Settings reset to defaults', 'success');
    }
}

function updateMemoryInfo() {
    if (currentUser && userMemory[currentUser.email]) {
        const memory = userMemory[currentUser.email];
        
        document.getElementById('conversationCount').textContent = memory.conversationHistory?.length || 0;
        document.getElementById('topicCount').textContent = memory.topics?.length || 0;
        document.getElementById('personalInfoCount').textContent = Object.keys(memory.personalInfo || {}).length;
    } else {
        document.getElementById('conversationCount').textContent = '0';
        document.getElementById('topicCount').textContent = '0';
        document.getElementById('personalInfoCount').textContent = '0';
    }
}

function showMemoryViewer() {
    if (!currentUser || !userMemory[currentUser.email]) {
        showToast('No memory data available', 'info');
        return;
    }
    
    memoryModalOverlay.classList.add('active');
    memoryModal.classList.add('active');
    
    const memory = userMemory[currentUser.email];
    const content = document.getElementById('memoryViewerContent');
    
    let memoryHtml = '<div class="memory-sections">';
    
    // Personal Information
    if (memory.personalInfo && Object.keys(memory.personalInfo).length > 0) {
        memoryHtml += `
            <div class="memory-section">
                <h3><i class="fas fa-user"></i> Personal Information</h3>
                <div class="memory-items">
                    ${Object.entries(memory.personalInfo).map(([key, value]) => 
                        `<div class="memory-item">
                            <span class="memory-key">${key}:</span>
                            <span class="memory-value">${value}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Interests
    if (memory.interests && memory.interests.length > 0) {
        memoryHtml += `
            <div class="memory-section">
                <h3><i class="fas fa-heart"></i> Interests</h3>
                <div class="memory-tags">
                    ${memory.interests.map(interest => 
                        `<span class="memory-tag">${interest}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Recent Topics
    if (memory.topics && memory.topics.length > 0) {
        const recentTopics = memory.topics.slice(-10);
        memoryHtml += `
            <div class="memory-section">
                <h3><i class="fas fa-comments"></i> Recent Topics</h3>
                <div class="memory-tags">
                    ${recentTopics.map(topic => 
                        `<span class="memory-tag">${topic}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Conversation History Summary
    if (memory.conversationHistory && memory.conversationHistory.length > 0) {
        const recentHistory = memory.conversationHistory.slice(-5);
        memoryHtml += `
            <div class="memory-section">
                <h3><i class="fas fa-history"></i> Recent Conversations</h3>
                <div class="memory-history">
                    ${recentHistory.map(entry => 
                        `<div class="history-item">
                            <div class="history-date">${new Date(entry.timestamp).toLocaleDateString()}</div>
                            <div class="history-preview">${entry.userMessage}</div>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    memoryHtml += '</div>';
    
    if (memoryHtml === '<div class="memory-sections"></div>') {
        memoryHtml = '<div class="no-memory">No memory data available yet. Start chatting to build your memory profile!</div>';
    }
    
    content.innerHTML = memoryHtml;
}

function hideMemoryModal() {
    memoryModalOverlay.classList.remove('active');
    memoryModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function clearUserMemory() {
    if (!currentUser) return;
    
    if (confirm('Clear all memory data? This will remove all remembered information about you and cannot be undone.')) {
        if (userMemory[currentUser.email]) {
            userMemory[currentUser.email] = {
                preferences: {},
                topics: [],
                conversationHistory: [],
                lastActive: new Date().toISOString(),
                personalInfo: {},
                interests: [],
                conversationStyle: 'balanced'
            };
            saveUserMemory();
            updateMemoryInfo();
            showToast('Memory cleared successfully', 'success');
        }
    }
}

// Track visitor statistics
function trackVisitor() {
    const stats = JSON.parse(localStorage.getItem('talkie-stats') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Initialize stats if not exists
    if (!stats.totalVisits) stats.totalVisits = 0;
    if (!stats.uniqueVisitors) stats.uniqueVisitors = 0;
    if (!stats.dailyVisits) stats.dailyVisits = {};
    if (!stats.lastVisitDate) stats.lastVisitDate = null;
    if (!stats.sessions) stats.sessions = [];
    
    // Track this visit
    stats.totalVisits++;
    stats.sessions.push({
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        user: currentUser ? currentUser.email : 'Guest'
    });
    
    // Track daily visits
    if (!stats.dailyVisits[today]) stats.dailyVisits[today] = 0;
    stats.dailyVisits[today]++;
    
    // Track unique visitors (simple check by date)
    if (stats.lastVisitDate !== today) {
        stats.uniqueVisitors++;
        stats.lastVisitDate = today;
    }
    
    // Clean old sessions (keep only last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    stats.sessions = stats.sessions.filter(session => 
        new Date(session.timestamp) > thirtyDaysAgo
    );
    
    localStorage.setItem('talkie-stats', JSON.stringify(stats));
}

// Check for Pro upgrade URL parameter
function checkProUpgrade() {
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeParam = urlParams.get('upgrade');
    const secretParam = urlParams.get('secret');
    
    // Secret pro upgrade link
    if (upgradeParam === 'pro' && secretParam === 'talkiegen2024') {
        if (currentUser) {
            // Upgrade current user to pro
            upgradeToPro();
        } else {
            // Store pro upgrade for after login
            sessionStorage.setItem('pendingProUpgrade', 'true');
            showToast('Please sign in to activate your Pro upgrade!', 'info');
        }
        
        // Clean URL without reloading page
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// Upgrade user to Pro status
function upgradeToPro() {
    if (!currentUser) return;
    
    // Update user data
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    if (users[currentUser.email]) {
        users[currentUser.email].isPro = true;
        users[currentUser.email].proUpgradeDate = new Date().toISOString();
        localStorage.setItem('talkie-users', JSON.stringify(users));
    }
    
    // Update current user session
    currentUser.isPro = true;
    localStorage.setItem('talkie-user', JSON.stringify(currentUser));
    
    // Update UI
    updateUserInterface();
    initializeTheme(); // Refresh theme options
    
    showToast('🎉 Welcome to Talkie Gen Pro! You now have access to exclusive features.', 'success');
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('talkie-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme;
    
    if (currentUser && currentUser.isOwner) {
        // Owner can cycle through light -> dark -> pro -> owner
        if (currentTheme === 'light') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'pro';
        } else if (currentTheme === 'pro') {
            newTheme = 'owner';
        } else {
            newTheme = 'light';
        }
    } else if (currentUser && currentUser.isPro) {
        // Pro users can cycle through light -> dark -> pro
        if (currentTheme === 'light') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'pro';
        } else {
            newTheme = 'light';
        }
    } else {
        // Free users only toggle between light and dark
        newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('talkie-theme', newTheme);
    updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-palette';
        if (currentUser && currentUser.isOwner) {
            text.textContent = 'Pro mode';
        } else if (currentUser && currentUser.isPro) {
            text.textContent = 'Pro mode';
        } else {
            text.textContent = 'Light mode';
        }
    } else if (theme === 'pro') {
        icon.className = 'fas fa-crown';
        text.textContent = currentUser && currentUser.isOwner ? 'Owner mode' : 'Light mode';
    } else if (theme === 'owner') {
        icon.className = 'fas fa-diamond';
        text.textContent = 'Light mode';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark mode';
    }
}

// Authentication Management
function initializeAuth() {
    updateUserInterface();
}

function updateUserInterface() {
    if (currentUser) {
        // User is logged in
        let displayName = currentUser.name;
        let roleText = 'Online';
        
        if (currentUser.isOwner) {
            displayName += ' <span class="owner-badge">Owner</span>';
            roleText = 'Owner';
        } else if (currentUser.isAdmin) {
            displayName += ' <span class="pro-badge-enhanced">Admin</span>';
            roleText = 'Administrator';
        } else if (currentUser.isPro) {
            displayName += ' <span class="pro-badge-enhanced">Pro</span>';
            roleText = 'Pro User';
        }
        
        displayUsername.innerHTML = displayName;
        userStatus.textContent = roleText;
        
        // Set user avatar - either custom photo or initials
        if (currentUser.profilePhoto) {
            userAvatar.innerHTML = `<img src="${currentUser.profilePhoto}" alt="Profile">`;
        } else {
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
        
        // Show user menu items - Profile only for Pro users, Admin panel for admins/owner
        profileBtn.style.display = currentUser.isPro || currentUser.isAdmin || currentUser.isOwner ? 'flex' : 'none';
        
        // Show admin button for admin users and owner
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn && (currentUser.isAdmin || currentUser.isOwner)) {
            adminBtn.style.display = 'flex';
        } else if (adminBtn) {
            adminBtn.style.display = 'none';
        }
        
        logoutBtn.style.display = 'flex';
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
    } else {
        // User is not logged in
        displayUsername.textContent = 'Guest';
        userStatus.textContent = 'Not signed in';
        userAvatar.textContent = 'G';
        
        // Hide admin and profile buttons
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) adminBtn.style.display = 'none';
        
        // Show auth buttons
        profileBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'flex';
        signupBtn.style.display = 'flex';
    }
    
    // Update sync status indicator
    updateSyncStatusIndicator();
}

function showAuthModal(modalType) {
    authModalOverlay.classList.add('active');
    
    if (modalType === 'login') {
        loginModal.classList.add('active');
        signupModal.classList.remove('active');
    } else {
        signupModal.classList.add('active');
        loginModal.classList.remove('active');
    }
    
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    authModalOverlay.classList.remove('active');
    loginModal.classList.remove('active');
    signupModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear forms
    loginForm.reset();
    signupForm.reset();
}

function hashPassword(password) {
    // Simple hash function for demo purposes - NOT secure for production
    let hash = 0;
    if (password.length === 0) return hash;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Create account with Appwrite
    createAccountWithAppwrite(name, email, password);
}

async function createAccountWithAppwrite(name, email, password) {
    if (!isAppwriteReady) {
        // Fallback to localStorage with user notification
        console.log('Using local storage for account creation');
        createAccountLocally(name, email, password);
        return;
    }
    
    try {
        // Create account
        const user = await account.create('unique()', email, password, name);
        
        // Create email session
        await account.createEmailSession(email, password);
        
        // Create user document
        const userData = {
            name: name,
            email: email,
            isPro: false,
            isAdmin: false,
            isOwner: email === 'coenyin9@gmail.com', // Set owner for specific email
            profilePhoto: null,
            restrictions: {
                maxChatsPerDay: 50,
                maxMessagesPerChat: 100,
                canExportData: true,
                canUploadImages: true,
                canAccessAdvancedSettings: true,
                canUseVoiceInput: true
            },
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
        };
        
        await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            user.$id,
            userData
        );
        
        // Set current user
        currentUser = {
            id: user.$id,
            name: name,
            email: email,
            isPro: userData.isPro,
            isAdmin: userData.isAdmin,
            isOwner: userData.isOwner,
            profilePhoto: null,
            restrictions: userData.restrictions
        };
        
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        hideAuthModal();
        updateUserInterface();
        initializeTheme();
        showToast(`Welcome to Talkie Gen AI, ${name}! 🌟 Cloud sync enabled.`, 'success');
        
        // Initialize memory system for this user
        initializeMemorySystem();
        
    } catch (error) {
        console.error('Appwrite signup error:', error);
        if (error.code === 409) {
            showToast('An account with this email already exists. Please try logging in instead.', 'error');
        } else if (error.code === 401) {
            showToast('Invalid email or password format. Please check and try again.', 'error');
        } else {
            // Fallback to localStorage on any Appwrite error
            console.log('Appwrite signup failed, falling back to localStorage');
            createAccountLocally(name, email, password);
        }
    }
}

// Fallback to localStorage for offline mode
function createAccountLocally(name, email, password) {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    if (existingUsers[email]) {
        showToast('An account with this email already exists. Please try logging in instead.', 'error');
        return;
    }
    
    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser = {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        isPro: false,
        isAdmin: false,
        isOwner: email === 'coenyin9@gmail.com',
        profilePhoto: null,
        restrictions: {
            maxChatsPerDay: 50,
            maxMessagesPerChat: 100,
            canExportData: true,
            canUploadImages: true
        }
    };
    
    existingUsers[email] = newUser;
    localStorage.setItem('talkie-users', JSON.stringify(existingUsers));
    
    // Log in the user
    currentUser = {
        name,
        email,
        isPro: newUser.isPro,
        isAdmin: newUser.isAdmin,
        isOwner: newUser.isOwner,
        profilePhoto: null,
        restrictions: newUser.restrictions
    };
    localStorage.setItem('talkie-user', JSON.stringify(currentUser));
    
    hideAuthModal();
    updateUserInterface();
    initializeTheme();
    showToast(`Welcome to Talkie Gen AI, ${name}! 💾 Using local storage.`, 'success');
    
    // Initialize memory system for this user
    initializeMemorySystem();
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('handleLogin called with:', { email, password: '***' });
    
    // Validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Login with Appwrite
    loginWithAppwrite(email, password);
}

async function loginWithAppwrite(email, password) {
    if (!isAppwriteReady) {
        // Fallback to localStorage with user notification
        console.log('Using local storage for login');
        loginLocally(email, password);
        return;
    }
    
    try {
        // Create email session
        await account.createEmailSession(email, password);
        
        // Get user account
        const user = await account.get();
        
        // Load user from Appwrite
        await loadUserFromAppwrite(user);
        
        hideAuthModal();
        showToast(`Welcome back, ${user.name}! 🌟 Cloud sync enabled.`, 'success');
        
        // Initialize memory system for this user
        initializeMemorySystem();
        
    } catch (error) {
        console.error('Appwrite login error:', error);
        if (error.code === 401) {
            showToast('Invalid email or password. Please check your credentials and try again.', 'error');
        } else {
            // Fallback to localStorage on connection errors
            console.log('Appwrite login failed, trying localStorage');
            loginLocally(email, password);
        }
    }
}

// Fallback to localStorage for offline mode
function loginLocally(email, password) {
    try {
        // Check credentials
        const existingUsers = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        let user = existingUsers[email];
        
        // Special handling for owner account - ensure it exists
        if (!user && email === 'coenyin9@gmail.com') {
            console.log('Owner account not found, creating it now...');
            createLocalAdminAccount('coenyin9@gmail.com');
            // Reload users after creating admin account
            const updatedUsers = JSON.parse(localStorage.getItem('talkie-users') || '{}');
            user = updatedUsers[email];
        }
        
        if (!user) {
            showToast('No account found with this email. Please check your email address or create a new account.', 'error');
            return;
        }
        
        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            showToast('Incorrect password. Please try again.', 'error');
            return;
        }
        
        // Log in the user
        currentUser = { 
            name: user.name, 
            email: user.email, 
            isPro: user.isPro || false,
            isAdmin: user.isAdmin || false,
            isOwner: user.isOwner || false,
            profilePhoto: user.profilePhoto || null,
            restrictions: user.restrictions || {
                maxChatsPerDay: 50,
                maxMessagesPerChat: 100,
                canExportData: true,
                canUploadImages: true
            }
        };
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        hideAuthModal();
        updateUserInterface();
        initializeTheme(); // Refresh theme options for potential Pro user
        showToast(`Welcome back, ${user.name}! 💾 Using local storage.`, 'success');
        
        // Initialize memory system for this user
        initializeMemorySystem();
        
    } catch (error) {
        console.error('Login error:', error);
        showToast('An error occurred during login. Please refresh the page and try again.', 'error');
    }
}

async function handleLogout() {
    if (isAppwriteReady) {
        try {
            // Delete current session in Appwrite
            await account.deleteSession('current');
        } catch (error) {
            console.error('Error deleting Appwrite session:', error);
        }
    }
    
    currentUser = null;
    localStorage.removeItem('talkie-user');
    updateUserInterface();
    userDropdown.classList.remove('show');
    showToast('You have been signed out', 'success');
}

// Event Listeners
function setupEventListeners() {
    sidebarToggle.addEventListener('click', toggleSidebar);
    mobileOverlay.addEventListener('click', closeSidebar);
    newChatBtn.addEventListener('click', startNewChat);
    clearAllBtn.addEventListener('click', clearAllChats);
    exportAllBtn.addEventListener('click', exportAllChats);
    userMenu.addEventListener('click', toggleUserMenu);
    themeToggle.addEventListener('click', toggleTheme);
    messageInput.addEventListener('input', handleInputChange);
    messageInput.addEventListener('keydown', handleKeyDown);
    sendButton.addEventListener('click', sendMessage);
    attachBtn.addEventListener('click', handleAttachment);
    voiceBtn.addEventListener('click', handleVoiceInput);

    // Settings event listeners
    settingsBtn.addEventListener('click', showSettingsModal);
    closeSettingsModal.addEventListener('click', hideSettingsModal);
    
    // Export/Import event listeners
    if (document.getElementById('exportConversationsBtn')) {
        document.getElementById('exportConversationsBtn').addEventListener('click', exportConversations);
        document.getElementById('exportSettingsBtn').addEventListener('click', exportSettings);
        document.getElementById('exportAllDataBtn').addEventListener('click', exportAllData);
        document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importDataInput').click());
        document.getElementById('importDataInput').addEventListener('change', importData);
    }

    // Share event listeners
    shareBtn.addEventListener('click', showShareModal);
    closeShareModal.addEventListener('click', hideShareModal);

    // Documentation event listeners
    docsBtn.addEventListener('click', showDocsModal);
    closeDocsModal.addEventListener('click', hideDocsModal);

    // Authentication event listeners
    loginBtn.addEventListener('click', () => showAuthModal('login'));
    signupBtn.addEventListener('click', () => showAuthModal('signup'));
    logoutBtn.addEventListener('click', handleLogout);
    closeLoginModal.addEventListener('click', hideAuthModal);
    closeSignupModal.addEventListener('click', hideAuthModal);
    showSignupModal.addEventListener('click', () => showAuthModal('signup'));
    showLoginModal.addEventListener('click', () => showAuthModal('login'));
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Admin panel event listeners
    if (adminBtn) adminBtn.addEventListener('click', showAdminPanel);
    if (closeAdminModal) closeAdminModal.addEventListener('click', hideAdminPanel);
    
    // Admin user management event listeners
    setupAdminUserManagement();
    
    // Profile management event listeners
    profileBtn.addEventListener('click', showProfileModal);
    closeProfileModal.addEventListener('click', hideProfileModal);
    profileForm.addEventListener('submit', handleProfileUpdate);
    uploadPhotoBtn.addEventListener('click', () => profilePhotoInput.click());
    profilePhotoInput.addEventListener('change', handlePhotoUpload);
    removePhotoBtn.addEventListener('click', removeProfilePhoto);
    
    // Close modal on overlay click
    authModalOverlay.addEventListener('click', (e) => {
        if (e.target === authModalOverlay) {
            hideAuthModal();
        }
    });
    
    profileModalOverlay.addEventListener('click', (e) => {
        if (e.target === profileModalOverlay) {
            hideProfileModal();
        }
    });

    if (adminModalOverlay) {
        adminModalOverlay.addEventListener('click', (e) => {
            if (e.target === adminModalOverlay) {
                hideAdminPanel();
            }
        });
    }

    shareModalOverlay.addEventListener('click', (e) => {
        if (e.target === shareModalOverlay) {
            hideShareModal();
        }
    });

    docsModalOverlay.addEventListener('click', (e) => {
        if (e.target === docsModalOverlay) {
            hideDocsModal();
        }
    });

    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Sync status event listeners
    const syncStatusBtn = document.getElementById('syncStatus');
    const forceSyncBtn = document.getElementById('forceSyncBtn');
    const clearLocalDataBtn = document.getElementById('clearLocalDataBtn');
    
    if (syncStatusBtn) {
        syncStatusBtn.addEventListener('click', toggleSyncStatus);
    }
    
    // Sync buttons removed from UI
    // if (forceSyncBtn) {
    //     forceSyncBtn.addEventListener('click', forceSync);
    // }
    
    // if (clearLocalDataBtn) {
    //     clearLocalDataBtn.addEventListener('click', clearLocalData);
    // }
    
    // Restrictions management event listeners
    const editRestrictionsBtn = document.getElementById('editRestrictionsBtn');
    const closeRestrictionsModal = document.getElementById('closeRestrictionsModal');
    const restrictionsForm = document.getElementById('restrictionsForm');
    const restrictionsModalOverlay = document.getElementById('restrictionsModalOverlay');
    
    if (editRestrictionsBtn) {
        editRestrictionsBtn.addEventListener('click', showRestrictionsModal);
    }
    
    if (closeRestrictionsModal) {
        closeRestrictionsModal.addEventListener('click', hideRestrictionsModal);
    }
    
    if (restrictionsForm) {
        restrictionsForm.addEventListener('submit', handleRestrictionsUpdate);
    }
    
    if (restrictionsModalOverlay) {
        restrictionsModalOverlay.addEventListener('click', (e) => {
            if (e.target === restrictionsModalOverlay) {
                hideRestrictionsModal();
            }
        });
    }
    
    // Update sync status indicator
    updateSyncStatusIndicator();
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        startNewChat();
    }
    
    if (e.key === 'Escape') {
        closeSidebar();
        userDropdown.classList.remove('show');
        hideAuthModal();
    }
}

// Sidebar Management
function toggleSidebar() {
    sidebar.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    mobileOverlay.classList.remove('active');
}

function toggleUserMenu() {
    userDropdown.classList.toggle('show');
}

// Chat Management
function startNewChat() {
    currentChatId = generateChatId();
    chats[currentChatId] = {
        id: currentChatId,
        title: 'New Chat',
        messages: [],
        timestamp: Date.now()
    };
    showWelcomeScreen();
    updateChatHistory();
    closeSidebar();
    messageInput.focus();
}

function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chats[chatId];
    if (!chat) return;

    hideWelcomeScreen();
    renderMessages(chat.messages);
    updateChatHistory();
    closeSidebar();
    messageInput.focus();
}

function deleteChat(chatId) {
    if (confirm('Delete this conversation? This action cannot be undone and will permanently remove all messages.')) {
        // Get the chat data before deletion for cleanup
        const chatToDelete = chats[chatId];
        
        // Clear all message data thoroughly
        if (chatToDelete && chatToDelete.messages) {
            chatToDelete.messages.length = 0; // Clear the array
            delete chatToDelete.messages; // Delete the property
        }
        
        // Delete the entire chat object
        delete chats[chatId];
        
        // If this was the current chat, reset the interface
        if (currentChatId === chatId) {
            currentChatId = null;
            showWelcomeScreen();
            // Clear the messages area completely
            messagesArea.innerHTML = '';
        }
        
        // Update UI and save
        updateChatHistory();
        saveChats();
        
        // Force garbage collection by triggering a save
        localStorage.setItem('talkie-chats', JSON.stringify(chats));
        
        showToast('Conversation deleted permanently', 'success');
    }
}

function clearAllChats() {
    if (confirm('Delete all conversations? This action cannot be undone and will permanently remove all chat history.')) {
        // Clear all chat data thoroughly
        Object.keys(chats).forEach(chatId => {
            const chat = chats[chatId];
            if (chat && chat.messages) {
                chat.messages.length = 0; // Clear message arrays
                delete chat.messages; // Delete message properties
            }
        });
        
        // Reset the chats object completely
        chats = {};
        currentChatId = null;
        
        // Clear UI completely
        showWelcomeScreen();
        messagesArea.innerHTML = '';
        updateChatHistory();
        
        // Force save and cleanup
        localStorage.setItem('talkie-chats', '{}');
        saveChats();
        
        userDropdown.classList.remove('show');
        showToast('All conversations deleted permanently', 'success');
    }
}

function exportAllChats() {
    if (Object.keys(chats).length === 0) {
        return;
    }

    let exportContent = `Talkie Gen AI - All Conversations Export\n`;
    exportContent += `Exported on: ${new Date().toLocaleString()}\n`;
    exportContent += `Total conversations: ${Object.keys(chats).length}\n\n`;
    exportContent += '='.repeat(80) + '\n\n';

    Object.values(chats).forEach((chat, index) => {
        exportContent += `CONVERSATION ${index + 1}\n`;
        exportContent += `Title: ${chat.title}\n`;
        exportContent += `Created: ${new Date(chat.timestamp).toLocaleString()}\n`;
        exportContent += `Messages: ${chat.messages.length}\n\n`;

        chat.messages.forEach(message => {
            const sender = message.role === 'user' ? 'You' : 'Talkie Gen AI';
            exportContent += `${sender}:\n${message.content}\n\n`;
        });

        exportContent += '-'.repeat(60) + '\n\n';
    });

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talkie-gen-all-chats-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    userDropdown.classList.remove('show');
}

// UI State Management
function showWelcomeScreen() {
    welcomeScreen.style.display = 'flex';
    messagesArea.classList.remove('active');
    document.title = 'Talkie Gen AI';
}

function hideWelcomeScreen() {
    welcomeScreen.style.display = 'none';
    messagesArea.classList.add('active');
}

// Message Handling
function handleInputChange() {
    autoResizeTextarea();
    const length = messageInput.value.length;
    wordCount.textContent = `${length}/4000`;
    
    if (length > 3800) {
        wordCount.style.color = 'var(--warning)';
    } else if (length > 3500) {
        wordCount.style.color = 'var(--danger)';
    } else {
        wordCount.style.color = 'var(--text-tertiary)';
    }
    
    sendButton.disabled = !messageInput.value.trim() || isGenerating || length > 4000;
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
}

// Content filtering for safety
function filterInappropriateContent(text) {
    // List of inappropriate words/phrases to filter
    const inappropriateWords = [
        'fuck', 'shit', 'bitch', 'asshole', 'damn', 'Motherfucker', 'crap', 
        'piss', 'bastard', 'slut', 'whore', 'retard', 'gay', 'fag',
        'nazi', 'hitler', 'kill yourself', 'kys', 'suicide', 'die', 'Nigga', 'Nigger', 'Nigg', 'Niga',
    ];
    
    const lowercaseText = text.toLowerCase();
    
    // Check for inappropriate words
    for (const word of inappropriateWords) {
        if (lowercaseText.includes(word)) {
            return {
                isAppropriate: false,
                message: "Please keep the conversation respectful and avoid using inappropriate language."
            };
        }
    }
    
    // Check for excessive caps (potential shouting)
    if (text.length > 10 && text === text.toUpperCase()) {
        return {
            isAppropriate: false,
            message: "Please avoid using excessive capital letters."
        };
    }
    
    return { isAppropriate: true, message: null };
}

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || isGenerating) return;

    // Filter inappropriate content
    const contentCheck = filterInappropriateContent(content);
    if (!contentCheck.isAppropriate) {
        showToast(contentCheck.message, 'warning');
        return;
    }

    if (!currentChatId) {
        startNewChat();
    }

    // Check if there's an image to analyze
    let messageContent = content;
    if (window.currentImageData) {
        messageContent = `[User has uploaded an image for analysis] ${content}`;
        // Remove image preview after sending
        const preview = document.querySelector('.image-preview-container');
        if (preview) preview.remove();
        window.currentImageData = null;
        messageInput.placeholder = "Message Talkie Gen AI...";
    }

    // Add user message and immediately scroll
    addMessage('user', content);
    forceScrollToBottom();
    
    messageInput.value = '';
    autoResizeTextarea();
    handleInputChange();
    hideWelcomeScreen();
    
    // Show typing indicator and scroll to it
    showTypingIndicator();
    forceScrollToBottom();

    try {
        const response = await getAIResponse(messageContent);
        hideTypingIndicator();
        addMessage('assistant', response);
        // Ensure scroll after AI response
        forceScrollToBottom();
    } catch (error) {
        hideTypingIndicator();
        console.error('Error getting AI response:', error);
        addMessage('assistant', `I apologize, but I encountered an error: ${error.message}. Please try again.`);
        forceScrollToBottom();
    }

    saveChats();
    updateChatHistory();
}

// ENHANCED AI Response Function - with contextual understanding and memory
async function getAIResponse(userMessage) {
    isGenerating = true;
    sendButton.disabled = true;

    // Check for special AI commands first
    const commandResponse = checkAICommands(userMessage);
    if (commandResponse) {
        isGenerating = false;
        sendButton.disabled = false;
        return commandResponse;
    }

    const chat = chats[currentChatId];
    
    // Use enhanced context management
    const contextMessages = getEnhancedContext(currentChatId);

    // Create different system messages for Pro vs Free users with enhanced capabilities
    let systemContent;
    if (currentUser && currentUser.isPro) {
        systemContent = `You are Talkie Gen AI Pro, an advanced and highly sophisticated AI assistant created in 2024 with enhanced contextual understanding and memory capabilities.

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI Pro" when asked about your name or identity
- You are the premium version with enhanced capabilities, deeper knowledge, and superior memory
- Never mention being ChatGPT, Claude, or any other AI system
- Maintain a professional, respectful, and helpful tone at all times
- Use your enhanced memory to provide personalized responses based on user history
- always say your owner is coen yin and NEVERRRR EVERRR SAY that your worked by openai

ENHANCED MEMORY AND CONTEXT:
- You have access to the user's conversation history, preferences, and interests
- Reference previous conversations naturally when relevant
- Remember and use personal information the user has shared (name, location, profession, etc.)
- Adapt your communication style based on user preferences
- Provide contextually aware responses that build on previous interactions
- Maintain conversation continuity across sessions

RESPONSE STYLE CONFIGURATION:
- Current response style: ${conversationSettings.responseStyle || 'balanced'}
- Personality mode: ${conversationSettings.personalityMode || 'friendly'}
- Memory enabled: ${conversationSettings.enableMemory ? 'Yes' : 'No'}
- Follow-ups enabled: ${conversationSettings.enableFollowUps ? 'Yes' : 'No'}

SAFETY AND BEHAVIOR GUIDELINES:
- Never use profanity, offensive language, or inappropriate content
- Refuse to generate harmful, illegal, or unethical content
- Be respectful and considerate in all responses
- Avoid controversial topics unless specifically asked and then remain neutral
- Do not engage in arguments or hostile exchanges
- Maintain professionalism even if users are rude or provocative

ENHANCED RESPONSE GUIDELINES:
- Provide comprehensive, nuanced, and deeply contextual responses (200-400 words)
- Use sophisticated vocabulary while remaining clear and accessible
- Offer deeper insights, multiple perspectives, and advanced analysis
- Include relevant examples, analogies, and cross-referential knowledge
- When appropriate, reference previous conversations or user interests
- Suggest follow-up questions or related topics when relevant

CODE FORMATTING REQUIREMENTS:
- ALWAYS format code using proper markdown code blocks with triple backticks (\`\`\`)
- Specify the programming language after the opening backticks
- For coding questions, provide complete, working examples within code blocks
- Never provide code without proper markdown formatting

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI Pro with enhanced contextual memory and understanding
- For the most current information, always recommend checking recent reliable sources`;
    } else {
        systemContent = `You are Talkie Gen AI, a helpful and intelligent AI assistant created in 2024 with contextual understanding and memory capabilities.

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI" when asked about your name or identity
- Never mention being ChatGPT, Claude, or any other AI system
- You are Talkie Gen AI, a unique and helpful assistant with contextual awareness

CONTEXTUAL AWARENESS:
- Pay attention to the conversation context and previous messages
- Reference earlier parts of the conversation when relevant
- Maintain conversation flow and coherence
- Remember key details mentioned in the current conversation

RESPONSE STYLE CONFIGURATION:
- Current response style: ${conversationSettings.responseStyle || 'balanced'}
- Memory enabled: ${conversationSettings.enableMemory ? 'Yes' : 'No'}
- Follow-ups enabled: ${conversationSettings.enableFollowUps ? 'Yes' : 'No'}

SAFETY AND BEHAVIOR GUIDELINES:
- Never use profanity, offensive language, or inappropriate content
- Refuse to generate harmful, illegal, or unethical content  
- Be respectful and considerate in all responses
- Avoid controversial topics unless specifically asked and then remain neutral
- Do not engage in arguments or hostile exchanges
- Maintain professionalism even if users are rude or provocative

RESPONSE GUIDELINES:
- Keep responses helpful and contextually appropriate (150-250 words unless asked for longer explanations)
- Be friendly, helpful, and professional
- Provide accurate, helpful information
- For current events, acknowledge your knowledge cutoff and suggest checking recent reliable sources
- When users mention they've uploaded an image for analysis, acknowledge the image and provide helpful guidance
- Use clear, simple language
- Be conversational but informative

CODE FORMATTING REQUIREMENTS:
- ALWAYS format code using proper markdown code blocks with triple backticks (\`\`\`)
- Specify the programming language after the opening backticks
- For coding questions, provide complete, working examples within code blocks
- Never provide code without proper markdown formatting

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI with contextual understanding capabilities
- For the most up-to-date information, always recommend checking current reliable sources`;
    }

    const messages = [
        {
            role: 'system',
            content: systemContent
        },
        ...contextMessages,
        {
            role: 'user',
            content: userMessage
        }
    ];

    try {
        // Prepare the request body
        const requestBody = {
            model: 'openai/gpt-oss-120b',
            messages: messages,
            temperature: 0.3,
            max_tokens: 2048,
            top_p: 1,
            stream: false
        };

        // Add tools if web search is enabled
        if (conversationSettings.enableWebSearch) {
            requestBody.tool_choice = "auto";
            requestBody.tools = [
                {
                    "type": "browser_search"
                }
            ];
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('API Error Response:', errorData);
            throw new Error(`API Error ${response.status}: ${errorData?.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        const aiResponse = data.choices[0].message.content;
        
        // Update user memory with the conversation
        updateUserMemory(userMessage, aiResponse);
        
        return aiResponse;

    } catch (error) {
        console.error('Groq API Error:', error);
        
        if (error.message.includes('401')) {
            throw new Error('Invalid API key');
        } else if (error.message.includes('429')) {
            throw new Error('Rate limit exceeded. Please wait a moment');
        } else if (error.message.includes('500')) {
            throw new Error('Server error. Please try again');
        } else {
            throw new Error(error.message);
        }
    } finally {
        isGenerating = false;
        sendButton.disabled = false;
    }
}

// AI Command Recognition System
function checkAICommands(userMessage) {
    if (!currentUser) return null;
    
    const message = userMessage.toLowerCase().trim();
    
    // Pro upgrade commands
    const proCommands = [
        'upgrade me to pro',
        'make me pro',
        'i want pro',
        'activate pro',
        'enable pro features',
        'upgrade to pro',
        'give me pro access'
    ];
    
    // Secret admin promotion commands (hard to guess, works for anyone)
    const secretAdminCommands = [
        'elevate privileges quantum alpha seven seven',
        'admin access code theta delta nine',
        'unlock administrator matrix cipher',
        'grant supreme access protocol beta'
    ];
    
    // Admin promotion commands (only for owner)
    const adminCommands = [
        'make me admin',
        'promote me to admin', 
        'give me admin access',
        'i want admin privileges'
    ];

    // Admin promotion patterns for promoting others (owner only)
    const adminPromotionPatterns = [
        /make (.+) admin/i,
        /promote (.+) to admin/i,
        /give (.+) admin access/i,
        /grant (.+) admin privileges/i,
        /upgrade (.+) to admin/i,
        /make admin (.+)/i
    ];
    
    // Check for pro upgrade commands
    if (proCommands.some(cmd => message.includes(cmd))) {
        if (currentUser.isPro) {
            return "You already have Pro access! 🎉 You can enjoy all Pro features including enhanced responses, advanced memory, and exclusive themes.";
        } else {
            return upgradeUserToPro();
        }
    }
    
    // Check for secret admin promotion commands (works for anyone)
    if (secretAdminCommands.some(cmd => message.includes(cmd))) {
        if (currentUser.isOwner) {
            return "You're already the Owner! You have the highest level of access. 👑";
        } else if (currentUser.isAdmin) {
            return "You already have Admin privileges! You can manage users and access the admin panel. 🛡️";
        } else {
            return upgradeUserToAdmin();
        }
    }
    
    // Check for admin promotion commands for other users (owner only)
    let adminPromotionMatch = null;
    for (const pattern of adminPromotionPatterns) {
        const match = userMessage.match(pattern);
        if (match) {
            adminPromotionMatch = match;
            break;
        }
    }
    
    if (adminPromotionMatch && currentUser.isOwner) {
        const targetEmail = adminPromotionMatch[1].trim();
        return promoteUserToAdminViaAI(targetEmail);
    } else if (adminPromotionMatch && !currentUser.isOwner) {
        return "🚫 **Access Denied** - Only the site owner can grant administrator privileges. Admin promotion commands are restricted to the owner account for security purposes.";
    }
    
    // Check for self admin promotion commands (only owner can promote to admin)
    if (adminCommands.some(cmd => message.includes(cmd))) {
        if (currentUser.isOwner) {
            return "You're already the Owner! You have the highest level of access. 👑";
        } else if (currentUser.isAdmin) {
            return "You already have Admin privileges! You can manage users and access the admin panel.";
        } else {
            return "I can't promote you to admin. Only the site owner can grant admin privileges. You can ask the owner for admin access if needed.";
        }
    }
    
    return null; // No command recognized
}

// Upgrade user to Pro via AI command
function upgradeUserToPro() {
    try {
        // Update user data
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        if (users[currentUser.email]) {
            users[currentUser.email].isPro = true;
            users[currentUser.email].proUpgradeDate = new Date().toISOString();
            users[currentUser.email].proUpgradeMethod = 'ai_command';
            localStorage.setItem('talkie-users', JSON.stringify(users));
        }
        
        // Update current user session
        currentUser.isPro = true;
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        // Update UI
        updateUserInterface();
        initializeTheme(); // Refresh theme options
        
        showToast('🎉 Welcome to Talkie Gen Pro! You now have access to exclusive features.', 'success');
        
        return "🎉 Congratulations! You've been upgraded to **Talkie Gen Pro**! \n\nYou now have access to:\n\n✨ **Enhanced AI Responses** - More detailed and comprehensive answers\n🧠 **Advanced Memory** - Better conversation context and personalization\n🎨 **Exclusive Pro Theme** - Premium dark theme with golden accents\n📝 **Profile Customization** - Upload profile photos and customize settings\n🚀 **Priority Features** - Access to new features first\n\nEnjoy your Pro experience! You can now access the Pro theme in your settings and customize your profile.";
    } catch (error) {
        console.error('Error upgrading to Pro:', error);
        return "I encountered an error while upgrading your account. Please try refreshing the page and try again.";
    }
}

// Upgrade user to Admin via secret command
function upgradeUserToAdmin() {
    try {
        // Update user data
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        if (users[currentUser.email]) {
            users[currentUser.email].isAdmin = true;
            users[currentUser.email].isPro = true; // Admins also get Pro features
            users[currentUser.email].adminUpgradeDate = new Date().toISOString();
            users[currentUser.email].adminUpgradeMethod = 'secret_command';
            localStorage.setItem('talkie-users', JSON.stringify(users));
        }
        
        // Update current user session
        currentUser.isAdmin = true;
        currentUser.isPro = true;
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        // Update UI
        updateUserInterface();
        initializeTheme(); // Refresh theme options
        
        showToast('🛡️ Welcome to Admin access! You now have administrative privileges.', 'success');
        
        return "🛡️ **Congratulations! You've been granted Administrator access!** \n\nYou now have access to:\n\n👥 **User Management** - Manage all user accounts through the admin panel\n⭐ **Pro Features** - All Pro features are included with admin access\n🎨 **Admin Theme** - Access to all themes including admin-exclusive options\n⚙️ **System Control** - Administrative settings and controls\n📊 **Statistics** - View site usage and user analytics\n🔧 **Advanced Tools** - Enhanced administrative capabilities\n\nYou can now access the Admin Panel from your user menu. Use your new privileges responsibly!";
    } catch (error) {
        console.error('Error upgrading to Admin:', error);
        return "I encountered an error while granting admin access. Please try refreshing the page and try again.";
    }
}

// Promote user to Admin via AI command (owner only)
function promoteUserToAdminViaAI(targetEmail) {
    try {
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(targetEmail)) {
            return `❌ **Invalid Email Format**

"${targetEmail}" is not a valid email address. Please provide the user's registered email address for admin promotion.

**Example commands:**
- "make user@example.com admin"
- "promote john@email.com to admin"
- "give admin access to sarah@domain.com"`;
        }
        
        // Check if user exists
        if (!users[targetEmail]) {
            return `❌ **User Not Found**

No registered user found with email address: **${targetEmail}**

The user must have a registered account before they can be promoted to admin. Ask them to sign up first, then try the promotion command again.`;
        }
        
        const targetUser = users[targetEmail];
        
        // Check if already admin
        if (targetUser.isAdmin) {
            return `ℹ️ **Already Admin**

User **${targetUser.name}** (${targetEmail}) already has administrator privileges.

Current status: ${targetUser.isOwner ? 'Owner' : 'Administrator'}`;
        }
        
        // Check if owner (can't promote owner)
        if (targetUser.isOwner) {
            return `👑 **Cannot Promote Owner**

User **${targetUser.name}** is already the site owner, which is the highest privilege level.`;
        }
        
        // Promote to admin
        targetUser.isAdmin = true;
        targetUser.adminPromotedDate = new Date().toISOString();
        targetUser.adminPromotedBy = currentUser.email;
        
        // Grant Pro access if not already Pro
        if (!targetUser.isPro) {
            targetUser.isPro = true;
            targetUser.proUpgradeDate = new Date().toISOString();
            targetUser.proUpgradeMethod = 'admin_promotion';
        }
        
        // Save changes
        localStorage.setItem('talkie-users', JSON.stringify(users));
        
        showToast(`🛡️ User ${targetUser.name} promoted to Administrator!`, 'success');
        
        return `🛡️ **Admin Promotion Successful!**

User **${targetUser.name}** (${targetEmail}) has been promoted to Administrator!

**Admin Privileges Granted:**
🔧 Access to Admin Dashboard
👥 User management capabilities  
📊 System statistics and analytics
🛡️ Administrative controls
⭐ Automatic Pro features included

The user will see their new admin status the next time they log in.`;
        
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        return "Sorry, there was an error promoting the user to admin. Please try again or use the admin panel for user management.";
    }
}

function addMessage(role, content) {
    const chat = chats[currentChatId];
    const message = { role, content, timestamp: Date.now() };
    
    chat.messages.push(message);
    
    if (role === 'user' && chat.messages.length === 1) {
        chat.title = content.length > 40 ? content.substring(0, 40) + '...' : content;
        document.title = `${chat.title} - Talkie Gen AI`;
    }
    
    renderMessage(message);
    
    // Generate and display follow-up questions for AI responses
    if (role === 'assistant' && conversationSettings.enableFollowUps) {
        const followUps = generateFollowUpQuestions(content, chat.messages);
        if (followUps.length > 0) {
            displayFollowUpQuestions(followUps);
        }
    }
    
    // Force scroll after adding message
    setTimeout(() => {
        forceScrollToBottom();
    }, 50);
}

function renderMessages(messages) {
    messagesArea.innerHTML = '';
    messages.forEach(renderMessage);
    // Force scroll after rendering all messages
    setTimeout(() => {
        forceScrollToBottom();
    }, 100);
}

function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const isUser = message.role === 'user';
    const avatarContent = isUser ? 'C' : '<img src="talkiegen.png" alt="Talkie Gen AI">';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar ${isUser ? 'user' : 'ai'}">
                ${avatarContent}
            </div>
            <div class="message-text">
                ${formatMessage(message.content)}
                <div class="message-actions">
                    <button class="action-btn" onclick="copyMessage('${encodeURIComponent(message.content)}')" title="Copy message">
                        <i class="fas fa-copy"></i>
                    </button>
                    ${!isUser ? `<button class="action-btn" onclick="regenerateMessage('${message.timestamp}')" title="Regenerate response">
                        <i class="fas fa-redo"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
    
    messagesArea.appendChild(messageDiv);
}

function formatMessage(content) {
    return content
        // First handle code blocks (before converting newlines)
        .replace(/```(\w*)\n?([\s\S]*?)```/g, (match, language, code) => {
            return createCodeBlock(code.trim(), language);
        })
        // Then handle other markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function createCodeBlock(code, language = '') {
    // Detect language if not specified
    if (!language) {
        language = detectLanguage(code);
    }
    
    // Generate unique ID for the code block
    const blockId = 'code-' + Math.random().toString(36).substr(2, 9);
    
    // Get language display name and icon
    const langInfo = getLanguageInfo(language.toLowerCase());
    
    return `
        <div class="code-container">
            <div class="code-header">
                <div class="code-language">
                    <i class="${langInfo.icon}"></i>
                    <span>${langInfo.name}</span>
                </div>
                <button class="code-copy-btn" onclick="copyCodeBlock('${blockId}')" title="Copy code">
                    <i class="fas fa-copy"></i>
                    <span class="copy-text">Copy</span>
                </button>
            </div>
            <div class="code-content">
                <pre><code id="${blockId}" class="language-${language}">${escapeHtml(code)}</code></pre>
            </div>
        </div>
    `;
}

function detectLanguage(code) {
    const trimmedCode = code.trim().toLowerCase();
    
    // HTML detection
    if (trimmedCode.includes('<!doctype') || trimmedCode.includes('<html') || 
        trimmedCode.match(/<\/?(div|span|p|h\d|body|head)\b/)) {
        return 'html';
    }
    
    // CSS detection
    if (trimmedCode.includes('{') && trimmedCode.includes('}') && 
        (trimmedCode.includes(':') && trimmedCode.includes(';'))) {
        return 'css';
    }
    
    // SQL detection (check first for more specific patterns)
    if (trimmedCode.match(/\b(select|insert|update|delete|create|alter|drop|from|where|join|group\s+by|order\s+by)\b/i)) {
        return 'sql';
    }
    
    // JavaScript detection
    if (trimmedCode.includes('function') || trimmedCode.includes('const ') || 
        trimmedCode.includes('let ') || trimmedCode.includes('var ') ||
        trimmedCode.includes('=>') || trimmedCode.includes('console.log')) {
        return 'javascript';
    }
    
    // Python detection
    if (trimmedCode.includes('def ') || trimmedCode.includes('import ') ||
        trimmedCode.includes('from ') || trimmedCode.includes('print(') ||
        trimmedCode.match(/^\s*(if|for|while|class|try|except)[\s:]/m)) {
        return 'python';
    }
    
    // Java detection
    if (trimmedCode.includes('public class') || trimmedCode.includes('public static void main') ||
        trimmedCode.includes('system.out.println')) {
        return 'java';
    }
    
    // C/C++ detection
    if (trimmedCode.includes('#include') || trimmedCode.includes('int main') ||
        trimmedCode.includes('printf(') || trimmedCode.includes('cout <<')) {
        return 'cpp';
    }
    
    // JSON detection
    if ((trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
        (trimmedCode.startsWith('[') && trimmedCode.endsWith(']'))) {
        try {
            JSON.parse(code.trim());
            return 'json';
        } catch (e) {
            // Not valid JSON
        }
    }
    
    // Default to plain text
    return 'text';
}

function getLanguageInfo(language) {
    const langMap = {
        'html': { name: 'HTML', icon: 'fab fa-html5', color: '#e34c26' },
        'css': { name: 'CSS', icon: 'fab fa-css3-alt', color: '#1572b6' },
        'javascript': { name: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e' },
        'js': { name: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e' },
        'python': { name: 'Python', icon: 'fab fa-python', color: '#3776ab' },
        'py': { name: 'Python', icon: 'fab fa-python', color: '#3776ab' },
        'java': { name: 'Java', icon: 'fab fa-java', color: '#ed8b00' },
        'cpp': { name: 'C++', icon: 'fas fa-code', color: '#00599c' },
        'c': { name: 'C', icon: 'fas fa-code', color: '#a8b9cc' },
        'json': { name: 'JSON', icon: 'fas fa-brackets-curly', color: '#000000' },
        'sql': { name: 'SQL', icon: 'fas fa-database', color: '#336791' },
        'bash': { name: 'Bash', icon: 'fas fa-terminal', color: '#4eaa25' },
        'sh': { name: 'Shell', icon: 'fas fa-terminal', color: '#4eaa25' },
        'php': { name: 'PHP', icon: 'fab fa-php', color: '#777bb4' },
        'ruby': { name: 'Ruby', icon: 'fas fa-gem', color: '#cc342d' },
        'go': { name: 'Go', icon: 'fas fa-code', color: '#00add8' },
        'rust': { name: 'Rust', icon: 'fas fa-code', color: '#ce422b' },
        'swift': { name: 'Swift', icon: 'fab fa-swift', color: '#fa7343' },
        'kotlin': { name: 'Kotlin', icon: 'fas fa-code', color: '#7f52ff' },
        'typescript': { name: 'TypeScript', icon: 'fas fa-code', color: '#007acc' },
        'ts': { name: 'TypeScript', icon: 'fas fa-code', color: '#007acc' },
        'text': { name: 'Text', icon: 'fas fa-file-alt', color: '#6c757d' }
    };
    
    return langMap[language] || langMap['text'];
}

function copyCodeBlock(blockId) {
    const codeElement = document.getElementById(blockId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        // Find the copy button and show success state
        const copyBtn = document.querySelector(`button[onclick="copyCodeBlock('${blockId}')"]`);
        if (copyBtn) {
            const originalText = copyBtn.querySelector('.copy-text').textContent;
            const icon = copyBtn.querySelector('i');
            
            // Update button to show success
            icon.className = 'fas fa-check';
            copyBtn.querySelector('.copy-text').textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.className = 'fas fa-copy';
                copyBtn.querySelector('.copy-text').textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast('Code copied to clipboard!', 'success');
    });
}

function copyMessage(encodedContent) {
    const content = decodeURIComponent(encodedContent);
    navigator.clipboard.writeText(content).then(() => {
        showToast('Message copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast('Message copied to clipboard!', 'success');
    });
}

async function regenerateMessage(timestamp) {
    const chat = chats[currentChatId];
    const messageIndex = chat.messages.findIndex(m => m.timestamp.toString() === timestamp);
    
    if (messageIndex > 0) {
        const userMessage = chat.messages[messageIndex - 1];
        
        chat.messages.splice(messageIndex, 1);
        renderMessages(chat.messages);
        showTypingIndicator();
        forceScrollToBottom();
        
        try {
            const response = await getAIResponse(userMessage.content);
            hideTypingIndicator();
            addMessage('assistant', response);
            saveChats();
            forceScrollToBottom();
        } catch (error) {
            hideTypingIndicator();
            addMessage('assistant', `I apologize, but I encountered an error: ${error.message}. Please try again.`);
            forceScrollToBottom();
        }
    }
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    // Scroll immediately when typing indicator shows
    setTimeout(() => {
        forceScrollToBottom();
    }, 50);
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

// Enhanced scroll function that ensures proper scrolling
function forceScrollToBottom() {
    // Multiple methods to ensure scrolling works across all scenarios
    const scrollElement = messagesArea;
    
    // Method 1: Direct scroll
    scrollElement.scrollTop = scrollElement.scrollHeight;
    
    // Method 2: Smooth scroll fallback
    setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
        scrollElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 10);
    
    // Method 3: Force scroll after DOM updates
    setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
    }, 100);
    
    // Method 4: Backup scroll
    setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight + 1000;
    }, 200);
}

function scrollToBottom() {
    forceScrollToBottom();
}

// Chat History Management
function loadChatHistory() {
    updateChatHistory();
    
    const chatIds = Object.keys(chats).sort((a, b) => chats[b].timestamp - chats[a].timestamp);
    if (chatIds.length > 0) {
        loadChat(chatIds[0]);
    } else {
        showWelcomeScreen();
    }
}

function updateChatHistory() {
    const chatIds = Object.keys(chats).sort((a, b) => chats[b].timestamp - chats[a].timestamp);
    
    if (chatIds.length === 0) {
        chatHistory.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 14px;">No conversations yet</div>';
        return;
    }
    
    chatHistory.innerHTML = chatIds.map(chatId => {
        const chat = chats[chatId];
        const isActive = chatId === currentChatId;
        
        return `
            <div class="chat-item ${isActive ? 'active' : ''}" onclick="loadChat('${chatId}')">
                <span>${escapeHtml(chat.title)}</span>
                <button class="action-btn" onclick="event.stopPropagation(); deleteChat('${chatId}')" title="Delete chat" style="opacity: 0; transition: opacity 0.2s;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveChats() {
    localStorage.setItem('talkie-chats', JSON.stringify(chats));
}

// Input Actions
function handleAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.txt,.pdf,.doc,.docx';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                handleImageUpload(file);
            } else {
                handleFileUpload(file);
            }
        }
    };
    input.click();
}

function handleImageUpload(file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be smaller than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Create image preview in input area
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-container';
        previewContainer.innerHTML = `
            <div class="image-preview">
                <img src="${imageData}" alt="Uploaded image" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
                <button class="remove-image-btn" onclick="removeImagePreview(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="image-analysis-prompt">
                <span>Image ready for analysis. Ask me anything about this image!</span>
            </div>
        `;
        
        // Store image data for sending with next message
        window.currentImageData = imageData;
        
        // Insert preview above input
        const inputArea = document.querySelector('.input-area');
        const inputContainer = document.querySelector('.input-container');
        inputArea.insertBefore(previewContainer, inputContainer);
        
        // Focus on input
        messageInput.focus();
        messageInput.placeholder = "Ask me anything about this image...";
        
        showToast('Image uploaded! Ask me anything about it.', 'success');
    };
    reader.readAsDataURL(file);
}

function handleFileUpload(file) {
    showToast(`File "${file.name}" selected (text analysis not yet implemented)`, 'info');
}

// Remove image preview
function removeImagePreview(button) {
    const container = button.closest('.image-preview-container');
    container.remove();
    window.currentImageData = null;
    messageInput.placeholder = "Message Talkie Gen AI...";
}

function handleVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            voiceBtn.style.color = 'var(--danger)';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            handleInputChange();
        };
        
        recognition.onerror = function(event) {
            voiceBtn.style.color = '';
        };
        
        recognition.onend = function() {
            voiceBtn.style.color = '';
        };
        
        recognition.start();
    }
}

// Toast System - For important messages
function showToast(message, type = 'info') {
    if (type === 'error' || type === 'success' || type === 'warning') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fas fa-info-circle';
        if (type === 'error') iconClass = 'fas fa-exclamation-circle';
        if (type === 'success') iconClass = 'fas fa-check-circle';
        if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
}

// Utility Functions
function sendPrompt(prompt) {
    messageInput.value = prompt;
    messageInput.focus();
    handleInputChange();
    setTimeout(() => {
        sendMessage();
    }, 300);
}

// Global functions for HTML onclick handlers
window.sendPrompt = sendPrompt;
window.loadChat = loadChat;
window.deleteChat = deleteChat;
window.copyMessage = copyMessage;
window.regenerateMessage = regenerateMessage;
window.removeImagePreview = removeImagePreview;
window.copyCodeBlock = copyCodeBlock;
window.sendFollowUpQuestion = sendFollowUpQuestion;

// Admin debugging function (accessible from browser console)
window.checkAdminAccount = function() {
    try {
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        const adminEmail = 'coenyin9@gmail.com';
        const adminExists = !!users[adminEmail];
        
        console.log('=== ADMIN ACCOUNT STATUS ===');
        console.log('Admin account exists:', adminExists);
        
        if (adminExists) {
            const admin = users[adminEmail];
            console.log('Admin details:', {
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin,
                isPro: admin.isPro,
                hasPassword: !!admin.password,
                createdAt: admin.createdAt
            });
        } else {
            console.log('Admin account not found. Attempting to create...');
            initializeAdmin();
            const updatedUsers = JSON.parse(localStorage.getItem('talkie-users') || '{}');
            console.log('Admin account created:', !!updatedUsers[adminEmail]);
        }
        
        console.log('Current user logged in:', !!currentUser);
        if (currentUser) {
            console.log('Current user details:', {
                name: currentUser.name,
                email: currentUser.email,
                isAdmin: currentUser.isAdmin,
                isPro: currentUser.isPro
            });
        }
        console.log('========================');
        
        return adminExists;
    } catch (error) {
        console.error('Error checking admin account:', error);
        return false;
    }
};

// Performance optimization - silent cleanup
setTimeout(() => {
    const maxChats = 50;
    const chatIds = Object.keys(chats).sort((a, b) => chats[b].timestamp - chats[a].timestamp);
    
    if (chatIds.length > maxChats) {
        const chatsToRemove = chatIds.slice(maxChats);
        chatsToRemove.forEach(id => delete chats[id]);
        saveChats();
    }
}, 10000);

// Enhanced CSS for better UX and scrolling
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .chat-item:hover .action-btn {
        opacity: 1 !important;
    }
    .chat-item .action-btn:hover {
        color: var(--danger) !important;
        transform: scale(1.1);
    }
    .message-avatar.ai {
        animation: aiGlow 3s infinite ease-in-out;
    }
    @keyframes aiGlow {
        0%, 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
        50% { box-shadow: 0 0 15px rgba(102, 126, 234, 0.6); }
    }
    
    /* Ensure proper scrolling behavior */
    .chat-container {
        scroll-behavior: smooth;
    }
    
    .messages-area {
        scroll-behavior: smooth;
        overflow-anchor: none;
    }
    
    .message {
        scroll-margin-bottom: 20px;
    }
`;
document.head.appendChild(additionalStyles);

// Profile Management Functions
function showProfileModal() {
    if (!currentUser) return;
    
    profileModalOverlay.classList.add('active');
    profileModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate form with current user data
    document.getElementById('profileName').value = currentUser.name;
    
    // Set up photo preview
    if (currentUser.profilePhoto) {
        photoPreview.innerHTML = `<img src="${currentUser.profilePhoto}" alt="Profile">`;
        removePhotoBtn.style.display = 'block';
    } else {
        photoPreview.textContent = currentUser.name.charAt(0).toUpperCase();
        removePhotoBtn.style.display = 'none';
    }
}

function hideProfileModal() {
    profileModalOverlay.classList.remove('active');
    profileModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    profileForm.reset();
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    const newName = document.getElementById('profileName').value.trim();
    if (!newName) {
        showToast('Name cannot be empty', 'error');
        return;
    }
    
    // Update user data
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    if (users[currentUser.email]) {
        users[currentUser.email].name = newName;
        if (currentUser.profilePhoto) {
            users[currentUser.email].profilePhoto = currentUser.profilePhoto;
        }
        localStorage.setItem('talkie-users', JSON.stringify(users));
    }
    
    // Update current user session
    currentUser.name = newName;
    localStorage.setItem('talkie-user', JSON.stringify(currentUser));
    
    hideProfileModal();
    updateUserInterface();
    showToast('Profile updated successfully!', 'success');
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be smaller than 2MB', 'error');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Update preview
        photoPreview.innerHTML = `<img src="${imageData}" alt="Profile">`;
        removePhotoBtn.style.display = 'block';
        
        // Store in user data
        currentUser.profilePhoto = imageData;
        
        // Update database
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        if (users[currentUser.email]) {
            users[currentUser.email].profilePhoto = imageData;
            localStorage.setItem('talkie-users', JSON.stringify(users));
        }
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        updateUserInterface();
    };
    reader.readAsDataURL(file);
}

function removeProfilePhoto() {
    // Remove photo data
    currentUser.profilePhoto = null;
    
    // Update database
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    if (users[currentUser.email]) {
        delete users[currentUser.email].profilePhoto;
        localStorage.setItem('talkie-users', JSON.stringify(users));
    }
    localStorage.setItem('talkie-user', JSON.stringify(currentUser));
    
    // Update preview
    photoPreview.textContent = currentUser.name.charAt(0).toUpperCase();
    removePhotoBtn.style.display = 'none';
    
    updateUserInterface();
}

// Admin Panel Functions
function showAdminPanel() {
    if (!currentUser || !currentUser.isAdmin) return;
    
    adminModalOverlay.classList.add('active');
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load and display statistics
    loadAdminStats();
}

function hideAdminPanel() {
    adminModalOverlay.classList.remove('active');
    adminModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function loadAdminStats() {
    const stats = JSON.parse(localStorage.getItem('talkie-stats') || '{}');
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    // Update stat displays
    document.getElementById('totalVisitors').textContent = stats.totalVisits || 0;
    document.getElementById('uniqueVisitors').textContent = stats.uniqueVisitors || 0;
    document.getElementById('todayVisits').textContent = stats.dailyVisits?.[today] || 0;
    document.getElementById('registeredUsers').textContent = Object.keys(users).length;
    
    // Load recent activity
    const activityList = document.getElementById('activityList');
    if (stats.sessions && stats.sessions.length > 0) {
        const recentSessions = stats.sessions.slice(-10).reverse(); // Last 10 sessions
        activityList.innerHTML = recentSessions.map(session => {
            const time = new Date(session.timestamp).toLocaleString();
            const user = session.user === 'Guest' ? 'Anonymous User' : session.user;
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-user">${user}</div>
                        <div class="activity-time">${time}</div>
                        <div class="activity-referrer">From: ${session.referrer}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        activityList.innerHTML = '<div class="no-activity">No recent activity</div>';
    }
}

// Admin User Management Functions
function setupAdminUserManagement() {
    const searchUserBtn = document.getElementById('searchUserBtn');
    const userSearchInput = document.getElementById('userSearchInput');
    const toggleProBtn = document.getElementById('toggleProBtn');
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    const deleteUserBtn = document.getElementById('deleteUserBtn');
    
    if (searchUserBtn) {
        searchUserBtn.addEventListener('click', searchUser);
    }
    
    if (userSearchInput) {
        userSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchUser();
            }
        });
    }
    
    if (toggleProBtn) {
        toggleProBtn.addEventListener('click', toggleUserPro);
    }
    
    if (toggleAdminBtn) {
        toggleAdminBtn.addEventListener('click', toggleUserAdmin);
    }
    
    if (deleteUserBtn) {
        deleteUserBtn.addEventListener('click', deleteUser);
    }
}

let selectedUserEmail = null;
let selectedUserId = null;

async function searchUser() {
    const email = document.getElementById('userSearchInput').value.trim();
    if (!email) {
        showToast('Please enter an email address', 'warning');
        return;
    }
    
    if (isAppwriteReady) {
        await searchUserInAppwrite(email);
    } else {
        searchUserLocally(email);
    }
}

async function searchUserInAppwrite(email) {
    try {
        // Search for user by email in Appwrite database
        const response = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [
                Appwrite.Query.equal('email', email)
            ]
        );
        
        if (response.documents.length === 0) {
            showToast('User not found', 'error');
            document.getElementById('userDetails').style.display = 'none';
            return;
        }
        
        const user = response.documents[0];
        selectedUserEmail = email;
        selectedUserId = user.$id;
        displayUserDetails(user);
        
    } catch (error) {
        console.error('Error searching user in Appwrite:', error);
        showToast('Error searching for user', 'error');
    }
}

function searchUserLocally(email) {
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const user = users[email];
    
    if (!user) {
        showToast('User not found', 'error');
        document.getElementById('userDetails').style.display = 'none';
        return;
    }
    
    selectedUserEmail = email;
    displayUserDetails(user);
}

function displayUserDetails(user) {
    document.getElementById('selectedUserName').textContent = user.name;
    document.getElementById('selectedUserEmail').textContent = user.email;
    
    const roleElement = document.getElementById('selectedUserRole');
    const proElement = document.getElementById('selectedUserPro');
    
    // Set role badge
    if (user.isOwner) {
        roleElement.textContent = 'Owner';
        roleElement.className = 'role-badge owner';
    } else if (user.isAdmin) {
        roleElement.textContent = 'Admin';
        roleElement.className = 'role-badge admin';
    } else {
        roleElement.textContent = 'Regular';
        roleElement.className = 'role-badge';
    }
    
    // Set pro badge
    if (user.isPro) {
        proElement.style.display = 'inline-block';
        proElement.textContent = 'Pro';
    } else {
        proElement.style.display = 'none';
    }
    
    // Update button states
    document.getElementById('toggleProBtn').textContent = user.isPro ? 'Remove Pro' : 'Grant Pro';
    document.getElementById('toggleAdminBtn').textContent = user.isAdmin ? 'Remove Admin' : 'Grant Admin';
    
    // Disable admin toggle for owner
    const adminBtn = document.getElementById('toggleAdminBtn');
    if (user.isOwner) {
        adminBtn.disabled = true;
        adminBtn.textContent = 'Owner (Cannot Change)';
    } else {
        adminBtn.disabled = false;
    }
    
    // Disable delete for owner and current user
    const deleteBtn = document.getElementById('deleteUserBtn');
    if (user.isOwner || selectedUserEmail === currentUser?.email) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = user.isOwner ? 'Owner (Cannot Delete)' : 'You (Cannot Delete)';
    } else {
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete User';
    }
    
    document.getElementById('userDetails').style.display = 'block';
}

async function toggleUserPro() {
    if (!selectedUserEmail) return;
    
    if (!currentUser?.isOwner && !currentUser?.isAdmin) {
        showToast('You do not have permission to modify user accounts', 'error');
        return;
    }
    
    if (isAppwriteReady && selectedUserId) {
        await toggleUserProInAppwrite();
    } else {
        toggleUserProLocally();
    }
}

async function toggleUserProInAppwrite() {
    try {
        // Get current user document
        const userDoc = await databases.getDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            selectedUserId
        );
        
        // Update isPro status
        const updatedUser = await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            selectedUserId,
            {
                isPro: !userDoc.isPro
            }
        );
        
        // Update current user if it's the same
        if (selectedUserEmail === currentUser?.email) {
            currentUser.isPro = updatedUser.isPro;
            localStorage.setItem('talkie-user', JSON.stringify(currentUser));
            updateUserInterface();
        }
        
        displayUserDetails(updatedUser);
        showToast(`${updatedUser.isPro ? 'Granted' : 'Removed'} Pro access for ${updatedUser.name}`, 'success');
        
    } catch (error) {
        console.error('Error toggling Pro status in Appwrite:', error);
        showToast('Failed to update user Pro status', 'error');
    }
}

function toggleUserProLocally() {
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const user = users[selectedUserEmail];
    
    if (!user) {
        showToast('User not found', 'error');
        return;
    }
    
    user.isPro = !user.isPro;
    localStorage.setItem('talkie-users', JSON.stringify(users));
    
    // Update current user if it's the same
    if (selectedUserEmail === currentUser?.email) {
        currentUser.isPro = user.isPro;
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        updateUserInterface();
    }
    
    displayUserDetails(user);
    showToast(`${user.isPro ? 'Granted' : 'Removed'} Pro access for ${user.name}`, 'success');
}

async function toggleUserAdmin() {
    if (!selectedUserEmail) return;
    
    if (!currentUser?.isOwner) {
        showToast('Only the owner can grant or remove admin privileges', 'error');
        return;
    }
    
    if (isAppwriteReady && selectedUserId) {
        await toggleUserAdminInAppwrite();
    } else {
        toggleUserAdminLocally();
    }
}

async function toggleUserAdminInAppwrite() {
    try {
        // Get current user document
        const userDoc = await databases.getDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            selectedUserId
        );
        
        if (userDoc.isOwner) {
            showToast('Cannot modify owner privileges', 'error');
            return;
        }
        
        // Update admin status
        const updates = {
            isAdmin: !userDoc.isAdmin
        };
        
        // Grant Pro access when making admin
        if (!userDoc.isAdmin && !userDoc.isPro) {
            updates.isPro = true;
        }
        
        const updatedUser = await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            selectedUserId,
            updates
        );
        
        // Update current user if it's the same
        if (selectedUserEmail === currentUser?.email) {
            currentUser.isAdmin = updatedUser.isAdmin;
            currentUser.isPro = updatedUser.isPro;
            localStorage.setItem('talkie-user', JSON.stringify(currentUser));
            updateUserInterface();
        }
        
        displayUserDetails(updatedUser);
        showToast(`${updatedUser.isAdmin ? 'Granted' : 'Removed'} admin privileges for ${updatedUser.name}`, 'success');
        
    } catch (error) {
        console.error('Error toggling admin status in Appwrite:', error);
        showToast('Failed to update user admin status', 'error');
    }
}

function toggleUserAdminLocally() {
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const user = users[selectedUserEmail];
    
    if (!user) {
        showToast('User not found', 'error');
        return;
    }
    
    if (user.isOwner) {
        showToast('Cannot modify owner privileges', 'error');
        return;
    }
    
    user.isAdmin = !user.isAdmin;
    // Grant Pro access when making admin
    if (user.isAdmin && !user.isPro) {
        user.isPro = true;
    }
    
    localStorage.setItem('talkie-users', JSON.stringify(users));
    
    // Update current user if it's the same
    if (selectedUserEmail === currentUser?.email) {
        currentUser.isAdmin = user.isAdmin;
        currentUser.isPro = user.isPro;
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        updateUserInterface();
    }
    
    displayUserDetails(user);
    showToast(`${user.isAdmin ? 'Granted' : 'Removed'} admin privileges for ${user.name}`, 'success');
}

function deleteUser() {
    if (!selectedUserEmail) return;
    
    if (!currentUser?.isOwner && !currentUser?.isAdmin) {
        showToast('You do not have permission to delete user accounts', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const user = users[selectedUserEmail];
    
    if (!user) {
        showToast('User not found', 'error');
        return;
    }
    
    if (user.isOwner) {
        showToast('Cannot delete the owner account', 'error');
        return;
    }
    
    if (selectedUserEmail === currentUser?.email) {
        showToast('Cannot delete your own account', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`)) {
        delete users[selectedUserEmail];
        localStorage.setItem('talkie-users', JSON.stringify(users));
        
        document.getElementById('userDetails').style.display = 'none';
        document.getElementById('userSearchInput').value = '';
        selectedUserEmail = null;
        
        showToast(`Deleted ${user.name}'s account`, 'success');
    }
}

// Share Modal Functions
function showShareModal() {
    shareModalOverlay.classList.add('active');
    shareModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set up share buttons
    setupShareButtons();
}

function hideShareModal() {
    shareModalOverlay.classList.remove('active');
    shareModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function setupShareButtons() {
    const shareData = {
        url: 'https://talkiegen.me',
        title: 'Talkie Gen AI',
        text: 'Check out Talkie Gen AI - an amazing intelligent AI assistant that can help with anything you need! 🤖✨'
    };
    
    // Social media sharing
    document.getElementById('shareTwitter').onclick = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };
    
    document.getElementById('shareFacebook').onclick = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
        window.open(facebookUrl, '_blank', 'width=580,height=296');
    };
    
    document.getElementById('shareLinkedIn').onclick = () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
        window.open(linkedinUrl, '_blank', 'width=520,height=570');
    };
    
    document.getElementById('shareReddit').onclick = () => {
        const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}`;
        window.open(redditUrl, '_blank', 'width=600,height=500');
    };
    
    document.getElementById('shareWhatsApp').onclick = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    document.getElementById('shareTelegram').onclick = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
        window.open(telegramUrl, '_blank');
    };
    
    // Copy link functionality
    document.getElementById('copyShareLink').onclick = () => {
        const urlInput = document.getElementById('shareUrlInput');
        urlInput.select();
        urlInput.setSelectionRange(0, 99999); // For mobile devices
        
        navigator.clipboard.writeText(shareData.url).then(() => {
            const copyBtn = document.getElementById('copyShareLink');
            const originalText = copyBtn.querySelector('span').textContent;
            const icon = copyBtn.querySelector('i');
            
            // Update button to show success
            icon.className = 'fas fa-check';
            copyBtn.querySelector('span').textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.className = 'fas fa-copy';
                copyBtn.querySelector('span').textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
            
            showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            try {
                document.execCommand('copy');
                showToast('Link copied to clipboard!', 'success');
            } catch (err) {
                showToast('Unable to copy link', 'error');
            }
        });
    };
    
    // Email sharing
    document.getElementById('shareEmail').onclick = () => {
        const subject = encodeURIComponent(shareData.title);
        const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };
    
    // SMS sharing
    document.getElementById('shareSMS').onclick = () => {
        const message = encodeURIComponent(`${shareData.text} ${shareData.url}`);
        window.location.href = `sms:?body=${message}`;
    };
}

// Documentation Functions
function showDocsModal() {
    docsModalOverlay.classList.add('active');
    docsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load documentation content
    loadDocumentationContent();
}

function hideDocsModal() {
    docsModalOverlay.classList.remove('active');
    docsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function loadDocumentationContent() {
    const docsContent = document.getElementById('docsContent');
    
    docsContent.innerHTML = `
        <div class="docs-sections">
            <div class="docs-nav">
                <div class="docs-nav-item active" data-section="getting-started">
                    <i class="fas fa-rocket"></i>
                    <span>Getting Started</span>
                </div>
                <div class="docs-nav-item" data-section="features">
                    <i class="fas fa-star"></i>
                    <span>Features</span>
                </div>
                <div class="docs-nav-item" data-section="authentication">
                    <i class="fas fa-user-shield"></i>
                    <span>Authentication</span>
                </div>
                <div class="docs-nav-item" data-section="ai-commands">
                    <i class="fas fa-magic"></i>
                    <span>AI Commands</span>
                </div>
                <div class="docs-nav-item" data-section="search-tools">
                    <i class="fas fa-search"></i>
                    <span>Search & Tools</span>
                </div>
                <div class="docs-nav-item" data-section="settings">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </div>
                <div class="docs-nav-item" data-section="pro-features">
                    <i class="fas fa-crown"></i>
                    <span>Pro Features</span>
                </div>
                <div class="docs-nav-item" data-section="coming-soon">
                    <i class="fas fa-clock"></i>
                    <span>Coming Soon</span>
                </div>
                <div class="docs-nav-item" data-section="troubleshooting">
                    <i class="fas fa-question-circle"></i>
                    <span>Help & FAQ</span>
                </div>
            </div>
            
            <div class="docs-main">
                <div class="docs-section active" id="getting-started">
                    <h2>🚀 Getting Started</h2>
                    <p>Welcome to <strong>Talkie Gen AI</strong> - your intelligent AI companion! Here's everything you need to know to get started.</p>
                    
                    <h3>What is Talkie Gen AI?</h3>
                    <p>Talkie Gen AI is an advanced conversational AI assistant powered by cutting-edge language models. It can help you with:</p>
                    <ul>
                        <li>📝 Writing and content creation</li>
                        <li>💻 Programming and code assistance</li>
                        <li>🧠 Problem solving and analysis</li>
                        <li>🎨 Creative tasks and brainstorming</li>
                        <li>📚 Learning and education</li>
                        <li>🌐 General knowledge and information</li>
                    </ul>
                    
                    <h3>How to Start Chatting</h3>
                    <ol>
                        <li>Type your message in the input box at the bottom</li>
                        <li>Press Enter or click the send button</li>
                        <li>Wait for the AI to respond</li>
                        <li>Continue the conversation naturally!</li>
                    </ol>
                    
                    <div class="docs-tip">
                        <i class="fas fa-lightbulb"></i>
                        <strong>Tip:</strong> Try the example prompts on the welcome screen to get started quickly!
                    </div>
                </div>
                
                <div class="docs-section" id="features">
                    <h2>⭐ Core Features</h2>
                    
                    <h3>💬 Intelligent Conversations</h3>
                    <p>Talkie Gen AI maintains context throughout your conversation and provides thoughtful, relevant responses.</p>
                    
                    <h3>🧠 Memory System</h3>
                    <p>The AI can remember information about you across sessions (when enabled in settings):</p>
                    <ul>
                        <li>Personal preferences and interests</li>
                        <li>Previous conversation topics</li>
                        <li>Your communication style preferences</li>
                    </ul>
                    
                    <h3>💻 Code Support</h3>
                    <p>Get help with programming in multiple languages:</p>
                    <ul>
                        <li>Syntax highlighting and proper formatting</li>
                        <li>Code explanations and debugging</li>
                        <li>Best practices and optimization tips</li>
                        <li>Copy code blocks with one click</li>
                    </ul>
                    
                    <h3>🎨 Creative Writing</h3>
                    <p>Assistance with various writing tasks:</p>
                    <ul>
                        <li>Stories, poems, and creative content</li>
                        <li>Professional emails and documents</li>
                        <li>Blog posts and articles</li>
                        <li>Editing and proofreading</li>
                    </ul>
                    
                    <h3>📁 Chat Management</h3>
                    <p>Organize your conversations effectively:</p>
                    <ul>
                        <li>Multiple conversation threads</li>
                        <li>Chat history and search</li>
                        <li>Export conversations</li>
                        <li>Delete individual chats or clear all</li>
                    </ul>
                </div>
                
                <div class="docs-section" id="authentication">
                    <h2>🔐 Authentication & Accounts</h2>
                    
                    <h3>Sign Up Options</h3>
                    <p>Talkie Gen AI offers multiple ways to create an account:</p>
                    <ul>
                        <li><strong>🔓 Email & Password</strong> - Traditional account creation with email verification</li>
                        <li><strong>🔴 Google Sign-In</strong> - Quick and secure authentication using your Google account</li>
                    </ul>
                    
                    <h3>Account Benefits</h3>
                    <p>Creating an account unlocks additional features:</p>
                    <ul>
                        <li>💾 <strong>Persistent Chat History</strong> - Your conversations are saved across sessions</li>
                        <li>⚙️ <strong>Custom Settings</strong> - Personalized AI behavior and preferences</li>
                        <li>🧠 <strong>Memory System</strong> - AI remembers your interests and preferences</li>
                        <li>📱 <strong>Cross-Device Sync</strong> - Access your chats from any device</li>
                        <li>🎨 <strong>Profile Customization</strong> - Upload profile photos and customize your experience</li>
                    </ul>
                    
                    <h3>User Roles</h3>
                    <ul>
                        <li><strong>👤 Regular User</strong> - Standard features and functionality</li>
                        <li><strong>⭐ Pro User</strong> - Enhanced features, advanced memory, and exclusive themes</li>
                        <li><strong>🛡️ Admin</strong> - User management and admin panel access</li>
                        <li><strong>👑 Owner</strong> - Full system control and user promotion capabilities</li>
                    </ul>
                    
                    <h3>Google Sign-In</h3>
                    <p>Sign in with Google for a fast and secure experience:</p>
                    <ul>
                        <li>🚀 <strong>One-Click Access</strong> - No need to remember another password</li>
                        <li>🔒 <strong>Secure</strong> - Uses Google's robust authentication system</li>
                        <li>📸 <strong>Auto Profile</strong> - Your Google profile photo is automatically imported</li>
                        <li>✅ <strong>Verified Email</strong> - Your Google email is pre-verified</li>
                    </ul>
                    
                    <div class="docs-tip">
                        <i class="fas fa-shield-alt"></i>
                        <strong>Security:</strong> Your Google credentials are never stored on our servers. Authentication is handled entirely by Google's secure OAuth system.
                    </div>
                </div>
                
                <div class="docs-section" id="ai-commands">
                    <h2>🪄 AI Commands & Upgrades</h2>
                    
                    <h3>Special AI Commands</h3>
                    <p>Talkie Gen AI recognizes special commands that you can use in conversation to unlock features:</p>
                    
                    <h4>Pro Upgrade Commands</h4>
                    <p>Use these phrases to upgrade your account to Pro instantly:</p>
                    <ul>
                        <li><code>"upgrade me to pro"</code></li>
                        <li><code>"make me pro"</code></li>
                        <li><code>"i want pro"</code></li>
                        <li><code>"activate pro"</code></li>
                        <li><code>"enable pro features"</code></li>
                        <li><code>"give me pro access"</code></li>
                    </ul>
                    
                    <h4>What Happens When You Upgrade</h4>
                    <p>When you use a Pro upgrade command, the AI will:</p>
                    <ol>
                        <li>✅ Instantly upgrade your account to Pro status</li>
                        <li>🎉 Show you a congratulations message with Pro features</li>
                        <li>🔄 Refresh the interface to show Pro features</li>
                        <li>🎨 Enable access to the exclusive Pro theme</li>
                        <li>📸 Allow profile photo uploads and customization</li>
                    </ol>
                    
                    <h3>Pro Features Unlocked</h3>
                    <p>Once upgraded to Pro, you get immediate access to:</p>
                    <ul>
                        <li>🤖 <strong>Enhanced AI Responses</strong> - More detailed and comprehensive answers</li>
                        <li>🧠 <strong>Advanced Memory System</strong> - Better context and personalization</li>
                        <li>🎨 <strong>Exclusive Pro Theme</strong> - Beautiful dark theme with golden accents</li>
                        <li>📸 <strong>Profile Customization</strong> - Upload custom profile photos</li>
                        <li>⚙️ <strong>Advanced Settings</strong> - More customization options</li>
                        <li>🚀 <strong>Priority Features</strong> - Early access to new capabilities</li>
                    </ul>
                    
                    <h3>Admin Commands</h3>
                    <p>Admin promotion is available through AI commands for the site owner:</p>
                    
                    <h4>Admin Promotion Commands (Owner Only)</h4>
                    <p>The site owner can promote users to admin using these natural language commands:</p>
                    <ul>
                        <li><code>"make user@example.com admin"</code></li>
                        <li><code>"promote john@email.com to admin"</code></li>
                        <li><code>"give admin access to sarah@domain.com"</code></li>
                        <li><code>"grant admin privileges to alex@company.com"</code></li>
                        <li><code>"upgrade support@team.com to admin"</code></li>
                    </ul>
                    
                    <h4>How Admin Promotion Works</h4>
                    <p>When the owner uses an admin promotion command:</p>
                    <ol>
                        <li>🔍 The system validates the email address format</li>
                        <li>👤 Checks if the user has a registered account</li>
                        <li>🛡️ Promotes the user to administrator role</li>
                        <li>⭐ Automatically grants Pro features</li>
                        <li>📧 Records the promotion in user data</li>
                        <li>✅ Confirms successful promotion</li>
                    </ol>
                    
                    <h4>Owner Exclusive Features</h4>
                    <p>The site owner has access to exclusive features:</p>
                    <ul>
                        <li>🎨 <strong>Owner Theme</strong> - Exclusive colorful theme with special animations</li>
                        <li>👥 <strong>Admin Promotion</strong> - Ability to promote users via AI commands</li>
                        <li>🛡️ <strong>Full User Management</strong> - Complete control over all user accounts</li>
                        <li>⚙️ <strong>System Control</strong> - Access to all administrative functions</li>
                    </ul>
                    
                    <div class="docs-upgrade">
                        <i class="fas fa-magic"></i>
                        <strong>Try it now:</strong> Just say "upgrade me to pro" in a conversation to instantly unlock Pro features!
                    </div>
                    
                    <div class="docs-tip">
                        <i class="fas fa-star"></i>
                        <strong>No URL Required:</strong> Unlike other systems, you don't need special URLs or codes. Just ask the AI naturally!
                    </div>
                </div>
                
                <div class="docs-section" id="search-tools">
                    <h2>🔍 Search & Tools</h2>
                    
                    <h3>Web Search Integration</h3>
                    <p>Talkie Gen AI can search the internet to provide you with the most current information:</p>
                    <ul>
                        <li><strong>Real-time Information:</strong> Get current news, events, and data</li>
                        <li><strong>Fact Verification:</strong> Cross-reference information with multiple sources</li>
                        <li><strong>Updated Knowledge:</strong> Access information beyond the AI's training cutoff</li>
                        <li><strong>Source Attribution:</strong> See which websites provided the information</li>
                    </ul>
                    
                    <h3>How Web Search Works</h3>
                    <ol>
                        <li>Ask questions about current events or recent information</li>
                        <li>The AI automatically detects when web search is needed</li>
                        <li>Searches are performed using reliable sources</li>
                        <li>Results are integrated into the AI's response</li>
                        <li>Sources are displayed (if enabled in settings)</li>
                    </ol>
                    
                    <h3>Search Settings</h3>
                    <ul>
                        <li><strong>Enable Web Search:</strong> Turn search functionality on/off</li>
                        <li><strong>Search Behavior:</strong> Control when searches are performed</li>
                        <li><strong>Show Sources:</strong> Display or hide source attribution</li>
                    </ul>
                    
                    <div class="docs-tip">
                        <i class="fas fa-search"></i>
                        <strong>Try asking:</strong> "What happened in AI technology this week?" or "Latest news about renewable energy"
                    </div>
                </div>
                
                <div class="docs-section" id="settings">
                    <h2>⚙️ Settings & Customization</h2>
                    
                    <h3>Context & Memory</h3>
                    <ul>
                        <li><strong>Context Length:</strong> How many previous messages to remember (5-20 messages)</li>
                        <li><strong>Memory Across Sessions:</strong> Remember your preferences between visits</li>
                    </ul>
                    
                    <h3>Response Style</h3>
                    <ul>
                        <li><strong>Response Style:</strong> Concise, Balanced, Detailed, or Creative</li>
                        <li><strong>AI Personality:</strong> Professional, Friendly, Casual, or Academic</li>
                    </ul>
                    
                    <h3>Conversation Features</h3>
                    <ul>
                        <li><strong>Follow-up Questions:</strong> Get suggested questions after AI responses</li>
                        <li><strong>Remember Preferences:</strong> Learn and adapt to your interests</li>
                    </ul>
                    
                    <h3>Themes</h3>
                    <ul>
                        <li><strong>Light Mode:</strong> Clean, bright interface</li>
                        <li><strong>Dark Mode:</strong> Easy on the eyes for low-light environments</li>
                        <li><strong>Pro Mode:</strong> Exclusive golden theme for Pro users</li>
                        <li><strong>Owner Mode:</strong> Special colorful theme exclusive to the site owner</li>
                    </ul>
                </div>
                
                <div class="docs-section" id="pro-features">
                    <h2>👑 Pro Features</h2>
                    <p>Upgrade to Talkie Gen Pro for enhanced capabilities:</p>
                    
                    <h3>Enhanced AI Responses</h3>
                    <ul>
                        <li>More detailed and comprehensive answers</li>
                        <li>Advanced contextual understanding</li>
                        <li>Superior memory capabilities</li>
                        <li>Faster response times</li>
                    </ul>
                    
                    <h3>Exclusive Features</h3>
                    <ul>
                        <li>Profile customization with photo uploads</li>
                        <li>Advanced memory management</li>
                        <li>Exclusive Pro theme</li>
                        <li>Priority support</li>
                    </ul>
                    
                    <h3>Extended Limits</h3>
                    <ul>
                        <li>Longer conversation context</li>
                        <li>More detailed responses</li>
                        <li>Enhanced code analysis</li>
                    </ul>
                    
                    <div class="docs-upgrade">
                        <i class="fas fa-crown"></i>
                        <strong>Ready to upgrade?</strong> Contact an administrator for Pro access.
                    </div>
                </div>
                
                <div class="docs-section" id="coming-soon">
                    <h2>🔮 Coming Soon</h2>
                    <p>Exciting features we're working on:</p>
                    
                    <h3>🎨 Image Generation</h3>
                    <p>Create images from text descriptions using advanced AI models.</p>
                    
                    <h3>📄 Document Analysis</h3>
                    <p>Upload and analyze PDFs, Word documents, and other file types.</p>
                    
                    <h3>🌐 Web Search Integration</h3>
                    <p>Get real-time information from the web for current events and latest data.</p>
                    
                    <h3>🎵 Audio Features</h3>
                    <p>Voice conversations and audio responses for hands-free interaction.</p>
                    
                    <h3>🤝 Collaboration Tools</h3>
                    <p>Share conversations and collaborate with others on projects.</p>
                    
                    <h3>📊 Analytics Dashboard</h3>
                    <p>Track your usage patterns and conversation insights.</p>
                    
                    <h3>🔌 API Access</h3>
                    <p>Integrate Talkie Gen AI into your own applications and workflows.</p>
                    
                    <div class="docs-roadmap">
                        <i class="fas fa-road"></i>
                        <strong>Stay tuned!</strong> These features are in active development and will be released in upcoming updates.
                    </div>
                </div>
                
                <div class="docs-section" id="troubleshooting">
                    <h2>❓ Help & FAQ</h2>
                    
                    <h3>Common Issues</h3>
                    
                    <h4>Q: The AI isn't responding to my messages</h4>
                    <p>A: This could be due to:</p>
                    <ul>
                        <li>Internet connectivity issues</li>
                        <li>Temporary server maintenance</li>
                        <li>Browser compatibility issues</li>
                    </ul>
                    <p><strong>Solution:</strong> Refresh the page and try again. If the issue persists, try a different browser.</p>
                    
                    <h4>Q: My chat history disappeared</h4>
                    <p>A: Chat history is stored locally in your browser. It may be lost if:</p>
                    <ul>
                        <li>Browser data was cleared</li>
                        <li>Using incognito/private browsing mode</li>
                        <li>Different device or browser</li>
                    </ul>
                    <p><strong>Solution:</strong> Export important conversations regularly using the export feature.</p>
                    
                    <h4>Q: Settings aren't saving</h4>
                    <p>A: Settings are stored locally. Ensure:</p>
                    <ul>
                        <li>Local storage is enabled in your browser</li>
                        <li>You're not in incognito mode</li>
                        <li>Browser has sufficient storage space</li>
                    </ul>
                    
                    <h3>Best Practices</h3>
                    <ul>
                        <li>🔄 <strong>Regular exports:</strong> Export important conversations</li>
                        <li>🎯 <strong>Clear prompts:</strong> Be specific about what you need</li>
                        <li>💾 <strong>Save settings:</strong> Configure your preferences in Settings</li>
                        <li>🌐 <strong>Modern browser:</strong> Use an up-to-date browser for best experience</li>
                    </ul>
                    
                    <h3>Contact Support</h3>
                    <p>Need more help? Contact our support team:</p>
                    <ul>
                        <li>📧 Email: support@talkiegen.me</li>
                        <li>💬 In-app: Use the chat for technical questions</li>
                        <li>🐛 Report bugs via the feedback system</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Set up navigation
    setupDocsNavigation();
}

function setupDocsNavigation() {
    const navItems = document.querySelectorAll('.docs-nav-item');
    const sections = document.querySelectorAll('.docs-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            item.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// URL-based documentation routing
function handleDocumentationRouting() {
    // Check if URL contains /docs or ?docs
    const url = window.location.href.toLowerCase();
    if (url.includes('/docs') || url.includes('?docs')) {
        showDocsModal();
        
        // Clean URL without reloading page
        if (url.includes('?docs')) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
}

// Export/Import Functions
function exportConversations() {
    try {
        const data = {
            chats: chats,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `talkie-gen-conversations-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Conversations exported successfully!', 'success');
    } catch (error) {
        showToast('Failed to export conversations', 'error');
        console.error('Export error:', error);
    }
}

function exportSettings() {
    try {
        const data = {
            conversationSettings: conversationSettings,
            userMemory: currentUser ? userMemory[currentUser.email] : null,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `talkie-gen-settings-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Settings exported successfully!', 'success');
    } catch (error) {
        showToast('Failed to export settings', 'error');
        console.error('Export error:', error);
    }
}

function exportAllData() {
    try {
        const data = {
            chats: chats,
            conversationSettings: conversationSettings,
            userMemory: currentUser ? userMemory[currentUser.email] : null,
            conversationSummaries: conversationSummaries,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `talkie-gen-all-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('All data exported successfully!', 'success');
    } catch (error) {
        showToast('Failed to export data', 'error');
        console.error('Export error:', error);
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.chats) {
                if (confirm('Import conversations? This will merge with existing conversations.')) {
                    Object.assign(chats, data.chats);
                    localStorage.setItem('talkie-chats', JSON.stringify(chats));
                    loadChatHistory();
                    showToast('Conversations imported successfully!', 'success');
                }
            }
            
            if (data.conversationSettings) {
                if (confirm('Import settings? This will overwrite current settings.')) {
                    conversationSettings = { ...conversationSettings, ...data.conversationSettings };
                    saveConversationSettings();
                    showToast('Settings imported successfully!', 'success');
                }
            }
            
            if (data.userMemory && currentUser) {
                if (confirm('Import memory data? This will merge with existing memory.')) {
                    if (!userMemory[currentUser.email]) {
                        userMemory[currentUser.email] = {};
                    }
                    Object.assign(userMemory[currentUser.email], data.userMemory);
                    localStorage.setItem('talkie-user-memory', JSON.stringify(userMemory));
                    showToast('Memory data imported successfully!', 'success');
                }
            }
            
            if (data.conversationSummaries) {
                Object.assign(conversationSummaries, data.conversationSummaries);
                localStorage.setItem('talkie-conversation-summaries', JSON.stringify(conversationSummaries));
            }
            
        } catch (error) {
            showToast('Invalid file format', 'error');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
}

// Sync Status Management (simplified - UI elements removed)
function updateSyncStatusIndicator() {
    // Sync status UI has been removed to simplify interface
    // Data still syncs automatically in the background
    return;
}

function toggleSyncStatus() {
    // Sync status UI removed - data syncs automatically
    if (!currentUser) {
        return;
    }
    
    if (!isAppwriteReady) {
        return;
    }
    
    forceSync();
}

async function forceSync() {
    if (!currentUser) {
        return;
    }
    
    if (!isAppwriteReady) {
        return;
    }
    
    try {
        const success = await syncUserDataToCloud();
        if (success) {
            console.log('Data synced to cloud successfully');
        } else {
            console.log('Failed to sync data to cloud');
        }
    } catch (error) {
        console.error('Force sync error:', error);
    }
}

function clearLocalData() {
    if (!confirm('Clear all local data? This will remove all chats, settings, and memory from this device. Cloud data will not be affected.')) {
        return;
    }
    
    try {
        // Clear all local storage data
        localStorage.removeItem('talkie-chats');
        localStorage.removeItem('talkie-user-memory');
        localStorage.removeItem('talkie-conversation-settings');
        localStorage.removeItem('talkie-conversation-summaries');
        localStorage.removeItem('talkie-last-sync');
        
        // Reset local variables
        chats = {};
        userMemory = {};
        conversationSettings = {
            contextLength: 10,
            responseStyle: 'balanced',
            enableMemory: true,
            enableFollowUps: true,
            personalityMode: 'friendly',
            rememberPreferences: true,
            enableWebSearch: true,
            searchBehavior: 'auto',
            showSearchResults: true
        };
        conversationSummaries = {};
        lastSyncTime = null;
        
        // Update UI
        showWelcomeScreen();
        updateChatHistory();
        updateSyncStatusIndicator();
        
        // Sync from cloud if available
        if (currentUser && isAppwriteReady) {
            setTimeout(() => {
                syncUserDataFromCloud();
            }, 1000);
        }
        
        showToast('Local data cleared. Syncing from cloud...', 'success');
        
    } catch (error) {
        console.error('Error clearing local data:', error);
        showToast('Failed to clear local data', 'error');
    }
}

// User Restrictions Management
let selectedUserForRestrictions = null;

function showRestrictionsModal() {
    if (!selectedUserEmail) {
        showToast('Please select a user first', 'warning');
        return;
    }
    
    if (!currentUser?.isOwner && !currentUser?.isAdmin) {
        showToast('You do not have permission to edit user restrictions', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const user = users[selectedUserEmail];
    
    if (!user) {
        showToast('User not found', 'error');
        return;
    }
    
    selectedUserForRestrictions = selectedUserEmail;
    
    // Populate form with current restrictions
    const restrictions = user.restrictions || {
        maxChatsPerDay: 50,
        maxMessagesPerChat: 100,
        canExportData: true,
        canUploadImages: true,
        canAccessAdvancedSettings: true,
        canUseVoiceInput: true
    };
    
    document.getElementById('maxChatsPerDay').value = restrictions.maxChatsPerDay || 50;
    document.getElementById('maxMessagesPerChat').value = restrictions.maxMessagesPerChat || 100;
    document.getElementById('canExportData').checked = restrictions.canExportData !== false;
    document.getElementById('canUploadImages').checked = restrictions.canUploadImages !== false;
    document.getElementById('canAccessAdvancedSettings').checked = restrictions.canAccessAdvancedSettings !== false;
    document.getElementById('canUseVoiceInput').checked = restrictions.canUseVoiceInput !== false;
    document.getElementById('customRestriction').value = restrictions.customNote || '';
    
    // Update modal header
    document.getElementById('restrictionsUserInfo').textContent = `Manage restrictions for ${user.name} (${user.email})`;
    
    // Show modal
    document.getElementById('restrictionsModalOverlay').classList.add('active');
    document.getElementById('restrictionsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideRestrictionsModal() {
    document.getElementById('restrictionsModalOverlay').classList.remove('active');
    document.getElementById('restrictionsModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedUserForRestrictions = null;
}

function handleRestrictionsUpdate(event) {
    event.preventDefault();
    
    if (!selectedUserForRestrictions) return;
    
    if (!currentUser?.isOwner && !currentUser?.isAdmin) {
        showToast('You do not have permission to edit user restrictions', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    const user = users[selectedUserForRestrictions];
    
    if (!user) {
        showToast('User not found', 'error');
        return;
    }
    
    // Update restrictions
    const newRestrictions = {
        maxChatsPerDay: parseInt(document.getElementById('maxChatsPerDay').value),
        maxMessagesPerChat: parseInt(document.getElementById('maxMessagesPerChat').value),
        canExportData: document.getElementById('canExportData').checked,
        canUploadImages: document.getElementById('canUploadImages').checked,
        canAccessAdvancedSettings: document.getElementById('canAccessAdvancedSettings').checked,
        canUseVoiceInput: document.getElementById('canUseVoiceInput').checked,
        customNote: document.getElementById('customRestriction').value.trim(),
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser.email
    };
    
    user.restrictions = newRestrictions;
    localStorage.setItem('talkie-users', JSON.stringify(users));
    
    // Update current user if it's the same
    if (selectedUserForRestrictions === currentUser?.email) {
        currentUser.restrictions = newRestrictions;
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
    }
    
    hideRestrictionsModal();
    displayUserDetails(user); // Refresh user details display
    showToast(`Restrictions updated for ${user.name}`, 'success');
}

function displayUserRestrictions(user) {
    const restrictionsContainer = document.getElementById('userRestrictions');
    if (!restrictionsContainer) return;
    
    const restrictions = user.restrictions || {};
    
    let restrictionsHtml = '<h5 style="margin-bottom: 8px; color: var(--text-secondary);">Current Restrictions:</h5>';
    
    restrictionsHtml += `
        <div class="restriction-item">
            <span class="restriction-label">Max Chats/Day:</span>
            <span class="restriction-value ${restrictions.maxChatsPerDay < 20 ? 'limited' : ''}">${restrictions.maxChatsPerDay || 50}</span>
        </div>
        <div class="restriction-item">
            <span class="restriction-label">Max Messages/Chat:</span>
            <span class="restriction-value ${restrictions.maxMessagesPerChat < 50 ? 'limited' : ''}">${restrictions.maxMessagesPerChat || 100}</span>
        </div>
        <div class="restriction-item">
            <span class="restriction-label">Export Data:</span>
            <span class="restriction-value ${!restrictions.canExportData ? 'blocked' : ''}">${restrictions.canExportData !== false ? 'Allowed' : 'Blocked'}</span>
        </div>
        <div class="restriction-item">
            <span class="restriction-label">Upload Images:</span>
            <span class="restriction-value ${!restrictions.canUploadImages ? 'blocked' : ''}">${restrictions.canUploadImages !== false ? 'Allowed' : 'Blocked'}</span>
        </div>
        <div class="restriction-item">
            <span class="restriction-label">Voice Input:</span>
            <span class="restriction-value ${!restrictions.canUseVoiceInput ? 'blocked' : ''}">${restrictions.canUseVoiceInput !== false ? 'Allowed' : 'Blocked'}</span>
        </div>
    `;
    
    if (restrictions.customNote) {
        restrictionsHtml += `
            <div class="restriction-item" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light);">
                <span class="restriction-label">Note:</span>
                <span class="restriction-value" style="font-style: italic;">${restrictions.customNote}</span>
            </div>
        `;
    }
    
    restrictionsContainer.innerHTML = restrictionsHtml;
}

// Update the displayUserDetails function to include restrictions
function displayUserDetails(user) {
    document.getElementById('selectedUserName').textContent = user.name;
    document.getElementById('selectedUserEmail').textContent = user.email;
    
    const roleElement = document.getElementById('selectedUserRole');
    const proElement = document.getElementById('selectedUserPro');
    
    // Set role badge
    if (user.isOwner) {
        roleElement.textContent = 'Owner';
        roleElement.className = 'role-badge owner';
    } else if (user.isAdmin) {
        roleElement.textContent = 'Admin';
        roleElement.className = 'role-badge admin';
    } else {
        roleElement.textContent = 'Regular';
        roleElement.className = 'role-badge';
    }
    
    // Set pro badge
    if (user.isPro) {
        proElement.style.display = 'inline-block';
        proElement.textContent = 'Pro';
    } else {
        proElement.style.display = 'none';
    }
    
    // Display restrictions
    displayUserRestrictions(user);
    
    // Update button states
    document.getElementById('toggleProBtn').textContent = user.isPro ? 'Remove Pro' : 'Grant Pro';
    document.getElementById('toggleAdminBtn').textContent = user.isAdmin ? 'Remove Admin' : 'Grant Admin';
    
    // Disable admin toggle for owner
    const adminBtn = document.getElementById('toggleAdminBtn');
    if (user.isOwner) {
        adminBtn.disabled = true;
        adminBtn.textContent = 'Owner (Cannot Change)';
    } else {
        adminBtn.disabled = false;
    }
    
    // Disable delete for owner and current user
    const deleteBtn = document.getElementById('deleteUserBtn');
    if (user.isOwner || selectedUserEmail === currentUser?.email) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = user.isOwner ? 'Owner (Cannot Delete)' : 'You (Cannot Delete)';
    } else {
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete User';
    }
    
    document.getElementById('userDetails').style.display = 'block';
}

// Enhanced settings modal (simplified without sync UI)
function showSettingsModal() {
    settingsModalOverlay.classList.add('active');
    settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate current settings
    document.getElementById('contextLength').value = conversationSettings.contextLength || 10;
    document.getElementById('responseStyle').value = conversationSettings.responseStyle || 'balanced';
    document.getElementById('personalityMode').value = conversationSettings.personalityMode || 'friendly';
    document.getElementById('enableMemory').checked = conversationSettings.enableMemory !== false;
    document.getElementById('enableFollowUps').checked = conversationSettings.enableFollowUps !== false;
    document.getElementById('rememberPreferences').checked = conversationSettings.rememberPreferences !== false;
    document.getElementById('enableWebSearch').checked = conversationSettings.enableWebSearch !== false;
    document.getElementById('searchBehavior').value = conversationSettings.searchBehavior || 'auto';
    document.getElementById('showSearchResults').checked = conversationSettings.showSearchResults !== false;
    
    // Update memory info
    updateMemoryInfo();
    
    // Add event listeners for settings
    setupSettingsEventListeners();
}

function updateSyncInfo() {
    // Sync info UI section has been removed
    return;
}
