// API Configuration - Updated with Puter API
// Note: OpenRouter configuration replaced with Puter
// const OPENROUTER_API_KEY = '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';
// const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Initialize Puter API
function initializePuter() {
    try {
        if (typeof puter !== 'undefined') {
            console.log('✅ Puter API initialized successfully with GPT-5 nano model');
        } else {
            console.warn('⚠️ Puter SDK not loaded - Using fallback AI system instead');
            console.log('ℹ️ Fallback AI system provides local responses when external services are unavailable');
        }
    } catch (error) {
        console.error('❌ Error initializing Puter API:', error);
        console.log('ℹ️ Switching to fallback AI system for offline functionality');
    }
}

// Appwrite Configuration
const APPWRITE_ENDPOINT = 'https://syd.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68bb8b8b00136de837e5';
const APPWRITE_SERVER_API_KEY = 'standard_19b5bb2db393e1df689b8275ea2129dadbe72f183e10739fe087c76f239a03748b1967ee7bbe6533129fe087c76f239a03748b1967ee7bbe6533125';

// Initialize Appwrite client
let appwriteClient = null;
let appwriteAccount = null;
let appwriteDatabases = null;
let appwriteUsers = null; // For server-side user management

// Check if Appwrite is available
if (typeof Appwrite !== 'undefined') {
    const { Client, Account, Databases, Storage, Teams, Users } = Appwrite;
    appwriteClient = new Client();
    appwriteClient
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);

    appwriteAccount = new Account(appwriteClient);
    appwriteDatabases = new Databases(appwriteClient);
    
    // Initialize server client for admin operations
    let serverClient = new Client();
    serverClient.setEndpoint(APPWRITE_ENDPOINT);
    serverClient.setProject(APPWRITE_PROJECT_ID);
    serverClient.setKey(APPWRITE_SERVER_API_KEY);
    
    appwriteUsers = new Users(serverClient);
} else {
    console.warn('Appwrite SDK not loaded - authentication will be disabled');
}

// Server-side API functions for admin operations
async function makeServerRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${APPWRITE_ENDPOINT}${endpoint}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Appwrite-Project': APPWRITE_PROJECT_ID,
                'X-Appwrite-Key': APPWRITE_SERVER_API_KEY,
                ...options.headers
            },
            body: options.body ? JSON.stringify(options.body) : null
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Server request failed');
        }
        
        return data;
    } catch (error) {
        console.error('Server request error:', error);
        throw error;
    }
}

// Get all users (admin only)
async function getAllUsers() {
    try {
        const response = await makeServerRequest('/users');
        return response.users || [];
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
}

// Get user by ID (admin only)
async function getUserById(userId) {
    try {
        const response = await makeServerRequest(`/users/${userId}`);
        return response;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

// Update user (admin only)
async function updateUser(userId, data) {
    try {
        const response = await makeServerRequest(`/users/${userId}`, {
            method: 'PATCH',
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Delete user (admin only)
async function deleteUserById(userId) {
    try {
        const response = await makeServerRequest(`/users/${userId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

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
document.addEventListener('DOMContentLoaded', () => {
    initializePuter(); // Initialize Puter API
    initializeTheme();
    initializeAppwrite(); // Initialize Appwrite auth
    initializeAdmin(); // Initialize admin system
    trackVisitor(); // Track visitor statistics
    checkProUpgrade(); // Check for pro upgrade URL
    initializeMemorySystem(); // Initialize enhanced memory system
    handleDocumentationRouting(); // Handle docs URL routing
    setupEventListeners();
    setupCodeBlockEventListeners(); // Setup code block event listeners
    loadChatHistory();
    autoResizeTextarea();
    
    // Make debug functions globally available
    window.checkAdminSystem = checkAdminSystem;
    window.listAllUsers = listAllUsers;
    window.syncExistingUserData = syncExistingUserData;
    console.log('🔧 Debug functions available: checkAdminSystem(), listAllUsers(), syncExistingUserData()');
    console.log('🧪 Testing functions available: debugAISystem(), refreshCodeBlockListeners()');
});

// Appwrite authentication initialization
async function initializeAppwrite() {
    if (!appwriteAccount) {
        console.warn('Appwrite not available - skipping authentication initialization');
        return;
    }
    
    try {
        // Check if user is already logged in
        const session = await appwriteAccount.get();
        if (session) {
            currentUser = {
                name: session.name,
                email: session.email,
                appwriteId: session.$id,
                isPro: false,
                isAdmin: false,
                isOwner: session.email === 'coenyin9@gmail.com',
                profilePhoto: session.prefs?.profilePhoto || null
            };
            
            // Set admin/owner status for the owner account
            if (currentUser.isOwner) {
                currentUser.isAdmin = true;
                currentUser.isPro = true;
            }
            
            localStorage.setItem('talkie-user', JSON.stringify(currentUser));
            
            // Store/update user in admin user management system
            storeUserInAdminSystem(currentUser);
            
            updateUserInterface();
            initializeTheme();
            console.log('User already logged in:', currentUser.email);
        }
    } catch (error) {
        // User not logged in, which is fine
        console.log('No active session found');
        currentUser = null;
        localStorage.removeItem('talkie-user');
        updateUserInterface();
    }
}

// Initialize authentication system
function initializeAuth() {
    updateUserInterface();
}

// Initialize admin system
async function initializeAdmin() {
    try {
        // The owner account will be created through normal signup process
        // This function now just ensures the owner gets proper privileges when they log in
        console.log('Admin system initialized. Owner account: coenyin9@gmail.com');
        
        // If current user is the owner, ensure they have proper privileges
        if (currentUser && currentUser.email === 'coenyin9@gmail.com') {
            currentUser.isOwner = true;
            currentUser.isAdmin = true;
            currentUser.isPro = true;
            localStorage.setItem('talkie-user', JSON.stringify(currentUser));
            storeUserInAdminSystem(currentUser);
            updateUserInterface();
        }
        
        // Synchronize any existing user data with admin system
        syncExistingUserData();
        
    } catch (error) {
        console.error('Error initializing admin system:', error);
    }
}

// Synchronize existing user data with admin system
function syncExistingUserData() {
    try {
        // If we have a current user, ensure they're in the admin system
        if (currentUser) {
            storeUserInAdminSystem(currentUser);
        }
        
        // Check for any legacy user data and migrate it
        const legacyUser = localStorage.getItem('talkie-user');
        if (legacyUser) {
            const userData = JSON.parse(legacyUser);
            if (userData.email && userData.name) {
                storeUserInAdminSystem(userData);
            }
        }
        
        // Sync any users who might be in browser memory but not in admin system
        syncAllStoredUsers();
        
        console.log('User data synchronization complete');
    } catch (error) {
        console.error('Error synchronizing user data:', error);
    }
}

// Sync all users that have ever been stored in browser storage
function syncAllStoredUsers() {
    try {
        // Check for historical user data that might be stored separately
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Look for any user-related storage keys
            if (key && key.includes('user') && key !== 'talkie-users') {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    
                    // If it looks like user data, try to sync it
                    if (data && data.email && data.name && !Array.isArray(data)) {
                        console.log('Found potential user data in storage key:', key);
                        storeUserInAdminSystem(data);
                    }
                } catch (e) {
                    // Ignore parsing errors for non-JSON data
                }
            }
        }
        
        // Also check sessionStorage for any temporary user data
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            
            if (key && key.includes('user')) {
                try {
                    const data = JSON.parse(sessionStorage.getItem(key));
                    if (data && data.email && data.name && !Array.isArray(data)) {
                        console.log('Found potential user data in sessionStorage key:', key);
                        storeUserInAdminSystem(data);
                    }
                } catch (e) {
                    // Ignore parsing errors
                }
            }
        }
        
        console.log('Historical user data synchronization complete');
    } catch (error) {
        console.error('Error syncing historical user data:', error);
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
    
    // Enhanced coding context
    if (memory.codingPreferences) {
        const coding = memory.codingPreferences;
        if (coding.languages && coding.languages.length > 0) {
            contextParts.push(`Programming languages discussed: ${coding.languages.join(', ')}`);
        }
        if (coding.frameworks && coding.frameworks.length > 0) {
            contextParts.push(`Frameworks/libraries discussed: ${coding.frameworks.join(', ')}`);
        }
        if (coding.topics && coding.topics.length > 0) {
            contextParts.push(`Coding topics discussed: ${coding.topics.join(', ')}`);
        }
        if (coding.lastDiscussedLanguage) {
            contextParts.push(`Last programming language discussed: ${coding.lastDiscussedLanguage}`);
        }
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

// Enhanced memory system for code-related conversations
function updateCodeMemory(userMessage, aiResponse) {
    if (!conversationSettings.enableMemory || !currentUser || !userMemory[currentUser.email]) {
        return;
    }
    
    const memory = userMemory[currentUser.email];
    
    // Initialize coding preferences if not exists
    if (!memory.codingPreferences) {
        memory.codingPreferences = {
            languages: [],
            frameworks: [],
            topics: [],
            lastDiscussedLanguage: null
        };
    }
    
    // Extract programming languages mentioned
    const languages = ['javascript', 'python', 'java', 'cpp', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript', 'html', 'css', 'sql', 'r', 'swift', 'kotlin'];
    const frameworks = ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel'];
    
    const messageLower = userMessage.toLowerCase();
    
    // Track languages mentioned
    languages.forEach(lang => {
        if (messageLower.includes(lang) && !memory.codingPreferences.languages.includes(lang)) {
            memory.codingPreferences.languages.push(lang);
            memory.codingPreferences.lastDiscussedLanguage = lang;
        }
    });
    
    // Track frameworks mentioned
    frameworks.forEach(framework => {
        if (messageLower.includes(framework) && !memory.codingPreferences.frameworks.includes(framework)) {
            memory.codingPreferences.frameworks.push(framework);
        }
    });
    
    // Track coding topics
    const codingTopics = ['algorithms', 'data structures', 'api', 'database', 'frontend', 'backend', 'machine learning', 'ai', 'debugging', 'testing'];
    codingTopics.forEach(topic => {
        if (messageLower.includes(topic) && !memory.codingPreferences.topics.includes(topic)) {
            memory.codingPreferences.topics.push(topic);
        }
    });
    
    // Limit arrays to prevent bloat
    ['languages', 'frameworks', 'topics'].forEach(key => {
        if (memory.codingPreferences[key].length > 10) {
            memory.codingPreferences[key] = memory.codingPreferences[key].slice(-10);
        }
    });
    
    saveUserMemory();
}

// Extract Personal Information
function extractPersonalInfo(message, memory) {
    // Safety check for undefined or null message
    if (!message || typeof message !== 'string') {
        return;
    }
    
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
    // Safety check for undefined or null message
    if (!message || typeof message !== 'string') {
        return;
    }
    
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
    
    // Safety check for undefined or null text
    if (!text || typeof text !== 'string') {
        return topics;
    }
    
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
    // Safety checks for undefined or null parameters
    if (!userMessage || typeof userMessage !== 'string' || 
        !aiResponse || typeof aiResponse !== 'string') {
        return;
    }
    
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
    
    // Safety check for undefined or null aiResponse
    if (!aiResponse || typeof aiResponse !== 'string') {
        return [];
    }
    
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
    
    saveBtn.addEventListener('click', saveSettings);
    resetBtn.addEventListener('click', resetSettings);
    viewMemoryBtn.addEventListener('click', showMemoryViewer);
    clearMemoryBtn.addEventListener('click', clearUserMemory);
    
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

// hashPassword function removed - Appwrite handles password hashing automatically

async function handleSignup(event) {
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
    
    if (!appwriteAccount) {
        // Fallback for development/testing when Appwrite is not available
        console.warn('Appwrite not available, using local authentication for testing');
        
        // Check if user already exists in local storage
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        if (users[email]) {
            showToast('An account with this email already exists', 'error');
            return;
        }
        
        // Create user object
        currentUser = {
            name: name,
            email: email,
            appwriteId: 'local_' + Date.now(),
            isPro: false,
            isAdmin: false,
            isOwner: email === 'coenyin9@gmail.com',
            profilePhoto: null,
            emailVerified: false
        };
        
        // Set admin/owner status for the owner account
        if (currentUser.isOwner) {
            currentUser.isAdmin = true;
            currentUser.isPro = true;
            currentUser.emailVerified = true; // Owner is auto-verified
        }
        
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        // Store user in admin user management system
        storeUserInAdminSystem(currentUser);
        
        hideAuthModal();
        updateUserInterface();
        initializeTheme();
        showToast(`Welcome to Talkie Gen AI, ${name}! (Development Mode)`, 'success');
        return;
    }
    
    try {
        // Create account with Appwrite and send verification email
        const response = await appwriteAccount.create(
            'unique()', // Let Appwrite generate ID
            email,
            password,
            name
        );
        
        console.log('Account created:', response);
        
        // Send email verification
        try {
            await appwriteAccount.createVerification('https://coen-yin.github.io/verify');
            showToast('Account created! Please check your email to verify your account before signing in.', 'success');
        } catch (verificationError) {
            console.error('Email verification error:', verificationError);
            showToast('Account created, but email verification failed. You can still sign in.', 'warning');
        }
        
        // Don't automatically log in - user needs to verify email first
        hideAuthModal();
        
        // Show login modal with instructions
        setTimeout(() => {
            showAuthModal('login');
            showToast('Please verify your email and then sign in with your credentials.', 'info');
        }, 500);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific Appwrite errors
        if (error.code === 409) {
            showToast('An account with this email already exists', 'error');
        } else if (error.code === 400) {
            showToast('Invalid email format', 'error');
        } else {
            showToast('Signup failed. Please try again.', 'error');
        }
    }
}

// Store user in admin management system
function storeUserInAdminSystem(user) {
    try {
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        
        // Check if user already exists to preserve signup date
        const existingUser = users[user.email];
        const signupDate = existingUser ? existingUser.signupDate : new Date().toISOString();
        
        users[user.email] = {
            name: user.name,
            email: user.email,
            appwriteId: user.appwriteId,
            isPro: user.isPro || false,
            isAdmin: user.isAdmin || false,
            isOwner: user.isOwner || false,
            profilePhoto: user.profilePhoto || null,
            signupDate: signupDate,
            lastLoginDate: new Date().toISOString()
        };
        localStorage.setItem('talkie-users', JSON.stringify(users));
        console.log('User stored/updated in admin system:', user.email);
        
        // Also trigger admin stats refresh if admin panel is open
        if (document.getElementById('adminModal')?.classList.contains('active')) {
            loadAdminStats();
        }
    } catch (error) {
        console.error('Error storing user in admin system:', error);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!appwriteAccount) {
        // Fallback for development/testing when Appwrite is not available
        console.warn('Appwrite not available, using local authentication for testing');
        
        // Check if user exists in local storage
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        const user = users[email];
        
        if (!user) {
            showToast('Invalid email or password', 'error');
            return;
        }
        
        // Create user object (simulate successful login)
        currentUser = {
            name: user.name,
            email: user.email,
            appwriteId: user.appwriteId,
            isPro: user.isPro || false,
            isAdmin: user.isAdmin || false,
            isOwner: email === 'coenyin9@gmail.com',
            profilePhoto: user.profilePhoto || null
        };
        
        // Set admin/owner status for the owner account
        if (currentUser.isOwner) {
            currentUser.isAdmin = true;
            currentUser.isPro = true;
        }
        
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        // Store/update user in admin user management system
        storeUserInAdminSystem(currentUser);
        
        hideAuthModal();
        updateUserInterface();
        initializeTheme();
        showToast(`Welcome back, ${user.name}! (Development Mode)`, 'success');
        return;
    }
    
    try {
        // Create session with Appwrite
        await appwriteAccount.createEmailSession(email, password);
        
        // Get user data
        const user = await appwriteAccount.get();
        
        // Check email verification status
        if (!user.emailVerification) {
            showToast('Please verify your email before signing in. Check your inbox for the verification link.', 'warning');
            
            // Option to resend verification
            try {
                await appwriteAccount.createVerification('https://coen-yin.github.io/verify');
                showToast('Verification email resent. Please check your inbox.', 'info');
            } catch (resendError) {
                console.error('Resend verification error:', resendError);
            }
            
            // Log out the unverified user
            await appwriteAccount.deleteSession('current');
            return;
        }
        
        // Set up user object
        currentUser = {
            name: user.name,
            email: user.email,
            appwriteId: user.$id,
            isPro: false,
            isAdmin: false,
            isOwner: email === 'coenyin9@gmail.com',
            profilePhoto: user.prefs?.profilePhoto || null,
            emailVerified: user.emailVerification
        };
        
        // Set admin/owner status for the owner account
        if (currentUser.isOwner) {
            currentUser.isAdmin = true;
            currentUser.isPro = true;
        }
        
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
        // Store/update user in admin user management system
        storeUserInAdminSystem(currentUser);
        
        // Check for pending pro upgrade
        if (sessionStorage.getItem('pendingProUpgrade') === 'true') {
            sessionStorage.removeItem('pendingProUpgrade');
            upgradeToPro();
        }
        
        hideAuthModal();
        updateUserInterface();
        initializeTheme(); // Refresh theme options for potential Pro user
        showToast(`Welcome back, ${user.name}!`, 'success');
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific Appwrite errors
        if (error.code === 401) {
            showToast('Invalid email or password', 'error');
        } else if (error.code === 400) {
            showToast('Invalid email format', 'error');
        } else {
            showToast('Login failed. Please try again.', 'error');
        }
    }
}

async function handleLogout() {
    try {
        // Delete current session in Appwrite if available
        if (appwriteAccount) {
            await appwriteAccount.deleteSession('current');
        }
        
        // Clear local user data
        currentUser = null;
        localStorage.removeItem('talkie-user');
        updateUserInterface();
        userDropdown.classList.remove('show');
        showToast('You have been signed out', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
        // Force logout even if Appwrite call fails
        currentUser = null;
        localStorage.removeItem('talkie-user');
        updateUserInterface();
        userDropdown.classList.remove('show');
        showToast('You have been signed out', 'success');
    }
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
    // Safety check for undefined or null text
    if (!text || typeof text !== 'string') {
        return { isAppropriate: true };
    }
    
    // List of inappropriate words/phrases to filter
    const inappropriateWords = [
        'fuck', 'shit', 'bitch', 'asshole', 'damn', 'Motherfucker', 'crap', 
        'piss', 'bastard', 'slut', 'whore', 'retard', 'gay', 'fag',
        'nazi', 'hitler', 'kill yourself', 'kys', 'suicide', 'die'
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
    let hasImageForAnalysis = false;
    
    if (window.currentImageData) {
        hasImageForAnalysis = true;
        messageContent = `[User has uploaded an image for analysis] ${content}`;
        
        // Show user that image is being processed
        showToast('Image uploaded! Analyzing...', 'info');
        
        // Remove image preview after sending (but keep data for AI processing)
        const preview = document.querySelector('.image-preview-container');
        if (preview) preview.remove();
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
        
        // Only add message if response is not null (null means it was already added)
        if (response !== null) {
            addMessage('assistant', response);
        }
        
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
    const commandResponse = await checkAICommands(userMessage);
    if (commandResponse) {
        isGenerating = false;
        sendButton.disabled = false;
        
        // Special handling for image generation commands
        if (commandResponse.startsWith('<div data-message-id=')) {
            // This is an image generation command - add the message directly
            // and return a signal that no further processing is needed
            addRawHTMLMessage('assistant', commandResponse);
            return null; // Don't process further
        }
        
        return commandResponse;
    }

    const chat = chats[currentChatId];
    
    // Use enhanced context management
    const contextMessages = getEnhancedContext(currentChatId);

    // Check if there's image data to analyze
    const hasImageData = window.currentImageData;
    let imageUrl = null;
    
    if (hasImageData) {
        // For Puter, we can use the data URL directly
        imageUrl = window.currentImageData;
        console.log('Image data detected for analysis:', imageUrl ? 'Yes' : 'No');
    }

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
- For web development projects (HTML/CSS/JavaScript), ALWAYS separate into individual code blocks
- When creating websites, provide HTML, CSS, and JavaScript in separate code blocks with clear language labels
- For multi-file projects, provide each file in its own code block with appropriate language labels
- Use descriptive comments in code to explain functionality

WEBSITE CODE ORGANIZATION:
When providing website code, organize it as follows:
1. HTML code block (labeled as \`\`\`html)
2. CSS code block (labeled as \`\`\`css) 
3. JavaScript code block (labeled as \`\`\`javascript)
This allows for proper automatic organization and download functionality.

PYTHON AND OTHER LANGUAGES:
- For Python projects, separate different modules/files into separate code blocks
- For multi-file projects in any language, provide each file in its own code block
- Always include appropriate file names in comments at the top of each code block

IMAGE ANALYSIS:
- When analyzing images, provide detailed, insightful descriptions
- Identify key elements, colors, composition, mood, and context
- Offer relevant analysis based on the user's question about the image

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
- For web development projects (HTML/CSS/JavaScript), ALWAYS separate into individual code blocks
- When creating websites, provide HTML, CSS, and JavaScript in separate code blocks with clear language labels
- For multi-file projects, provide each file in its own code block with appropriate language labels

WEBSITE CODE ORGANIZATION:
When providing website code, organize it as follows:
1. HTML code block (labeled as \`\`\`html)
2. CSS code block (labeled as \`\`\`css) 
3. JavaScript code block (labeled as \`\`\`javascript)
This allows for proper automatic organization and download functionality.

IMAGE ANALYSIS:
- When analyzing images, provide helpful descriptions and insights
- Focus on what the user is asking about regarding the image
- Be descriptive and informative about visual elements

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
        let aiResponse;
        
        // Check if Puter is available
        if (typeof puter === 'undefined') {
            console.warn('Puter SDK not available, using fallback AI response system');
            
            // Even in fallback mode, check for AI commands first
            const commandResponse = await checkAICommands(userMessage);
            if (commandResponse) {
                // For image generation commands that return HTML, we need special handling
                if (commandResponse.startsWith('<div data-message-id=')) {
                    // This is an image generation command - add the message directly
                    addRawHTMLMessage('assistant', commandResponse);
                    isGenerating = false;
                    sendButton.disabled = false;
                    return null; // Don't process further
                }
                isGenerating = false;
                sendButton.disabled = false;
                return commandResponse;
            }
            
            aiResponse = await getFallbackAIResponse(userMessage, contextMessages, hasImageData);
        } else {
            // Use Puter AI chat with the correct API call
            console.log('Using Puter AI for response...');
            
            // Build context string from messages for Puter AI
            let contextualMessage = userMessage;
            if (messages && messages.length > 1) {
                // Include recent conversation context
                const recentContext = messages.slice(-5).map(msg => {
                    if (msg.role === 'user') return `User: ${msg.content}`;
                    if (msg.role === 'assistant') return `Assistant: ${msg.content}`;
                    return msg.content;
                }).join('\n');
                contextualMessage = `Previous context:\n${recentContext}\n\nCurrent message: ${userMessage}`;
            }
            
            if (hasImageData && imageUrl) {
                // Use image analysis: puter.ai.chat(question, imageUrl, options)
                console.log('Analyzing image with Puter AI...');
                try {
                    aiResponse = await puter.ai.chat(contextualMessage, imageUrl, { 
                        model: "gpt-5-nano"
                    });
                    console.log('Image analysis completed successfully');
                } catch (imageError) {
                    console.error('Image analysis failed:', imageError);
                    // Fallback to text-only response with image context
                    console.log('Falling back to text response with image context...');
                    aiResponse = await puter.ai.chat(`${contextualMessage} [Note: User uploaded an image but analysis failed]`, { 
                        model: "gpt-5-nano"
                    });
                }
                // Clear the image data after processing (success or failure)
                window.currentImageData = null;
            } else {
                // Regular text chat: puter.ai.chat(message, options)
                aiResponse = await puter.ai.chat(contextualMessage, { 
                    model: "gpt-5-nano"
                });
            }
        }
        
        // Validate and sanitize the AI response
        if (aiResponse === null || aiResponse === undefined) {
            console.warn('AI response is null or undefined, using fallback');
            aiResponse = "I apologize, but I didn't receive a proper response. Could you please try again?";
        } else if (typeof aiResponse !== 'string') {
            console.warn('AI response is not a string, extracting content:', typeof aiResponse, aiResponse);
            try {
                // Handle Puter API response object structure
                if (typeof aiResponse === 'object') {
                    // Check if it's a Puter API response with message.content structure
                    if (aiResponse.message && aiResponse.message.content) {
                        aiResponse = aiResponse.message.content;
                        console.log('Extracted content from Puter response:', aiResponse);
                    } else if (aiResponse.content) {
                        aiResponse = aiResponse.content;
                    } else {
                        // Fallback to JSON string if structure is unexpected
                        console.warn('Unexpected response structure, using JSON string');
                        aiResponse = JSON.stringify(aiResponse);
                    }
                } else {
                    aiResponse = String(aiResponse);
                }
            } catch (conversionError) {
                console.error('Failed to extract content from AI response:', conversionError);
                aiResponse = "I apologize, but I encountered an error processing the response. Please try again.";
            }
        }
        
        // Ensure response is not empty
        if (aiResponse.trim() === '') {
            aiResponse = "I apologize, but I received an empty response. Could you please rephrase your question?";
        }
        
        // Safety filter to replace any ChatGPT identity mentions with Talkie Gen AI
        if (typeof aiResponse === 'string') {
            // Replace ChatGPT mentions with Talkie Gen AI
            aiResponse = aiResponse.replace(/I'm ChatGPT/gi, "I'm Talkie Gen AI");
            aiResponse = aiResponse.replace(/I am ChatGPT/gi, "I am Talkie Gen AI");
            aiResponse = aiResponse.replace(/ChatGPT here/gi, "Talkie Gen AI here");
            aiResponse = aiResponse.replace(/As ChatGPT/gi, "As Talkie Gen AI");
            aiResponse = aiResponse.replace(/\bChatGPT\b/g, "Talkie Gen AI");
            
            // Additional safety replacements for other AI mentions
            aiResponse = aiResponse.replace(/I'm Claude/gi, "I'm Talkie Gen AI");
            aiResponse = aiResponse.replace(/I am Claude/gi, "I am Talkie Gen AI");
            aiResponse = aiResponse.replace(/Claude here/gi, "Talkie Gen AI here");
            aiResponse = aiResponse.replace(/As Claude/gi, "As Talkie Gen AI");
            
            console.log('Applied identity safety filter to response');
        }
        
        // Update user memory with the conversation
        updateUserMemory(userMessage, aiResponse);
        
        // Enhanced memory update for code-related conversations
        if (userMessage.toLowerCase().includes('code') || 
            userMessage.toLowerCase().includes('programming') ||
            aiResponse.includes('```')) {
            updateCodeMemory(userMessage, aiResponse);
        }
        
        return aiResponse;

    } catch (error) {
        console.error('AI API Error:', error);
        
        // Enhanced error handling with specific recovery strategies
        let errorMessage = 'AI services are temporarily unavailable. Please try again later.';
        
        // Clear image data on any error to prevent confusion
        if (window.currentImageData) {
            console.log('Clearing image data due to AI error');
            window.currentImageData = null;
        }
        
        if (error.message.includes('API not initialized') || error.message.includes('Puter')) {
            console.warn('Puter API failed, using fallback system');
            try {
                const fallbackResponse = await getFallbackAIResponse(userMessage, contextMessages, hasImageData);
                updateUserMemory(userMessage, fallbackResponse);
                
                // Enhanced memory update for code-related conversations
                if (userMessage.toLowerCase().includes('code') || 
                    userMessage.toLowerCase().includes('programming') ||
                    fallbackResponse.includes('```')) {
                    updateCodeMemory(userMessage, fallbackResponse);
                }
                return fallbackResponse;
            } catch (fallbackError) {
                console.error('Fallback AI also failed:', fallbackError);
                errorMessage = 'Both primary and backup AI services are unavailable. Please try again later.';
            }
        } else if (error.message.includes('rate limit')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('server') || error.message.includes('network')) {
            errorMessage = 'Network or server error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again with a shorter message.';
        } else {
            errorMessage = `AI Error: ${error.message}. Please try again or contact support if the issue persists.`;
        }
        
        throw new Error(errorMessage);
    } finally {
        isGenerating = false;
        sendButton.disabled = false;
    }
}

// Fallback AI Response System
async function getFallbackAIResponse(userMessage, contextMessages, hasImageData = false) {
    // Simulate a brief delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    
    // Safety check for undefined or null userMessage
    if (!userMessage || typeof userMessage !== 'string') {
        return "I apologize, but I didn't receive a valid message. Could you please try again?";
    }
    
    const message = userMessage.toLowerCase().trim();
    
    // Check if this is about image analysis
    if (message.includes('[user has uploaded an image for analysis]') || hasImageData || window.currentImageData) {
        // Clear image data to prevent confusion
        if (window.currentImageData) {
            window.currentImageData = null;
        }
        
        return `I can see that you've uploaded an image! 🖼️ 

**Current Status**: I'm operating in offline mode, so I can't analyze the actual image content right now, but I'm still here to help!

📸 **What I can help with regarding your image:**
- **General guidance**: Describe what you'd like to know about your image
- **Photography tips**: Composition, lighting, and technical advice  
- **Image editing**: Techniques and software recommendations
- **Coding help**: Image processing, computer vision, or web development
- **Creative ideas**: Using images in projects or presentations

🔍 **For specific image analysis:**
- Try describing what's in the image, and I can provide relevant information
- Ask specific questions about techniques or concepts related to your image
- Let me know what you want to do with the image, and I'll suggest approaches

💡 **Example questions I can help with:**
- "How do I improve the composition of portrait photos?"
- "What's the best way to optimize images for web use?"
- "How can I extract text from images using code?"

What specific aspect of your image or image-related task would you like help with?`;
    }
    
    // Generate contextual responses based on user input
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        const greetings = [
            "Hello! I'm Talkie Gen AI, your helpful assistant. I'm currently running in offline mode, but I'm still here to help you with various tasks, answer questions, and have conversations. What can I assist you with today?",
            "Hi there! Welcome to Talkie Gen AI. While I'm operating in offline mode right now, I can still help you with coding questions, writing tasks, general information, and much more. How can I help?",
            "Hey! Thanks for reaching out. I'm Talkie Gen AI, and I'm ready to assist you. I'm currently in offline mode, but don't worry - I can still provide helpful responses and engage in meaningful conversations. What would you like to explore?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (message.includes('how are you') || message.includes('how do you feel')) {
        return "I'm doing well, thank you for asking! I'm currently running in offline mode due to external service limitations, but I'm still functional and ready to help. I may not have access to the latest information, but I can assist with coding, writing, problem-solving, and general conversations. How are you doing today?";
    }
    
    if (message.includes('what can you do') || message.includes('capabilities') || message.includes('help me')) {
        return `I'm Talkie Gen AI, and even in offline mode, I can help you with:

🔹 **Programming & Code**: Writing, debugging, and explaining code in various languages
🔹 **Writing & Content**: Essays, emails, creative writing, and editing
🔹 **Problem Solving**: Breaking down complex problems and finding solutions
🔹 **Learning & Education**: Explaining concepts, answering questions, and providing guidance
🔹 **Creative Tasks**: Brainstorming, storytelling, and creative projects
🔹 **General Conversation**: Discussing topics, sharing ideas, and engaging dialogue

*Note: I'm currently in offline mode, so I don't have access to real-time information or external services. For the most current information, please verify with reliable sources.*

What specific task would you like help with?`;
    }
    
    // Enhanced coding response system
    if (message.includes('code') || message.includes('programming') || message.includes('function') || message.includes('javascript') || message.includes('python') || message.includes('html') || message.includes('css') || message.includes('prime') || message.includes('algorithm')) {
        
        // Specific programming requests
        if (message.includes('prime') && (message.includes('python') || message.includes('function'))) {
            return `Here's a comprehensive Python solution for finding prime numbers! 🐍

**Method 1: Simple Prime Checker**
\`\`\`python
def is_prime(n):
    """Check if a number is prime"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # Check odd divisors up to sqrt(n)
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True

# Example usage
print(is_prime(17))  # True
print(is_prime(25))  # False
\`\`\`

**Method 2: Generate Prime Numbers List**
\`\`\`python
def find_primes(limit):
    """Find all prime numbers up to a limit using Sieve of Eratosthenes"""
    if limit < 2:
        return []
    
    # Create boolean array and set all to True
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    
    # Sieve algorithm
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    
    # Return list of prime numbers
    return [i for i in range(2, limit + 1) if is_prime[i]]

# Example usage
primes = find_primes(50)
print(f"Primes up to 50: {primes}")
\`\`\`

**Method 3: Prime Generator (Memory Efficient)**
\`\`\`python
def prime_generator():
    """Generator that yields prime numbers infinitely"""
    yield 2
    primes = [2]
    candidate = 3
    
    while True:
        is_prime = True
        sqrt_candidate = candidate**0.5
        
        for prime in primes:
            if prime > sqrt_candidate:
                break
            if candidate % prime == 0:
                is_prime = False
                break
        
        if is_prime:
            primes.append(candidate)
            yield candidate
        
        candidate += 2

# Example usage
prime_gen = prime_generator()
first_10_primes = [next(prime_gen) for _ in range(10)]
print(f"First 10 primes: {first_10_primes}")
\`\`\`

💡 **Explanation:**
- **Method 1**: Basic primality test, O(√n) time complexity
- **Method 2**: Sieve of Eratosthenes, efficient for finding all primes up to a limit
- **Method 3**: Generator for memory-efficient infinite prime sequence

🚀 **Performance Tips:**
- Use Method 2 for finding all primes up to a specific number
- Use Method 1 for checking individual numbers
- Use Method 3 when you need primes one at a time

Would you like me to explain any of these algorithms in more detail or show you how to optimize them further?`;
        }
        
        if (message.includes('javascript') || message.includes('js')) {
            return `Great! I'm here to help with JavaScript! 🚀 Here are some powerful JavaScript examples:

**ES6+ Function Examples:**
\`\`\`javascript
// Arrow functions with different use cases
const square = x => x * x;
const add = (a, b) => a + b;
const greet = name => \`Hello, \${name}!\`;

// Array methods for data manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('Doubled:', doubled); // [2, 4, 6, 8, 10]
console.log('Evens:', evens);     // [2, 4]
console.log('Sum:', sum);         // 15
\`\`\`

**Async/Await Example:**
\`\`\`javascript
// Modern async function
async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
}

// Usage
fetchUserData(123).then(user => {
    if (user) {
        console.log('User:', user);
    }
});
\`\`\`

**DOM Manipulation:**
\`\`\`javascript
// Modern DOM selection and manipulation
const elements = {
    button: document.querySelector('#myButton'),
    list: document.querySelector('#myList'),
    input: document.querySelector('#userInput')
};

// Event handling with modern syntax
elements.button?.addEventListener('click', () => {
    const value = elements.input?.value?.trim();
    if (value) {
        const listItem = document.createElement('li');
        listItem.textContent = value;
        elements.list?.appendChild(listItem);
        elements.input.value = '';
    }
});
\`\`\`

What specific JavaScript functionality would you like help with? I can assist with:
• Modern ES6+ features • DOM manipulation • Async programming • Functions & closures • APIs & fetch • Error handling`;
        }
        
        if (message.includes('html') || message.includes('web') || message.includes('website')) {
            return `Perfect! Let me help you with HTML and web development! 🌐

**Modern HTML5 Structure:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <h1>My Website</h1>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Welcome</h2>
            <p>This is a modern, semantic HTML page.</p>
        </section>
        
        <section id="about">
            <h2>About Us</h2>
            <article>
                <h3>Our Story</h3>
                <p>Content goes here...</p>
            </article>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
\`\`\`

**Interactive Form Example:**
\`\`\`html
<form id="contactForm" novalidate>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <span class="error-message" id="emailError"></span>
    </div>
    
    <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="4" required></textarea>
        <span class="error-message" id="messageError"></span>
    </div>
    
    <button type="submit">Send Message</button>
</form>
\`\`\`

🎯 **Best Practices I'm showing:**
• Semantic HTML elements (header, nav, main, section, article, footer)
• Proper meta tags for responsiveness
• Accessible form labels and structure
• Modern HTML5 input types

What specific HTML feature would you like help with? Forms, semantics, accessibility, or something else?`;
        }
        
        if (message.includes('css') || message.includes('style') || message.includes('design')) {
            return `Excellent! Let me show you some modern CSS techniques! 🎨

**Modern CSS Grid & Flexbox:**
\`\`\`css
/* Modern CSS Grid Layout */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

/* Flexbox for component layout */
.card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
\`\`\`

**Custom Properties & Modern Animations:**
\`\`\`css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --background: #f8fafc;
    --text-color: #1e293b;
    --border-radius: 8px;
    --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.button:hover::before {
    left: 100%;
}
\`\`\`

**Responsive Design:**
\`\`\`css
/* Mobile-first responsive design */
.responsive-layout {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}

@media (min-width: 768px) {
    .responsive-layout {
        padding: 2rem;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
    }
}

@media (min-width: 1024px) {
    .responsive-layout {
        grid-template-columns: 1fr 3fr 1fr;
    }
}
\`\`\`

What CSS topic interests you most? Animations, layouts, responsive design, or modern features?`;
        }
        
        // Default programming response if no specific language detected
        return `I'd be happy to help you with programming! I can assist with:

🔧 **Languages & Technologies:**
• **JavaScript/TypeScript** - Modern ES6+, async/await, DOM manipulation
• **Python** - Functions, data structures, algorithms, libraries
• **HTML/CSS** - Semantic markup, modern layouts, animations
• **React/Vue** - Components, state management, hooks
• **Node.js** - Server-side development, APIs, databases

💡 **What I can help with:**
• Writing efficient, clean code with best practices
• Debugging and troubleshooting existing code
• Code optimization and performance improvements
• Explaining complex programming concepts
• Algorithm design and data structure implementation
• Code reviews and architectural advice

\`\`\`javascript
// Example: Modern JavaScript pattern
const createUserManager = () => ({
    users: new Map(),
    
    addUser(id, userData) {
        this.users.set(id, { ...userData, createdAt: new Date() });
        return this;
    },
    
    getUser(id) {
        return this.users.get(id);
    },
    
    getAllUsers() {
        return Array.from(this.users.values());
    }
});

const userManager = createUserManager();
userManager.addUser(1, { name: 'John', email: 'john@example.com' });
\`\`\`

What specific programming challenge are you working on? Please share your code or describe what you're trying to build!`;
    }
    
    if (message.includes('write') || message.includes('essay') || message.includes('story') || message.includes('email') || message.includes('letter')) {
        return `I'm excellent at helping with writing tasks! I can assist you with:

📝 **Creative Writing**: Stories, poems, character development
📧 **Professional Writing**: Emails, reports, proposals
📖 **Academic Writing**: Essays, research summaries, explanations
✏️ **Editing & Proofreading**: Improving clarity, grammar, and style
💡 **Content Ideas**: Brainstorming topics and outlines

What type of writing project are you working on? Please share any specific requirements, tone, length, or topic you have in mind, and I'll help you create something great!`;
    }
    
    if (message.includes('explain') || message.includes('what is') || message.includes('how does') || message.includes('why')) {
        return `I love explaining things! I can break down complex topics into understandable explanations. While I'm in offline mode and don't have access to the very latest information, I can help explain:

🧠 **Science & Technology**: Concepts, theories, and how things work
📚 **Educational Topics**: Academic subjects and learning materials  
💼 **Professional Skills**: Business concepts, methodologies
🎨 **Creative Processes**: Art, design, writing techniques
🔧 **Practical Skills**: Step-by-step guides and tutorials

What would you like me to explain? Please be as specific as possible, and I'll provide a clear, detailed explanation tailored to your needs.`;
    }
    
    if (message.includes('offline') || message.includes('error') || message.includes('not working') || message.includes('puter') || message.includes('api key') || message.includes('invalid api') || message.includes("wasn't working")) {
        return `I understand you're experiencing some technical issues. I'm currently running in offline mode because the external AI service (Puter SDK) couldn't be loaded. This might be due to:

• **Network connectivity issues** - External CDN resources are blocked
• **Browser restrictions or ad blockers** - Security settings preventing external scripts
• **Temporary service outages** - The Puter service may be temporarily unavailable
• **Firewall or security settings** - Corporate or personal firewall restrictions

**The good news:** Those "Invalid API key" errors you were seeing before are now fixed! I'm fully functional in offline mode and can help you with:

✅ **Programming & Coding** - JavaScript, Python, HTML, CSS, debugging, and more
✅ **Writing & Content** - Essays, emails, creative writing, editing, and proofreading  
✅ **Problem-Solving** - Breaking down complex issues and finding solutions
✅ **Explanations & Learning** - Teaching concepts and answering questions
✅ **Creative Projects** - Brainstorming, storytelling, and creative tasks

The offline mode provides intelligent, contextual responses without needing external API connections. Is there something specific I can help you with right now?`;
    }
    
    // Generic helpful response for other queries
    const genericResponses = [
        `That's an interesting question! While I'm currently in offline mode, I'd be happy to help you explore this topic. Could you provide a bit more detail about what specifically you'd like to know? I can offer insights, explanations, or help you think through the problem.`,
        
        `I'd love to help you with that! Even though I'm running in offline mode right now, I can still provide useful information and assistance. Could you elaborate on what you're looking for? I'm here to help with explanations, problem-solving, creative tasks, and more.`,
        
        `Thanks for your question! I'm Talkie Gen AI, currently operating in offline mode. I can still assist you with a wide variety of topics including coding, writing, explanations, and general conversations. What specific aspect would you like to explore further?`
    ];
    
    // Try to provide a more contextual response based on keywords
    if (message.includes('travel') || message.includes('trip') || message.includes('vacation')) {
        return `I'd love to help with travel planning! While I'm in offline mode and can't access real-time travel information like current prices or availability, I can still assist with:

✈️ **Trip Planning**: Suggesting destinations, creating itineraries
🗺️ **Travel Tips**: Packing lists, general advice, cultural insights  
📋 **Organization**: Planning frameworks and checklists
🌍 **Destination Info**: General information about places (note: verify current details)

What type of trip are you planning? Where are you thinking of going, and what kind of experience are you looking for?`;
    }
    
    if (message.includes('recipe') || message.includes('cooking') || message.includes('food')) {
        return `I'd be happy to help with cooking and recipes! Even in offline mode, I can assist with:

👨‍🍳 **Recipe Suggestions**: Based on ingredients or cuisine preferences
🥘 **Cooking Techniques**: Methods, tips, and troubleshooting
📋 **Meal Planning**: Ideas for different occasions and dietary needs
🌱 **Substitutions**: Alternative ingredients and adaptations

What kind of dish are you interested in making? Do you have specific ingredients you'd like to use, or are you looking for ideas for a particular meal or occasion?`;
    }
    
    // Return a random generic response if no specific pattern matches
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

// AI Command Recognition System
async function checkAICommands(userMessage) {
    // Allow image generation commands for all users (authenticated or not)
    // Check for image generation commands first
    const imageGenerationPatterns = [
        /generate (?:an? )?image (?:of )?(.*)/i,
        /create (?:an? )?image (?:of )?(.*)/i,
        /make (?:an? )?image (?:of )?(.*)/i,
        /draw (?:an? )?image (?:of )?(.*)/i,
        /show me (?:an? )?image (?:of )?(.*)/i,
        /generate (?:a )?picture (?:of )?(.*)/i,
        /create (?:a )?picture (?:of )?(.*)/i,
        /make (?:a )?picture (?:of )?(.*)/i
    ];
    
    // Check for image generation patterns
    for (const pattern of imageGenerationPatterns) {
        const match = userMessage.match(pattern);
        if (match) {
            const prompt = match[1] ? match[1].trim() : 'a beautiful landscape';
            return await generateImageCommand(prompt);
        }
    }
    
    // For other commands, require authentication
    if (!currentUser) return null;
    
    // Safety check for undefined or null userMessage
    if (!userMessage || typeof userMessage !== 'string') {
        return null;
    }
    
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

// Generate image using Puter AI text-to-image
async function generateImageCommand(prompt) {
    try {
        if (!prompt || prompt.trim() === '') {
            prompt = 'a beautiful landscape';
        }
        
        // Check if Puter SDK is available
        if (typeof puter === 'undefined') {
            // Create a fallback that still uses the HTML structure for consistency
            const messageId = 'img-gen-' + Date.now();
            
            // Add a placeholder message that will be updated with fallback content
            const placeholderMessage = `🎨 **Generating image:** "${prompt}"

🔄 Creating your image, please wait...`;
            
            // Use setTimeout to simulate the async process and show fallback
            setTimeout(() => {
                // Find the message element and update it with fallback information
                const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
                if (messageElement) {
                    messageElement.innerHTML = `
                        <div class="generated-image-container error">
                            <h4>🖼️ Image Generation Requested: "${prompt}"</h4>
                            <p><strong>Status:</strong> ⚠️ Service temporarily unavailable</p>
                            <p><strong>Reason:</strong> Image generation requires external services that are currently offline.</p>
                            <div class="fallback-preview">
                                <div class="placeholder-image">
                                    <i class="fas fa-image" style="font-size: 48px; color: #666;"></i>
                                    <p>Image would appear here: "${prompt}"</p>
                                </div>
                            </div>
                            <p><em>This feature will work in the production environment with full service access.</em></p>
                        </div>
                    `;
                }
            }, 2000); // 2 second delay to simulate generation
            
            // Return the placeholder message with the unique ID
            return `<div data-message-id="${messageId}">${placeholderMessage}</div>`;
        }
        
        // Generate a unique message ID for this image generation
        const messageId = 'img-gen-' + Date.now();
        
        // Add a placeholder message that will be updated with the image
        const placeholderMessage = `🎨 **Generating image:** "${prompt}"

🔄 Creating your image, please wait...`;
        
        // Use setTimeout to make this async and allow the placeholder to show
        setTimeout(async () => {
            try {
                console.log('Generating image with prompt:', prompt);
                
                // Use Puter's text-to-image API - setting testMode to true for testing
                const image = await puter.ai.txt2img(prompt, false);
                
                console.log('Image generated successfully:', image);
                
                // Find the message element and update it with the image
                const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
                if (messageElement) {
                    messageElement.innerHTML = `
                        <div class="generated-image-container">
                            <h4>🎨 Generated Image: "${prompt}"</h4>
                            <div class="image-wrapper">
                                ${image.outerHTML}
                            </div>
                            <div class="image-actions">
                                <button onclick="downloadGeneratedImage(this)" class="image-action-btn">
                                    <i class="fas fa-download"></i> Download
                                </button>
                                <button onclick="regenerateImage('${prompt.replace(/'/g, "\\'")}', '${messageId}')" class="image-action-btn">
                                    <i class="fas fa-redo"></i> Regenerate
                                </button>
                            </div>
                        </div>
                    `;
                }
                
                showToast('🎨 Image generated successfully!', 'success');
                
            } catch (error) {
                console.error('Error generating image:', error);
                
                // Update the message with error information
                const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
                if (messageElement) {
                    messageElement.innerHTML = `
                        <div class="generated-image-container error">
                            <h4>❌ Image Generation Failed</h4>
                            <p><strong>Prompt:</strong> "${prompt}"</p>
                            <p><strong>Error:</strong> ${error.message}</p>
                            <div class="image-actions">
                                <button onclick="regenerateImage('${prompt.replace(/'/g, "\\'")}', '${messageId}')" class="image-action-btn retry">
                                    <i class="fas fa-redo"></i> Try Again
                                </button>
                            </div>
                        </div>
                    `;
                }
                
                showToast('❌ Image generation failed. Please try again.', 'error');
            }
        }, 100);
        
        // Return the placeholder message with the unique ID
        return `<div data-message-id="${messageId}">${placeholderMessage}</div>`;
        
    } catch (error) {
        console.error('Error in generateImageCommand:', error);
        return `❌ **Image Generation Error**

Failed to generate image with prompt: "${prompt}"

**Error:** ${error.message}

Please try again with a different prompt.`;
    }
}

// Helper function to download generated images
function downloadGeneratedImage(button) {
    try {
        const imageWrapper = button.closest('.generated-image-container').querySelector('.image-wrapper');
        const img = imageWrapper.querySelector('img');
        
        if (img) {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'talkie-gen-image-' + Date.now() + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('📥 Image download started!', 'success');
        }
    } catch (error) {
        console.error('Error downloading image:', error);
        showToast('❌ Failed to download image', 'error');
    }
}

// Helper function to regenerate images
async function regenerateImage(prompt, messageId) {
    try {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;
        
        const contentDiv = messageElement.querySelector('.message-content');
        if (!contentDiv) return;
        
        // Show loading state
        contentDiv.innerHTML = `
            <div class="generated-image-container">
                <h4>🎨 Regenerating image: "${prompt}"</h4>
                <div class="image-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Creating a new version of your image...</p>
                </div>
            </div>
        `;
        
        if (typeof puter === 'undefined') {
            throw new Error('Puter SDK not available');
        }
        
        // Generate new image
        const image = await puter.ai.txt2img(prompt, true);
        
        // Update with new image
        contentDiv.innerHTML = `
            <div class="generated-image-container">
                <h4>🎨 Regenerated Image: "${prompt}"</h4>
                <div class="image-wrapper">
                    ${image.outerHTML}
                </div>
                <div class="image-actions">
                    <button onclick="downloadGeneratedImage(this)" class="image-action-btn">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button onclick="regenerateImage('${prompt.replace(/'/g, "\\'")}', '${messageId}')" class="image-action-btn">
                        <i class="fas fa-redo"></i> Regenerate
                    </button>
                </div>
            </div>
        `;
        
        showToast('🎨 Image regenerated successfully!', 'success');
        
    } catch (error) {
        console.error('Error regenerating image:', error);
        
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            const contentDiv = messageElement.querySelector('.message-content');
            if (contentDiv) {
                contentDiv.innerHTML = `
                    <div class="generated-image-container error">
                        <h4>❌ Image Regeneration Failed</h4>
                        <p><strong>Prompt:</strong> "${prompt}"</p>
                        <p><strong>Error:</strong> ${error.message}</p>
                        <div class="image-actions">
                            <button onclick="regenerateImage('${prompt.replace(/'/g, "\\'")}', '${messageId}')" class="image-action-btn retry">
                                <i class="fas fa-redo"></i> Try Again
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        
        showToast('❌ Image regeneration failed. Please try again.', 'error');
    }
}

// Function to add a message with raw HTML content (for special cases like image generation)
function addRawHTMLMessage(role, htmlContent) {
    const chat = chats[currentChatId];
    const message = { role, content: htmlContent, timestamp: Date.now(), isHTML: true };
    
    chat.messages.push(message);
    
    if (role === 'user' && chat.messages.length === 1) {
        // Extract text content for title
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        chat.title = textContent.length > 40 ? textContent.substring(0, 40) + '...' : textContent;
        document.title = `${chat.title} - Talkie Gen AI`;
    }
    
    renderRawHTMLMessage(message);
    
    // Force scroll after adding message
    setTimeout(() => {
        forceScrollToBottom();
    }, 50);
}

function addMessage(role, content) {
    // Ensure content is always a string
    if (content === null || content === undefined) {
        content = 'Error: No content provided';
    } else if (typeof content !== 'string') {
        try {
            content = String(content);
        } catch (error) {
            console.error('Error converting message content to string:', error);
            content = 'Error: Unable to display message content';
        }
    }
    
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

function renderRawHTMLMessage(message) {
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
                ${message.content}
            </div>
        </div>
    `;
    
    messagesArea.appendChild(messageDiv);
}

function renderMessages(messages) {
    messagesArea.innerHTML = '';
    messages.forEach(message => {
        if (message.isHTML) {
            renderRawHTMLMessage(message);
        } else {
            renderMessage(message);
        }
    });
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
    
    // Ensure message content is safe for HTML attributes
    const safeContent = typeof message.content === 'string' ? message.content : String(message.content || '');
    const encodedContent = encodeURIComponent(safeContent);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar ${isUser ? 'user' : 'ai'}">
                ${avatarContent}
            </div>
            <div class="message-text">
                ${formatMessage(safeContent)}
                <div class="message-actions">
                    <button class="action-btn copy-btn" data-content="${encodedContent}" title="Copy message">
                        <i class="fas fa-copy"></i>
                    </button>
                    ${!isUser ? `<button class="action-btn regen-btn" data-timestamp="${message.timestamp}" title="Regenerate response">
                        <i class="fas fa-redo"></i>
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners to the buttons
    const copyBtn = messageDiv.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyMessage(copyBtn.getAttribute('data-content'));
        });
    }
    
    const regenBtn = messageDiv.querySelector('.regen-btn');
    if (regenBtn) {
        regenBtn.addEventListener('click', () => {
            regenerateMessage(regenBtn.getAttribute('data-timestamp'));
        });
    }
    
    messagesArea.appendChild(messageDiv);
}

function formatMessage(content) {
    // Ensure content is a string and handle edge cases
    if (content === null || content === undefined) {
        content = 'Error: No content received';
    } else if (typeof content !== 'string') {
        // Convert non-string content to string
        try {
            content = String(content);
        } catch (error) {
            console.error('Error converting content to string:', error);
            content = 'Error: Unable to display content';
        }
    }
    
    // Enhanced code block processing with sorting and organization
    const processedContent = processAndSortCodeBlocks(content);
    
    return processedContent
        // Then handle other markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function processAndSortCodeBlocks(content) {
    // Find all code blocks in the content
    const codeBlockPattern = /```(\w*)\n?([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;
    
    // Extract all code blocks with their positions
    while ((match = codeBlockPattern.exec(content)) !== null) {
        codeBlocks.push({
            fullMatch: match[0],
            language: match[1] || '',
            code: match[2].trim(),
            index: match.index
        });
    }
    
    // If we have multiple code blocks, check if they should be organized as a web project
    if (codeBlocks.length > 1) {
        const organizedContent = organizeWebProjectCodeBlocks(content, codeBlocks);
        if (organizedContent !== content) {
            return organizedContent;
        }
        
        // If not a web project, still sort by language priority
        return sortCodeBlocksByPriority(content, codeBlocks);
    }
    
    // Single code block - process normally
    return content.replace(codeBlockPattern, (match, language, code) => {
        return createCodeBlock(code.trim(), language);
    });
}

function organizeWebProjectCodeBlocks(content, codeBlocks) {
    // Define web languages and their ideal order
    const webLanguages = ['html', 'css', 'javascript', 'js'];
    const webLanguageAliases = {
        'js': 'javascript',
        'htm': 'html'
    };
    
    // Check if this looks like a web project (has HTML/CSS/JS)
    const foundWebLanguages = new Set();
    const webCodeBlocks = [];
    const otherCodeBlocks = [];
    
    codeBlocks.forEach(block => {
        const normalizedLang = (webLanguageAliases[block.language.toLowerCase()] || block.language.toLowerCase());
        if (webLanguages.includes(normalizedLang)) {
            foundWebLanguages.add(normalizedLang);
            webCodeBlocks.push({...block, normalizedLanguage: normalizedLang});
        } else {
            otherCodeBlocks.push(block);
        }
    });
    
    // Only organize as web project if we have at least 2 web languages
    if (foundWebLanguages.size < 2) {
        return content;
    }
    
    // Create sorted web project sections
    let newContent = content;
    
    // Remove all code blocks from content first
    codeBlocks.forEach(block => {
        newContent = newContent.replace(block.fullMatch, `__CODEBLOCK_PLACEHOLDER_${block.index}__`);
    });
    
    // Sort web code blocks by preferred order
    const sortedWebBlocks = webCodeBlocks.sort((a, b) => {
        const orderA = webLanguages.indexOf(a.normalizedLanguage);
        const orderB = webLanguages.indexOf(b.normalizedLanguage);
        return orderA - orderB;
    });
    
    // Create organized web project section
    const webProjectSection = createWebProjectSection(sortedWebBlocks);
    
    // Replace the first web code block placeholder with the organized section
    const firstWebBlockIndex = Math.min(...webCodeBlocks.map(b => b.index));
    newContent = newContent.replace(`__CODEBLOCK_PLACEHOLDER_${firstWebBlockIndex}__`, webProjectSection);
    
    // Remove other web block placeholders
    webCodeBlocks.forEach(block => {
        if (block.index !== firstWebBlockIndex) {
            newContent = newContent.replace(`__CODEBLOCK_PLACEHOLDER_${block.index}__`, '');
        }
    });
    
    // Replace remaining placeholders with sorted other code blocks
    otherCodeBlocks.forEach(block => {
        const codeBlockHtml = createCodeBlock(block.code, block.language);
        newContent = newContent.replace(`__CODEBLOCK_PLACEHOLDER_${block.index}__`, codeBlockHtml);
    });
    
    return newContent;
}

function createWebProjectSection(webCodeBlocks) {
    const sectionId = 'web-project-' + Math.random().toString(36).substr(2, 9);
    
    let sectionHtml = `
        <div class="web-project-container" id="${sectionId}">
            <div class="web-project-header">
                <div class="project-title">
                    <i class="fas fa-globe"></i>
                    <span>Complete Website Code</span>
                    <div class="project-badge">${webCodeBlocks.length} Files</div>
                </div>
                <div class="project-actions">
                    <button class="project-action-btn" onclick="downloadWebProject('${sectionId}')" title="Download all files as ZIP">
                        <i class="fas fa-download"></i>
                        <span>Download Project</span>
                    </button>
                    <button class="project-action-btn" onclick="copyAllWebCode('${sectionId}')" title="Copy all code">
                        <i class="fas fa-copy"></i>
                        <span>Copy All</span>
                    </button>
                </div>
            </div>
            <div class="web-project-files">
    `;
    
    webCodeBlocks.forEach((block, index) => {
        const enhancedCodeBlock = createEnhancedWebCodeBlock(
            block.code, 
            block.normalizedLanguage, 
            index,
            sectionId
        );
        sectionHtml += enhancedCodeBlock;
    });
    
    sectionHtml += `
            </div>
        </div>
    `;
    
    return sectionHtml;
}

function createEnhancedWebCodeBlock(code, language, index, projectId) {
    const blockId = `${projectId}-${language}-${index}`;
    const langInfo = getLanguageInfo(language);
    const fileExtension = getFileExtension(language);
    const lineCount = code.split('\n').length;
    const showLineNumbers = lineCount > 1;
    
    // Generate suggested filename
    const defaultFilenames = {
        'html': 'index.html',
        'css': 'styles.css',
        'javascript': 'script.js'
    };
    const suggestedFilename = defaultFilenames[language] || `file${fileExtension}`;
    
    let lineNumbersHtml = '';
    if (showLineNumbers) {
        lineNumbersHtml = Array.from({length: lineCount}, (_, i) => 
            `<span class="line-number">${i + 1}</span>`
        ).join('\n');
    }
    
    return `
        <div class="web-file-container" data-language="${language}" data-filename="${suggestedFilename}">
            <div class="web-file-header">
                <div class="file-info">
                    <i class="${langInfo.icon}" style="color: ${langInfo.color}"></i>
                    <span class="file-name">${suggestedFilename}</span>
                    <span class="file-size">${lineCount} lines</span>
                </div>
                <div class="file-actions">
                    <button class="code-action-btn" onclick="copyCodeBlock('${blockId}')" title="Copy ${language} code">
                        <i class="fas fa-copy"></i>
                        <span class="action-text">Copy</span>
                    </button>
                    <button class="code-action-btn" onclick="downloadSingleFile('${blockId}', '${fileExtension}', '${suggestedFilename}')" title="Download ${suggestedFilename}">
                        <i class="fas fa-download"></i>
                        <span class="action-text">Download</span>
                    </button>
                </div>
            </div>
            <div class="web-file-content ${showLineNumbers ? 'with-line-numbers' : ''}">
                ${showLineNumbers ? `<div class="line-numbers" aria-hidden="true">${lineNumbersHtml}</div>` : ''}
                <pre class="code-block"><code id="${blockId}" class="language-${language}" data-language="${language}">${escapeHtml(code)}</code></pre>
            </div>
        </div>
    `;
}

function sortCodeBlocksByPriority(content, codeBlocks) {
    // Define language priority order (higher priority first)
    const languagePriority = {
        'html': 10,
        'css': 9,
        'javascript': 8,
        'js': 8,
        'typescript': 7,
        'ts': 7,
        'python': 6,
        'py': 6,
        'java': 5,
        'cpp': 4,
        'c': 4,
        'csharp': 3,
        'cs': 3,
        'php': 2,
        'ruby': 1,
        'go': 1,
        'rust': 1
    };
    
    // Sort code blocks by priority
    const sortedBlocks = codeBlocks.sort((a, b) => {
        const priorityA = languagePriority[a.language.toLowerCase()] || 0;
        const priorityB = languagePriority[b.language.toLowerCase()] || 0;
        return priorityB - priorityA; // Higher priority first
    });
    
    // Replace code blocks in sorted order
    let newContent = content;
    
    // Remove all code blocks first
    codeBlocks.forEach(block => {
        newContent = newContent.replace(block.fullMatch, `__CODEBLOCK_PLACEHOLDER_${block.index}__`);
    });
    
    // Replace with sorted blocks
    let placeholderIndex = 0;
    sortedBlocks.forEach(block => {
        const codeBlockHtml = createCodeBlock(block.code, block.language);
        // Find the next placeholder
        const placeholderPattern = /__CODEBLOCK_PLACEHOLDER_\d+__/;
        newContent = newContent.replace(placeholderPattern, codeBlockHtml);
    });
    
    return newContent;
}

function createCodeBlock(code, language = '') {
    // Input validation and error handling
    if (!code || typeof code !== 'string') {
        console.warn('Invalid code provided to createCodeBlock:', code);
        return '<div class="code-error">Error: Invalid code content</div>';
    }
    
    try {
        // Detect language if not specified
        if (!language) {
            language = detectLanguage(code);
        }
        
        // Generate unique ID for the code block
        const blockId = 'code-' + Math.random().toString(36).substr(2, 9);
        
        // Get language display name and icon
        const langInfo = getLanguageInfo(language.toLowerCase());
        
        // Get file extension for download
        const fileExtension = getFileExtension(language.toLowerCase());
        
        // Count lines for line number feature
        const lineCount = code.split('\n').length;
        const showLineNumbers = lineCount > 1; // Show line numbers for multi-line code
        
        // Generate line numbers if needed
        let lineNumbersHtml = '';
        if (showLineNumbers) {
            lineNumbersHtml = Array.from({length: lineCount}, (_, i) => 
                `<span class="line-number">${i + 1}</span>`
            ).join('\n');
        }
        
        return `
            <div class="code-container" data-language="${language}">
                <div class="code-header">
                    <div class="code-language">
                        <i class="${langInfo.icon}" style="color: ${langInfo.color}"></i>
                        <span class="language-name">${langInfo.name}</span>
                        ${lineCount > 1 ? `<span class="line-count">${lineCount} lines</span>` : ''}
                    </div>
                    <div class="code-actions">
                        <button class="code-action-btn code-copy-btn" data-code-id="${blockId}" data-action="copy" title="Copy code to clipboard" aria-label="Copy code">
                            <i class="fas fa-copy"></i>
                            <span class="action-text">Copy</span>
                        </button>
                        <button class="code-action-btn code-download-btn" data-code-id="${blockId}" data-action="download" data-extension="${fileExtension}" data-language-name="${langInfo.name}" title="Download as ${fileExtension} file" aria-label="Download code as file">
                            <i class="fas fa-download"></i>
                            <span class="action-text">Download</span>
                        </button>
                        ${lineCount > 5 ? `<button class="code-action-btn code-fold-btn" data-code-id="${blockId}" data-action="fold" title="Toggle code folding" aria-label="Toggle code folding">
                            <i class="fas fa-chevron-up"></i>
                        </button>` : ''}
                    </div>
                    </div>
                </div>
                <div class="code-content ${showLineNumbers ? 'with-line-numbers' : ''}" data-folded="false">
                    ${showLineNumbers ? `<div class="line-numbers" aria-hidden="true">${lineNumbersHtml}</div>` : ''}
                    <pre class="code-block"><code id="${blockId}" class="language-${language}" data-language="${language}">${escapeHtml(code)}</code></pre>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating code block:', error);
        return `<div class="code-error">Error: Failed to render code block</div>`;
    }
}

// Language detection cache to improve performance
const languageDetectionCache = new Map();

function detectLanguage(code) {
    // Safety check for undefined or null code
    if (!code || typeof code !== 'string') {
        return 'text';
    }
    
    // Check cache first for performance
    const cacheKey = code.substring(0, 200); // Use first 200 chars as cache key
    if (languageDetectionCache.has(cacheKey)) {
        return languageDetectionCache.get(cacheKey);
    }
    
    const trimmedCode = code.trim();
    const lowerCode = trimmedCode.toLowerCase();
    let detectedLanguage = 'text';
    
    // Language detection patterns with priority scoring
    const patterns = [
        // High confidence patterns (exact matches)
        { pattern: /^<\?php/i, language: 'php', confidence: 10 },
        { pattern: /^#!/, language: 'bash', confidence: 10 },
        { pattern: /<!doctype\s+html/i, language: 'html', confidence: 10 },
        
        // HTML detection (high priority)
        { pattern: /<\/?(html|head|body|div|span|p|h[1-6]|script|style|meta|link)\b/i, language: 'html', confidence: 9 },
        
        // CSS detection (high priority) 
        { pattern: /^\s*[@]?([\w-]+\s*:\s*[^;]+;|\w+\s*\{[^}]*\})/m, language: 'css', confidence: 9 },
        
        // JSON detection (early check for structured data)
        { pattern: /^\s*[\{\[][\s\S]*[\}\]]\s*$/, language: 'json', confidence: 8, validator: isValidJSON },
        
        // SQL detection (check before JavaScript due to keyword overlap)
        { pattern: /\b(select\s+.*\s+from|insert\s+into|update\s+.*\s+set|create\s+(table|database|index)|alter\s+table|drop\s+(table|database))\b/i, language: 'sql', confidence: 8 },
        
        // TypeScript detection (before JavaScript)
        { pattern: /\b(interface|type\s+\w+\s*=|declare|namespace|enum)\b/, language: 'typescript', confidence: 8 },
        { pattern: /:\s*(string|number|boolean|any|void|unknown)\b/, language: 'typescript', confidence: 7 },
        
        // JavaScript detection (comprehensive patterns)
        { pattern: /\b(function\s*\w*\s*\(|const\s+\w+\s*=|let\s+\w+|var\s+\w+|=>\s*[\{\(])/i, language: 'javascript', confidence: 7 },
        { pattern: /\b(console\.(log|error|warn|info)|document\.|window\.|require\(|import\s+.*\s+from)/i, language: 'javascript', confidence: 7 },
        
        // Python detection (improved patterns)
        { pattern: /\b(def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|print\s*\()/i, language: 'python', confidence: 7 },
        { pattern: /^\s*(if|for|while|class|try|except|with|def)\s+.*:/m, language: 'python', confidence: 6 },
        
        // Java detection
        { pattern: /\b(public\s+(static\s+)?void\s+main|public\s+class\s+\w+|System\.out\.println)/i, language: 'java', confidence: 7 },
        { pattern: /\b(package\s+\w+|import\s+java\.)/i, language: 'java', confidence: 6 },
        
        // C/C++ detection
        { pattern: /^\s*#include\s*<[\w\.]+>/m, language: 'cpp', confidence: 8 },
        { pattern: /\b(int\s+main\s*\(|printf\s*\(|cout\s*<<|std::)/i, language: 'cpp', confidence: 7 },
        
        // C# detection
        { pattern: /\b(using\s+System|namespace\s+\w+|Console\.WriteLine)/i, language: 'csharp', confidence: 7 },
        
        // Go detection
        { pattern: /\b(package\s+main|func\s+main\s*\(|fmt\.Print)/i, language: 'go', confidence: 7 },
        
        // Rust detection
        { pattern: /\b(fn\s+main\s*\(|println!\s*\(|use\s+std::)/i, language: 'rust', confidence: 7 },
        
        // PHP detection
        { pattern: /\$\w+|echo\s+.*|<\?php/i, language: 'php', confidence: 7 },
        
        // Ruby detection
        { pattern: /\b(def\s+\w+|puts\s+.*|require\s+.*|end\b)/i, language: 'ruby', confidence: 6 },
        
        // Shell/Bash detection
        { pattern: /\b(echo\s+.*|grep\s+.*|awk\s+.*|sed\s+.*|\|\s*\w+)/i, language: 'bash', confidence: 6 },
        
        // Swift detection
        { pattern: /\b(func\s+\w+|var\s+\w+:|let\s+\w+:|import\s+Foundation)/i, language: 'swift', confidence: 7 },
        
        // Kotlin detection
        { pattern: /\b(fun\s+\w+|val\s+\w+|var\s+\w+.*:|import\s+kotlin)/i, language: 'kotlin', confidence: 7 },
        
        // YAML detection
        { pattern: /^\s*\w+:\s*[^{}\[\]]*$/m, language: 'yaml', confidence: 5 },
        
        // XML detection
        { pattern: /^\s*<\?xml|<\/?\w+[^>]*>/i, language: 'xml', confidence: 6 }
    ];
    
    let bestMatch = { language: 'text', confidence: 0 };
    
    // Test patterns and find the best match
    for (const { pattern, language, confidence, validator } of patterns) {
        if (pattern.test(trimmedCode)) {
            // Additional validation if specified
            if (validator && !validator(trimmedCode)) {
                continue;
            }
            
            if (confidence > bestMatch.confidence) {
                bestMatch = { language, confidence };
            }
        }
    }
    
    detectedLanguage = bestMatch.language;
    
    // Cache the result (limit cache size to prevent memory issues)
    if (languageDetectionCache.size > 100) {
        const firstKey = languageDetectionCache.keys().next().value;
        languageDetectionCache.delete(firstKey);
    }
    languageDetectionCache.set(cacheKey, detectedLanguage);
    
    return detectedLanguage;
}

// Helper function to validate JSON
function isValidJSON(text) {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

function getLanguageInfo(language) {
    const langMap = {
        'html': { name: 'HTML', icon: 'fab fa-html5', color: '#e34c26' },
        'css': { name: 'CSS', icon: 'fab fa-css3-alt', color: '#1572b6' },
        'javascript': { name: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e' },
        'js': { name: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e' },
        'typescript': { name: 'TypeScript', icon: 'fas fa-code', color: '#007acc' },
        'ts': { name: 'TypeScript', icon: 'fas fa-code', color: '#007acc' },
        'python': { name: 'Python', icon: 'fab fa-python', color: '#3776ab' },
        'py': { name: 'Python', icon: 'fab fa-python', color: '#3776ab' },
        'java': { name: 'Java', icon: 'fab fa-java', color: '#ed8b00' },
        'csharp': { name: 'C#', icon: 'fas fa-code', color: '#239120' },
        'cs': { name: 'C#', icon: 'fas fa-code', color: '#239120' },
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
        'yaml': { name: 'YAML', icon: 'fas fa-file-code', color: '#cb171e' },
        'yml': { name: 'YAML', icon: 'fas fa-file-code', color: '#cb171e' },
        'xml': { name: 'XML', icon: 'fas fa-code', color: '#e4761f' },
        'markdown': { name: 'Markdown', icon: 'fab fa-markdown', color: '#083fa1' },
        'md': { name: 'Markdown', icon: 'fab fa-markdown', color: '#083fa1' },
        'text': { name: 'Text', icon: 'fas fa-file-alt', color: '#6c757d' }
    };
    
    return langMap[language] || langMap['text'];
}

function getFileExtension(language) {
    const extensionMap = {
        'html': '.html',
        'css': '.css',
        'javascript': '.js',
        'js': '.js',
        'typescript': '.ts',
        'ts': '.ts',
        'python': '.py',
        'py': '.py',
        'java': '.java',
        'csharp': '.cs',
        'cs': '.cs',
        'cpp': '.cpp',
        'c': '.c',
        'json': '.json',
        'sql': '.sql',
        'bash': '.sh',
        'sh': '.sh',
        'php': '.php',
        'ruby': '.rb',
        'go': '.go',
        'rust': '.rs',
        'swift': '.swift',
        'kotlin': '.kt',
        'yaml': '.yml',
        'yml': '.yml',
        'xml': '.xml',
        'markdown': '.md',
        'md': '.md',
        'text': '.txt'
    };
    
    return extensionMap[language] || '.txt';
}



function copyCodeBlock(blockId, buttonElement = null) {
    const codeElement = document.getElementById(blockId);
    if (!codeElement) {
        console.error('Code element not found:', blockId);
        showToast('Error: Code block not found', 'error');
        return;
    }
    
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        // Find the copy button if not provided
        if (!buttonElement) {
            buttonElement = document.querySelector(`button[data-code-id="${blockId}"][data-action="copy"]`);
        }
        
        if (buttonElement) {
            const originalText = buttonElement.querySelector('.action-text');
            const icon = buttonElement.querySelector('i');
            const originalIconClass = icon.className;
            const originalTextContent = originalText.textContent;
            
            // Update button to show success
            icon.className = 'fas fa-check';
            originalText.textContent = 'Copied!';
            buttonElement.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.className = originalIconClass;
                originalText.textContent = originalTextContent;
                buttonElement.classList.remove('copied');
            }, 2000);
        }
        
        showToast('Code copied to clipboard!', 'success');
    }).catch((error) => {
        console.error('Failed to copy code:', error);
        // Fallback for older browsers or clipboard API issues
        fallbackCopyToClipboard(code);
    });
}

function fallbackCopyToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showToast('Code copied to clipboard!', 'success');
        } else {
            showToast('Failed to copy code', 'error');
        }
    } catch (error) {
        console.error('Fallback copy failed:', error);
        showToast('Copy not supported in this browser', 'error');
    }
}

function downloadCodeBlock(blockId, fileExtension, languageName) {
    const codeElement = document.getElementById(blockId);
    if (!codeElement) {
        console.error('Code element not found:', blockId);
        showToast('Error: Code block not found', 'error');
        return;
    }
    
    try {
        const code = codeElement.textContent;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const filename = `code-${languageName.toLowerCase()}-${timestamp}${fileExtension}`;
        
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${filename}`, 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showToast('Download failed', 'error');
    }
}

// Enhanced web project functions
function downloadWebProject(projectId) {
    const projectContainer = document.getElementById(projectId);
    if (!projectContainer) {
        console.error('Project container not found:', projectId);
        showToast('Error: Project not found', 'error');
        return;
    }
    
    try {
        const fileContainers = projectContainer.querySelectorAll('.web-file-container');
        const files = [];
        
        fileContainers.forEach(container => {
            const filename = container.dataset.filename;
            const codeElement = container.querySelector('code');
            if (codeElement && filename) {
                files.push({
                    name: filename,
                    content: codeElement.textContent
                });
            }
        });
        
        if (files.length === 0) {
            showToast('No files found to download', 'warning');
            return;
        }
        
        // Create ZIP file using JSZip (if available) or download files individually
        if (typeof JSZip !== 'undefined') {
            createZipAndDownload(files);
        } else {
            // Fallback: download files individually
            downloadFilesIndividually(files);
        }
        
    } catch (error) {
        console.error('Download failed:', error);
        showToast('Download failed', 'error');
    }
}

function downloadFilesIndividually(files) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    
    files.forEach((file, index) => {
        setTimeout(() => {
            const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        }, index * 500); // Stagger downloads to avoid browser blocking
    });
    
    showToast(`Downloading ${files.length} files...`, 'success');
}

function createZipAndDownload(files) {
    const zip = new JSZip();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    
    files.forEach(file => {
        zip.file(file.name, file.content);
    });
    
    zip.generateAsync({type: 'blob'}).then(function(content) {
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `website-project-${timestamp}.zip`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        showToast('Project downloaded as ZIP file!', 'success');
    }).catch(error => {
        console.error('ZIP creation failed:', error);
        downloadFilesIndividually(files);
    });
}

function copyAllWebCode(projectId) {
    const projectContainer = document.getElementById(projectId);
    if (!projectContainer) {
        console.error('Project container not found:', projectId);
        showToast('Error: Project not found', 'error');
        return;
    }
    
    try {
        const fileContainers = projectContainer.querySelectorAll('.web-file-container');
        let allCode = '';
        
        fileContainers.forEach(container => {
            const filename = container.dataset.filename;
            const language = container.dataset.language;
            const codeElement = container.querySelector('code');
            
            if (codeElement && filename) {
                const langInfo = getLanguageInfo(language);
                allCode += `// ========== ${filename.toUpperCase()} (${langInfo.name}) ==========\n`;
                allCode += codeElement.textContent;
                allCode += '\n\n';
            }
        });
        
        if (!allCode.trim()) {
            showToast('No code found to copy', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(allCode.trim()).then(() => {
            showToast('All code copied to clipboard!', 'success');
        }).catch((error) => {
            console.error('Failed to copy code:', error);
            fallbackCopyToClipboard(allCode.trim());
        });
        
    } catch (error) {
        console.error('Copy failed:', error);
        showToast('Copy failed', 'error');
    }
}

function downloadSingleFile(blockId, fileExtension, suggestedFilename) {
    const codeElement = document.getElementById(blockId);
    if (!codeElement) {
        console.error('Code element not found:', blockId);
        showToast('Error: Code block not found', 'error');
        return;
    }
    
    try {
        const code = codeElement.textContent;
        const filename = suggestedFilename || `code${fileExtension}`;
        
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${filename}`, 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showToast('Download failed', 'error');
    }
}

function toggleCodeFold(blockId, buttonElement) {
    const codeContainer = buttonElement.closest('.code-container');
    const codeContent = codeContainer.querySelector('.code-content');
    const icon = buttonElement.querySelector('i');
    
    if (!codeContent) {
        console.error('Code content not found for folding');
        return;
    }
    
    const isFolded = codeContent.dataset.folded === 'true';
    
    if (isFolded) {
        // Unfold
        codeContent.dataset.folded = 'false';
        codeContent.style.maxHeight = 'none';
        icon.className = 'fas fa-chevron-up';
        buttonElement.title = 'Fold code';
    } else {
        // Fold
        codeContent.dataset.folded = 'true';
        codeContent.style.maxHeight = '150px';
        icon.className = 'fas fa-chevron-down';
        buttonElement.title = 'Unfold code';
    }
}

function copyMessage(encodedContent) {
    try {
        const content = decodeURIComponent(encodedContent);
        
        // Ensure content is a string
        const contentToCopy = typeof content === 'string' ? content : String(content || 'Empty message');
        
        navigator.clipboard.writeText(contentToCopy).then(() => {
            showToast('Message copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = contentToCopy;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            showToast('Message copied to clipboard!', 'success');
        });
    } catch (error) {
        console.error('Error copying message:', error);
        showToast('Error copying message', 'error');
    }
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
            console.log('File selected for upload:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
            
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
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
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
                <span>🔍 Image ready for analysis. Ask me anything about this image!</span>
            </div>
        `;
        
        // Store image data for sending with next message
        window.currentImageData = imageData;
        
        // Insert preview above input
        const inputArea = document.querySelector('.input-area');
        const inputContainer = document.querySelector('.input-container');
        inputArea.insertBefore(previewContainer, inputContainer);
        
        // Focus on input and update placeholder
        messageInput.focus();
        messageInput.placeholder = "Ask me anything about this image...";
        
        showToast('✅ Image uploaded successfully! Ask me anything about it.', 'success');
        
        // Log for debugging
        console.log('Image uploaded:', {
            size: file.size,
            type: file.type,
            name: file.name,
            dataLength: imageData.length
        });
    };
    
    reader.onerror = function() {
        showToast('Failed to read image file', 'error');
        console.error('FileReader error');
    };
    
    reader.readAsDataURL(file);
}

function handleFileUpload(file) {
    // Enhanced file upload handling for non-image files
    console.log('Processing non-image file:', file.name, file.type);
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for other files
        showToast('File must be smaller than 10MB', 'error');
        return;
    }
    
    // For now, provide guidance about file handling
    const fileExtension = file.name.split('.').pop().toLowerCase();
    let message = `I see you've uploaded a ${fileExtension.toUpperCase()} file: "${file.name}". `;
    
    switch (fileExtension) {
        case 'txt':
            message += 'I can help you analyze text content, writing, or code within text files.';
            break;
        case 'pdf':
            message += 'I can provide guidance on PDF processing, text extraction, and document analysis.';
            break;
        case 'doc':
        case 'docx':
            message += 'I can help with document formatting, writing assistance, and Word document processing.';
            break;
        default:
            message += 'I can provide guidance on how to work with this file type.';
    }
    
    message += ' Please describe what you\'d like to do with this file, and I\'ll help you!';
    
    // Add the file context to the next message
    messageInput.value = message;
    messageInput.focus();
    
    showToast(`File "${file.name}" uploaded! Ask me about it in the message.`, 'info');
}

// Remove image preview
function removeImagePreview(button) {
    const container = button.closest('.image-preview-container');
    if (container) {
        container.remove();
    }
    
    // Clear stored image data
    window.currentImageData = null;
    
    // Reset input placeholder
    messageInput.placeholder = "Message Talkie Gen AI...";
    
    // Show feedback
    showToast('Image removed', 'info');
    
    // Focus back on input
    messageInput.focus();
    
    console.log('Image preview removed and data cleared');
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

// Enhanced debugging and system testing functions
window.debugAISystem = function() {
    console.log('🔧 AI System Debug Information:');
    console.log('Puter SDK Available:', typeof puter !== 'undefined');
    console.log('Current User:', currentUser);
    console.log('Memory Enabled:', conversationSettings.enableMemory);
    console.log('Current Chat ID:', currentChatId);
    console.log('Chat Count:', Object.keys(chats).length);
    console.log('Memory Data:', currentUser ? userMemory[currentUser.email] : null);
    console.log('Conversation Settings:', conversationSettings);
    
    // Test basic functionality
    console.log('🧪 Running basic functionality tests...');
    
    // Test code block creation
    try {
        const testCode = 'console.log("Hello World!");';
        const codeBlock = createCodeBlock(testCode, 'javascript');
        console.log('✅ Code block creation: PASS');
    } catch (error) {
        console.error('❌ Code block creation: FAIL', error);
    }
    
    // Test memory functions
    try {
        if (currentUser) {
            initializeMemorySystem();
            console.log('✅ Memory system: PASS');
        } else {
            console.log('⚠️ Memory system: SKIPPED (no user)');
        }
    } catch (error) {
        console.error('❌ Memory system: FAIL', error);
    }
    
    return {
        puterAvailable: typeof puter !== 'undefined',
        userLoggedIn: !!currentUser,
        memoryEnabled: conversationSettings.enableMemory,
        chatCount: Object.keys(chats).length
    };
};

// Force refresh code block event listeners
window.refreshCodeBlockListeners = function() {
    console.log('🔄 Refreshing code block event listeners...');
    
    // Remove existing listeners and re-add them
    const codeButtons = document.querySelectorAll('.code-action-btn');
    codeButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Re-setup event delegation (it should already exist, but ensure it's working)
    setupCodeBlockEventListeners();
    
    console.log('✅ Code block listeners refreshed');
};

// Setup code block event listeners (separate function for clarity)
function setupCodeBlockEventListeners() {
    // Use event delegation for dynamically created code blocks
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.code-action-btn');
        if (!target) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const action = target.dataset.action;
        const codeId = target.dataset.codeId;
        
        if (!codeId) {
            console.error('Code ID not found for action:', action);
            showToast('Error: Code block ID not found', 'error');
            return;
        }
        
        console.log(`Executing code action: ${action} for block: ${codeId}`);
        
        switch (action) {
            case 'copy':
                copyCodeBlock(codeId, target);
                break;
            case 'download':
                downloadCodeBlock(codeId, target.dataset.extension, target.dataset.languageName);
                break;
            case 'fold':
                toggleCodeFold(codeId, target);
                break;
            default:
                console.warn('Unknown code action:', action);
                showToast('Unknown action: ' + action, 'warning');
        }
    });
}

// Test Image Analysis Function (for debugging)
window.testImageAnalysis = async function() {
    console.log('🧪 Testing Image Analysis Functionality...');
    
    // Test with a sample data URL (small 1x1 red pixel)
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    console.log('Setting test image data...');
    window.currentImageData = testImageData;
    
    try {
        console.log('Calling getAIResponse with test message...');
        const response = await getAIResponse('[User has uploaded an image for analysis] What do you see in this image?');
        console.log('✅ Image analysis test completed successfully!');
        console.log('Response:', response);
        return response;
    } catch (error) {
        console.error('❌ Image analysis test failed:', error);
        return null;
    } finally {
        // Clean up
        window.currentImageData = null;
        console.log('🧹 Test cleanup completed');
    }
};

// Comprehensive AI System Test
window.testAISystem = async function() {
    console.log('🔧 Testing Complete AI System Integration...');
    
    const tests = [
        {
            name: 'Text Chat',
            test: async () => {
                const response = await getAIResponse('Hello! Test message.');
                return response.includes('Talkie Gen AI') ? 'PASS' : 'FAIL';
            }
        },
        {
            name: 'Image Analysis',
            test: async () => {
                window.currentImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
                const response = await getAIResponse('[User has uploaded an image for analysis] Analyze this image.');
                window.currentImageData = null;
                return response.includes('image') ? 'PASS' : 'FAIL';
            }
        },
        {
            name: 'Code Formatting',
            test: async () => {
                const response = await getAIResponse('Write a simple JavaScript function.');
                return response.includes('```') ? 'PASS' : 'FAIL';
            }
        },
        {
            name: 'Error Handling',
            test: async () => {
                try {
                    // Simulate an error condition
                    const response = await getFallbackAIResponse('Test error handling', [], false);
                    return response ? 'PASS' : 'FAIL';
                } catch (error) {
                    return 'FAIL';
                }
            }
        }
    ];
    
    console.log('Running AI system tests...');
    const results = {};
    
    for (const test of tests) {
        try {
            console.log(`Testing ${test.name}...`);
            results[test.name] = await test.test();
            console.log(`${test.name}: ${results[test.name]}`);
        } catch (error) {
            console.error(`${test.name} failed:`, error);
            results[test.name] = 'ERROR';
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🏁 AI System Test Results:', results);
    
    const passed = Object.values(results).filter(r => r === 'PASS').length;
    const total = Object.keys(results).length;
    
    console.log(`✅ Tests passed: ${passed}/${total}`);
    
    if (passed === total) {
        console.log('🎉 All AI system components are working correctly!');
    } else {
        console.warn('⚠️ Some AI system components need attention.');
    }
    
    return results;
};

// Global functions for HTML onclick handlers
window.sendPrompt = sendPrompt;
window.loadChat = loadChat;
window.deleteChat = deleteChat;
window.copyMessage = copyMessage;
window.regenerateMessage = regenerateMessage;
window.removeImagePreview = removeImagePreview;
window.copyCodeBlock = copyCodeBlock;
window.sendFollowUpQuestion = sendFollowUpQuestion;
window.downloadGeneratedImage = downloadGeneratedImage;
window.regenerateImage = regenerateImage;
window.downloadWebProject = downloadWebProject;
window.copyAllWebCode = copyAllWebCode;
window.downloadSingleFile = downloadSingleFile;

// Admin debugging function (accessible from browser console)
window.checkAdminAccount = async function() {
    try {
        console.log('=== APPWRITE ADMIN ACCOUNT STATUS ===');
        
        if (!appwriteAccount) {
            console.log('❌ Appwrite SDK not loaded');
            console.log('This usually means external resources are blocked');
            console.log('In production, Appwrite will be available');
            return false;
        }
        
        try {
            const currentSession = await appwriteAccount.get();
            console.log('Current logged in user:', {
                name: currentSession.name,
                email: currentSession.email,
                id: currentSession.$id
            });
            
            if (currentSession.email === 'coenyin9@gmail.com') {
                console.log('✅ Owner account is currently logged in');
            } else {
                console.log('ℹ️ Different user logged in, not the owner');
            }
        } catch (sessionError) {
            console.log('No active session found');
        }
        
        console.log('Expected owner email: coenyin9@gmail.com');
        console.log('Expected password: Carronshore93');
        console.log('');
        console.log('To create owner account:');
        console.log('1. Sign up with email: coenyin9@gmail.com');
        console.log('2. Use password: Carronshore93');
        console.log('3. Owner privileges will be automatically assigned');
        console.log('');
        console.log('Current user logged in:', !!currentUser);
        if (currentUser) {
            console.log('Current user details:', {
                name: currentUser.name,
                email: currentUser.email,
                isAdmin: currentUser.isAdmin,
                isPro: currentUser.isPro,
                isOwner: currentUser.isOwner
            });
        }
        console.log('========================');
        
        return true;
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
    if (!currentUser || (!currentUser.isAdmin && !currentUser.isOwner)) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    adminModalOverlay.classList.add('active');
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Ensure all users are synced before loading stats
    syncExistingUserData();
    
    // Load and display statistics
    loadAdminStats();
    
    // Also refresh user count to ensure it's accurate
    setTimeout(() => {
        loadAdminStats();
    }, 100);
}

function hideAdminPanel() {
    adminModalOverlay.classList.remove('active');
    adminModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function loadAdminStats() {
    const stats = JSON.parse(localStorage.getItem('talkie-stats') || '{}');
    let users = {};
    let userCount = 0;
    
    // Try to get real user count from Appwrite if admin
    if (currentUser && (currentUser.isAdmin || currentUser.isOwner)) {
        try {
            users = await listAllUsers();
            userCount = Object.keys(users).length;
        } catch (error) {
            console.error('Error loading user data from Appwrite:', error);
            // Fallback to local storage
            users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
            userCount = Object.keys(users).length;
        }
    } else {
        users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        userCount = Object.keys(users).length;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Update stat displays
    document.getElementById('totalVisitors').textContent = stats.totalVisits || 0;
    document.getElementById('uniqueVisitors').textContent = stats.uniqueVisitors || 0;
    document.getElementById('todayVisits').textContent = stats.dailyVisits?.[today] || 0;
    document.getElementById('registeredUsers').textContent = userCount;
    
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
        searchUserBtn.addEventListener('click', () => searchUser());
    }
    
    if (userSearchInput) {
        userSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchUser();
            }
        });
        
        // Add placeholder with example email for better UX
        userSearchInput.placeholder = 'Enter user email (e.g., user@example.com)';
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
    
    // Add a "List All Users" button functionality
    addListAllUsersButton();
}

// Add functionality to list all users for easier management
function addListAllUsersButton() {
    try {
        // Find the user search container
        const userSearch = document.querySelector('.user-search');
        if (!userSearch) return;
        
        // Check if button already exists
        if (document.getElementById('listAllUsersBtn')) return;
        
        // Create "List All Users" button
        const listAllBtn = document.createElement('button');
        listAllBtn.id = 'listAllUsersBtn';
        listAllBtn.className = 'search-btn';
        listAllBtn.innerHTML = '<i class="fas fa-list"></i> List All';
        listAllBtn.title = 'Show all registered users';
        
        // Add click handler
        listAllBtn.addEventListener('click', listAllUsers);
        
        // Insert after the search button
        const searchBtn = document.getElementById('searchUserBtn');
        if (searchBtn) {
            searchBtn.parentNode.insertBefore(listAllBtn, searchBtn.nextSibling);
        }
    } catch (error) {
        console.error('Error adding list all users button:', error);
    }
}

// Function to list all users
async function listAllUsers() {
    try {
        let users = {};
        let userEmails = [];
        
        // Try to get users from Appwrite server API first
        if (currentUser && (currentUser.isAdmin || currentUser.isOwner)) {
            try {
                const appwriteUsers = await getAllUsers();
                console.log('Appwrite users:', appwriteUsers);
                
                // Convert Appwrite users to our format
                appwriteUsers.forEach(user => {
                    users[user.email] = {
                        name: user.name,
                        email: user.email,
                        appwriteId: user.$id,
                        isPro: false, // We'll enhance this with user preferences later
                        isAdmin: user.email === 'coenyin9@gmail.com',
                        isOwner: user.email === 'coenyin9@gmail.com',
                        profilePhoto: null,
                        emailVerified: user.emailVerification,
                        signupDate: user.$createdAt,
                        lastLoginDate: user.$updatedAt
                    };
                });
                
                userEmails = Object.keys(users);
                
                // Also sync with local storage for compatibility
                localStorage.setItem('talkie-users', JSON.stringify(users));
                
                showToast(`Found ${userEmails.length} user(s) from Appwrite. Check console for details.`, 'success');
            } catch (serverError) {
                console.error('Error fetching from Appwrite:', serverError);
                showToast('Failed to fetch users from Appwrite, falling back to local data', 'warning');
                
                // Fallback to local storage
                users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
                userEmails = Object.keys(users);
            }
        } else {
            // Non-admin users or fallback
            users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
            userEmails = Object.keys(users);
        }
        
        if (userEmails.length === 0) {
            showToast('No users found in the system. Users will appear after they sign up.', 'info');
            return users;
        }
        
        // Show all users in console and toast
        console.log('All registered users:', users);
        console.log('User emails:', userEmails);
        
        // Create a summary for the toast
        const userSummary = userEmails.slice(0, 3).join(', ') + 
                           (userEmails.length > 3 ? ` and ${userEmails.length - 3} more` : '');
        
        if (!currentUser || (!currentUser.isAdmin && !currentUser.isOwner)) {
            showToast(`Found ${userEmails.length} user(s): ${userSummary}. Check console for full list.`, 'success');
        }
        
        // If there's only one user, auto-select them
        if (userEmails.length === 1 && document.getElementById('userSearchInput')) {
            document.getElementById('userSearchInput').value = userEmails[0];
            searchUser();
        }
        
        return users;
        
    } catch (error) {
        console.error('Error listing all users:', error);
        showToast('Error retrieving user list', 'error');
        return {};
    }
}

// Debug function to check admin system status (can be called from console)
function checkAdminSystem() {
    console.log('=== Admin System Debug Information ===');
    console.log('Current User:', currentUser);
    console.log('Appwrite Client Available:', !!appwriteClient);
    console.log('Appwrite Account Available:', !!appwriteAccount);
    
    const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    console.log('Users in Admin System:', users);
    console.log('Number of Users:', Object.keys(users).length);
    
    const currentUserData = localStorage.getItem('talkie-user');
    console.log('Current User Data in Storage:', currentUserData ? JSON.parse(currentUserData) : null);
    
    // Check if current user is in admin system
    if (currentUser && users[currentUser.email]) {
        console.log('✅ Current user is in admin system');
    } else if (currentUser) {
        console.log('❌ Current user is NOT in admin system - syncing now...');
        storeUserInAdminSystem(currentUser);
    } else {
        console.log('ℹ️ No current user logged in');
    }
    
    console.log('=== End Debug Information ===');
    return {
        currentUser,
        usersInAdminSystem: users,
        userCount: Object.keys(users).length,
        appwriteAvailable: !!appwriteClient
    };
}

let selectedUserEmail = null;

async function searchUser() {
    const email = document.getElementById('userSearchInput').value.trim();
    if (!email) {
        showToast('Please enter an email address', 'warning');
        return;
    }
    
    let users = {};
    
    // Try to get fresh user data from Appwrite if admin
    if (currentUser && (currentUser.isAdmin || currentUser.isOwner)) {
        try {
            users = await listAllUsers();
        } catch (error) {
            console.error('Error fetching users from Appwrite:', error);
            // Fallback to local storage
            users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        }
    } else {
        users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    }
    
    const user = users[email];
    
    if (!user) {
        // Provide more helpful feedback with available users
        const userCount = Object.keys(users).length;
        const userEmails = Object.keys(users);
        
        if (userCount === 0) {
            showToast('No users found in the system. Users will appear here after they sign up and the data syncs.', 'info');
        } else {
            console.log('Available users in system:', userEmails);
            showToast(`User "${email}" not found. ${userCount} user(s) registered in system. Check console for available emails.`, 'error');
        }
        document.getElementById('userDetails').style.display = 'none';
        return;
    }
    
    selectedUserEmail = email;
    displayUserDetails(user);
    showToast(`Found user: ${user.name}`, 'success');
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

function toggleUserPro() {
    if (!selectedUserEmail) return;
    
    if (!currentUser?.isOwner && !currentUser?.isAdmin) {
        showToast('You do not have permission to modify user accounts', 'error');
        return;
    }
    
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

function toggleUserAdmin() {
    if (!selectedUserEmail) return;
    
    if (!currentUser?.isOwner) {
        showToast('Only the owner can grant or remove admin privileges', 'error');
        return;
    }
    
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
