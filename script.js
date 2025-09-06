// API Configuration - Using Appwrite function for secure AI requests
// TODO: Replace with your actual Appwrite function URL after deployment
const APPWRITE_FUNCTION_URL = 'https://[YOUR_APPWRITE_PROJECT_ID].appwrite.global/functions/[YOUR_FUNCTION_ID]/executions';
// Fallback for development - remove this line in production
const DEVELOPMENT_MODE = true;
// REMOVE THIS LINE IN PRODUCTION - only for development fallback
const GROQ_API_KEY = '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';

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

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeAuth();
    initializeAdmin(); // Initialize admin system
    trackVisitor(); // Track visitor statistics
    checkProUpgrade(); // Check for pro upgrade URL
    setupEventListeners();
    loadChatHistory();
    autoResizeTextarea();
});

// Initialize admin system
function initializeAdmin() {
    try {
        // Create admin account if it doesn't exist
        const users = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        const adminEmail = 'coenyin9@gmail.com';
        
        // Always ensure admin account exists with correct properties
        if (!users[adminEmail]) {
            const hashedPassword = hashPassword('Carronshore93');
            users[adminEmail] = {
                name: 'Coen Admin',
                email: adminEmail,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isPro: true,
                isAdmin: true,
                profilePhoto: null
            };
            localStorage.setItem('talkie-users', JSON.stringify(users));
            console.log('Admin account created successfully');
        } else {
            // Ensure existing admin account has all required properties
            if (!users[adminEmail].isAdmin) {
                users[adminEmail].isAdmin = true;
                users[adminEmail].isPro = true;
                localStorage.setItem('talkie-users', JSON.stringify(users));
                console.log('Admin account permissions updated');
            }
        }
    } catch (error) {
        console.error('Error initializing admin account:', error);
        // Force create admin account as fallback
        try {
            const adminEmail = 'coenyin9@gmail.com';
            const hashedPassword = hashPassword('Carronshore93');
            const users = {
                [adminEmail]: {
                    name: 'Coen Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    createdAt: new Date().toISOString(),
                    isPro: true,
                    isAdmin: true,
                    profilePhoto: null
                }
            };
            localStorage.setItem('talkie-users', JSON.stringify(users));
            console.log('Admin account force-created as fallback');
        } catch (fallbackError) {
            console.error('Failed to create admin account fallback:', fallbackError);
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
    
    if (currentUser && currentUser.isPro) {
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
        text.textContent = currentUser && currentUser.isPro ? 'Pro mode' : 'Light mode';
    } else if (theme === 'pro') {
        icon.className = 'fas fa-crown';
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
        const displayName = currentUser.name + (currentUser.isPro ? ' Pro' : '') + (currentUser.isAdmin ? ' Admin' : '');
        displayUsername.innerHTML = currentUser.isPro ? 
            `${currentUser.name} <span class="pro-badge">${currentUser.isAdmin ? 'Admin' : 'Pro'}</span>` : 
            currentUser.name;
        
        userStatus.textContent = currentUser.isAdmin ? 'Administrator' : 'Online';
        
        // Set user avatar - either custom photo or initials
        if (currentUser.profilePhoto) {
            userAvatar.innerHTML = `<img src="${currentUser.profilePhoto}" alt="Profile">`;
        } else {
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
        
        // Show user menu items - Profile only for Pro users, Admin panel for admins
        profileBtn.style.display = currentUser.isPro ? 'flex' : 'none';
        
        // Show admin button for admin users
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn && currentUser.isAdmin) {
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
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('talkie-users') || '{}');
    if (existingUsers[email]) {
        showToast('An account with this email already exists', 'error');
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
        profilePhoto: null
    };
    
    // Save user
    existingUsers[email] = newUser;
    localStorage.setItem('talkie-users', JSON.stringify(existingUsers));
    
    // Log in the user
    currentUser = { name, email, isPro: false, isAdmin: false, profilePhoto: null };
    localStorage.setItem('talkie-user', JSON.stringify(currentUser));
    
    // Check for pending pro upgrade
    if (sessionStorage.getItem('pendingProUpgrade') === 'true') {
        sessionStorage.removeItem('pendingProUpgrade');
        upgradeToPro();
    }
    
    hideAuthModal();
    updateUserInterface();
    showToast(`Welcome to Talkie Gen AI, ${name}!`, 'success');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    try {
        // Check credentials
        const existingUsers = JSON.parse(localStorage.getItem('talkie-users') || '{}');
        const user = existingUsers[email];
        
        if (!user) {
            // For debugging: log available users (remove in production)
            console.log('Available users:', Object.keys(existingUsers));
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
            profilePhoto: user.profilePhoto || null
        };
        localStorage.setItem('talkie-user', JSON.stringify(currentUser));
        
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
        showToast('An error occurred during login. Please refresh the page and try again.', 'error');
    }
}

function handleLogout() {
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

// AI Response Function - Updated to use Appwrite function
async function getAIResponse(userMessage) {
    isGenerating = true;
    sendButton.disabled = true;

    const chat = chats[currentChatId];
    
    // Clean messages for API - remove timestamp and other properties
    const cleanedMessages = chat.messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // Add the new user message
    const messages = [
        ...cleanedMessages,
        {
            role: 'user',
            content: userMessage
        }
    ];

    // Determine user type for the AI function
    const userType = (currentUser && currentUser.isPro) ? 'pro' : 'free';

    try {
        // Check if we're in development mode with fallback
        if (DEVELOPMENT_MODE && typeof GROQ_API_KEY !== 'undefined') {
            // Fallback to direct API call for development
            return await callGroqDirectly(messages, userType);
        }

        // Call Appwrite function
        const response = await fetch(APPWRITE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Appwrite-Response-Format': '1.0.0'
            },
            body: JSON.stringify({
                messages: messages,
                userType: userType
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Appwrite Function Error:', errorData);
            
            let errorMessage = 'AI service temporarily unavailable';
            if (response.status === 404) {
                errorMessage = 'AI function not found. Please check configuration.';
            } else if (response.status === 429) {
                errorMessage = 'Rate limit exceeded. Please wait a moment';
            } else if (response.status >= 500) {
                errorMessage = 'AI service is experiencing issues. Please try again';
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (!data.success || !data.message) {
            console.error('Invalid function response format:', data);
            throw new Error(data.message || 'Invalid AI response format');
        }

        return data.message;

    } catch (error) {
        console.error('AI Function Error:', error);
        throw new Error(error.message || 'Failed to get AI response');
    } finally {
        isGenerating = false;
        sendButton.disabled = false;
    }
}

// Development fallback function (remove in production)
async function callGroqDirectly(messages, userType) {
    // This is a fallback for development when Appwrite function isn't deployed yet
    if (typeof GROQ_API_KEY === 'undefined') {
        throw new Error('AI service not configured. Please deploy the Appwrite function.');
    }

    // Create system message based on user type
    let systemContent;
    if (userType === 'pro') {
        systemContent = `You are Talkie Gen AI Pro, an advanced and highly sophisticated AI assistant created in 2024. 

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI Pro" when asked about your name or identity
- You are the premium version with enhanced capabilities and deeper knowledge
- Never mention being ChatGPT, Claude, or any other AI system
- Maintain a professional, respectful, and helpful tone at all times

ENHANCED RESPONSE GUIDELINES:
- Provide more detailed, nuanced, and comprehensive responses (150-300 words)
- Use sophisticated vocabulary while remaining clear and accessible
- Offer deeper insights, multiple perspectives, and advanced analysis

CODE FORMATTING REQUIREMENTS:
- ALWAYS format code using proper markdown code blocks with triple backticks (\`\`\`)
- Specify the programming language after the opening backticks

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI Pro, the premium intelligence assistant`;
    } else {
        systemContent = `You are Talkie Gen AI, a helpful and intelligent AI assistant created in 2024. 

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI" when asked about your name or identity
- Never mention being ChatGPT, Claude, or any other AI system

RESPONSE GUIDELINES:
- Keep responses concise and under 150 words unless asked for longer explanations
- Be friendly, helpful, and professional

CODE FORMATTING REQUIREMENTS:
- ALWAYS format code using proper markdown code blocks with triple backticks (\`\`\`)
- Specify the programming language after the opening backticks

CURRENT CONTEXT:
- Current date and time: ${new Date().toLocaleString()} (UTC)
- You are Talkie Gen AI, not any other AI assistant`;
    }

    const apiMessages = [
        {
            role: 'system',
            content: systemContent
        },
        ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: apiMessages,
            temperature: 0.3,
            max_tokens: 1500,
            top_p: 0.9,
            stream: false
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`API Error ${response.status}: ${errorData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
    }

    return data.choices[0].message.content;
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
