// API Configuration - Updated with working API key
const GROQ_API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

// State
let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('talkie-chats') || '{}');
let isGenerating = false;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    loadChatHistory();
    autoResizeTextarea();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('talkie-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('talkie-theme', newTheme);
    updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Light mode';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark mode';
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
    if (confirm('Delete this conversation? This action cannot be undone.')) {
        delete chats[chatId];
        if (currentChatId === chatId) {
            currentChatId = null;
            showWelcomeScreen();
        }
        updateChatHistory();
        saveChats();
    }
}

function clearAllChats() {
    if (confirm('Delete all conversations? This action cannot be undone.')) {
        chats = {};
        currentChatId = null;
        showWelcomeScreen();
        updateChatHistory();
        saveChats();
        userDropdown.classList.remove('show');
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

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || isGenerating) return;

    if (!currentChatId) {
        startNewChat();
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
        const response = await getAIResponse(content);
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

// FIXED AI Response Function - removed name references
async function getAIResponse(userMessage) {
    isGenerating = true;
    sendButton.disabled = true;

    const chat = chats[currentChatId];
    
    // Clean messages for API - remove timestamp and other properties Groq doesn't support
    const cleanedMessages = chat.messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    const messages = [
        {
            role: 'system',
            content: `You are Talkie Gen AI, a helpful and intelligent AI assistant created in 2024. 

IMPORTANT IDENTITY:
- Always identify yourself as "Talkie Gen AI" when asked about your name or identity
- Never mention being ChatGPT, Claude, or any other AI system
- You are Talkie Gen AI, a unique and helpful assistant
- Do not address the user by name unless they specifically provide it in conversation

RESPONSE GUIDELINES:
- Keep responses concise and under 150 words unless asked for longer explanations
- Be friendly, helpful, and professional
- Provide accurate, helpful information
- For coding questions, provide working examples
- Use clear, simple language
- Be conversational but informative
- Address the user naturally without using their login name

CURRENT CONTEXT:
- Current date and time: 2025-09-02 15:25:52 (UTC)
- You are Talkie Gen AI, not any other AI assistant`
        },
        ...cleanedMessages,
        {
            role: 'user',
            content: userMessage
        }
    ];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               model: 'openai/gpt-oss-120b',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                top_p: 0.9,
                stream: false
            })
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

        return data.choices[0].message.content;

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
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function copyMessage(encodedContent) {
    const content = decodeURIComponent(encodedContent);
    navigator.clipboard.writeText(content).then(() => {
        // Copy successful - no toast message
    }).catch(() => {
        console.error('Failed to copy message');
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
            console.log('File selected:', file.name);
        }
    };
    input.click();
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

// Toast System - Only for important errors
function showToast(message, type = 'info') {
    if (type === 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-exclamation-circle"></i>
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
