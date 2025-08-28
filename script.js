class TalkieGen {
    constructor() {
        // API Configuration
        this.apiKey = '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';
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'openai/gpt-oss-120b';
        
        // State management
        this.conversationHistory = [];
        this.isTyping = false;
        this.messageIdCounter = 0;
        this.isListening = false;
        this.isSpeechEnabled = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.scrollTimeout = null;
        
        // DOM elements
        this.elements = {
            messageInput: document.getElementById('messageInput'),
            sendButton: document.getElementById('sendButton'),
            chatMessages: document.getElementById('chatMessages'),
            welcomeScreen: document.getElementById('welcomeScreen'),
            typingIndicator: document.getElementById('typingIndicator'),
            themeToggle: document.getElementById('themeToggle'),
            clearChat: document.getElementById('clearChat'),
            exportChat: document.getElementById('exportChat'),
            charCount: document.getElementById('charCount'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            errorToast: document.getElementById('errorToast'),
            successToast: document.getElementById('successToast'),
            voiceButton: document.getElementById('voiceButton'),
            clearTextBtn: document.getElementById('clearTextBtn'),
            speakToggle: document.getElementById('speakToggle'),
            fullscreenBtn: document.getElementById('fullscreenBtn')
        };
        
        this.init();
    }
    
    init() {
        this.loadConversationHistory();
        this.setupEventListeners();
        this.setupTheme();
        this.setupVoiceRecognition();
        this.setupTextToSpeech();
        this.autoResizeTextarea();
        this.hideLoadingOverlay();
        
        // Initialize with welcome screen if no conversation history
        if (this.conversationHistory.length === 0) {
            this.showWelcomeScreen();
        } else {
            this.hideWelcomeScreen();
            this.renderConversationHistory();
        }
        
        console.log('Talkie Gen initialized successfully');
    }
    
    setupEventListeners() {
        // Message input events with optimized debouncing
        let inputTimeout;
        this.elements.messageInput.addEventListener('input', () => {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                this.updateCharCount();
                this.updateSendButtonState();
                this.autoResizeTextarea();
            }, 100);
        });
        
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Send button
        this.elements.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Clear chat
        this.elements.clearChat.addEventListener('click', () => {
            this.clearConversation();
        });
        
        // Export chat
        this.elements.exportChat.addEventListener('click', () => {
            this.exportConversation();
        });
        
        // Voice button
        this.elements.voiceButton.addEventListener('click', () => {
            this.toggleVoiceInput();
        });
        
        // Clear text button
        this.elements.clearTextBtn.addEventListener('click', () => {
            this.clearMessageInput();
        });
        
        // Speech toggle
        this.elements.speakToggle.addEventListener('click', () => {
            this.toggleTextToSpeech();
        });
        
        // Fullscreen toggle
        this.elements.fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Toast close buttons
        const errorClose = this.elements.errorToast.querySelector('.error-close');
        if (errorClose) {
            errorClose.addEventListener('click', () => {
                this.hideErrorToast();
            });
        }
        
        // Auto-hide success toasts
        this.elements.successToast.addEventListener('animationend', () => {
            setTimeout(() => this.hideSuccessToast(), 3000);
        });
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('talkie-gen-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('talkie-gen-theme', newTheme);
        
        this.showSuccessToast(`Switched to ${newTheme} theme`);
    }
    
    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        requestAnimationFrame(() => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        });
    }
    
    updateCharCount() {
        const count = this.elements.messageInput.value.length;
        this.elements.charCount.textContent = count;
        
        // Visual feedback for character limit
        if (count > 3800) {
            this.elements.charCount.style.color = '#ef4444';
        } else if (count > 3500) {
            this.elements.charCount.style.color = '#f59e0b';
        } else {
            this.elements.charCount.style.color = 'var(--text-muted)';
        }
    }
    
    updateSendButtonState() {
        const hasText = this.elements.messageInput.value.trim().length > 0;
        this.elements.sendButton.disabled = !hasText || this.isTyping;
    }
    
    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Clear input and hide welcome screen
        this.elements.messageInput.value = '';
        this.updateCharCount();
        this.updateSendButtonState();
        this.autoResizeTextarea();
        this.hideWelcomeScreen();
        
        // Add user message to conversation
        const userMessage = {
            id: this.generateMessageId(),
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        
        this.conversationHistory.push(userMessage);
        this.renderMessage(userMessage);
        this.saveConversationHistory();
        
        // Show typing indicator and get AI response
        this.showTypingIndicator();
        await this.getAIResponse(message);
    }
    
    async getAIResponse(userMessage) {
        try {
            this.isTyping = true;
            this.updateSendButtonState();
            
            // Prepare conversation context for API
            const messages = this.conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 2048,
                    temperature: 0.7,
                    top_p: 0.9,
                    stream: false
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content;
            
            if (!aiResponse) {
                throw new Error('Empty response from AI model');
            }
            
            // Add AI response to conversation
            const assistantMessage = {
                id: this.generateMessageId(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            };
            
            this.conversationHistory.push(assistantMessage);
            this.hideTypingIndicator();
            this.renderMessage(assistantMessage);
            this.saveConversationHistory();
            
            // Automatically speak the response if TTS is enabled
            if (this.isSpeechEnabled) {
                this.speakText(aiResponse);
            }
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.showErrorToast(`Failed to get AI response: ${error.message}`);
        } finally {
            this.isTyping = false;
            this.updateSendButtonState();
        }
    }
    
    renderMessage(message) {
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        messageDiv.setAttribute('data-message-id', message.id);
        
        const avatarContent = message.role === 'user' 
            ? '<i class="fas fa-user"></i>'
            : `<img src="attached_assets/talkie gen_1756188921709.png" alt="Talkie Gen" width="24" height="24" style="border-radius: 50%; object-fit: cover;">`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatarContent}</div>
            <div class="message-content">
                <div class="message-text">${this.formatMessageContent(message.content)}</div>
                <div class="message-actions">
                    <button class="message-action copy-btn" onclick="talkieGen.copyMessage('${message.id}')" title="Copy message">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `;
        
        fragment.appendChild(messageDiv);
        this.elements.chatMessages.appendChild(fragment);
        this.scrollToBottom();
    }
    
    formatMessageContent(content) {
        // Basic markdown-like formatting
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return formatted;
    }
    
    copyMessage(messageId) {
        const message = this.conversationHistory.find(msg => msg.id === messageId);
        if (message) {
            navigator.clipboard.writeText(message.content).then(() => {
                this.showSuccessToast('Message copied to clipboard');
            }).catch(() => {
                this.showErrorToast('Failed to copy message');
            });
        }
    }
    
    showTypingIndicator() {
        this.elements.typingIndicator.classList.add('visible');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.elements.typingIndicator.classList.remove('visible');
    }
    
    showWelcomeScreen() {
        this.elements.welcomeScreen.classList.remove('hidden');
        this.elements.chatMessages.style.display = 'none';
    }
    
    hideWelcomeScreen() {
        this.elements.welcomeScreen.classList.add('hidden');
        this.elements.chatMessages.style.display = 'flex';
    }
    
    scrollToBottom() {
        if (this.scrollTimeout) return;
        this.scrollTimeout = requestAnimationFrame(() => {
            const chatWrapper = this.elements.chatMessages.parentElement;
            chatWrapper.scrollTop = chatWrapper.scrollHeight;
            this.scrollTimeout = null;
        });
    }
    
    clearConversation() {
        if (this.conversationHistory.length === 0) {
            this.showErrorToast('No conversation to clear');
            return;
        }
        
        if (confirm('Are you sure you want to clear the entire conversation? This action cannot be undone.')) {
            this.conversationHistory = [];
            this.elements.chatMessages.innerHTML = '';
            this.saveConversationHistory();
            this.showWelcomeScreen();
            this.showSuccessToast('Conversation cleared');
        }
    }
    
    exportConversation() {
        if (this.conversationHistory.length === 0) {
            this.showErrorToast('No conversation to export');
            return;
        }
        
        const exportData = {
            title: 'Talkie Gen Conversation',
            timestamp: new Date().toISOString(),
            messages: this.conversationHistory
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `talkie-gen-conversation-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessToast('Conversation exported successfully');
    }
    
    saveConversationHistory() {
        try {
            localStorage.setItem('talkie-gen-conversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Failed to save conversation:', error);
            this.showErrorToast('Failed to save conversation to local storage');
        }
    }
    
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('talkie-gen-conversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
            this.conversationHistory = [];
        }
    }
    
    renderConversationHistory() {
        this.elements.chatMessages.innerHTML = '';
        this.conversationHistory.forEach(message => {
            this.renderMessage(message);
        });
    }
    
    generateMessageId() {
        return `msg_${++this.messageIdCounter}_${Date.now()}`;
    }
    
    showErrorToast(message) {
        const messageEl = this.elements.errorToast.querySelector('.error-message');
        messageEl.textContent = message;
        this.elements.errorToast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideErrorToast();
        }, 5000);
    }
    
    hideErrorToast() {
        this.elements.errorToast.classList.remove('show');
    }
    
    showSuccessToast(message) {
        const messageEl = this.elements.successToast.querySelector('.success-message');
        messageEl.textContent = message;
        this.elements.successToast.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideSuccessToast();
        }, 3000);
    }
    
    hideSuccessToast() {
        this.elements.successToast.classList.remove('show');
    }
    
    hideLoadingOverlay() {
        setTimeout(() => {
            this.elements.loadingOverlay.classList.add('hidden');
        }, 1000);
    }
    
    // Voice Recognition Setup
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.elements.messageInput.value = transcript;
                this.updateCharCount();
                this.updateSendButtonState();
                this.autoResizeTextarea();
                this.showSuccessToast('Voice input captured successfully');
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showErrorToast(`Voice recognition error: ${event.error}`);
                this.stopVoiceInput();
            };
            
            this.recognition.onend = () => {
                this.stopVoiceInput();
            };
        } else {
            console.warn('Speech recognition not supported');
        }
    }
    
    // Text-to-Speech Setup
    setupTextToSpeech() {
        if ('speechSynthesis' in window) {
            // Load saved preference
            this.isSpeechEnabled = localStorage.getItem('talkie-gen-speech') === 'true';
            this.updateSpeechToggleUI();
        } else {
            console.warn('Speech synthesis not supported');
            this.elements.speakToggle.style.display = 'none';
        }
    }
    
    // Voice Input Methods
    toggleVoiceInput() {
        if (!this.recognition) {
            this.showErrorToast('Voice recognition not supported in this browser');
            return;
        }
        
        if (this.isListening) {
            this.stopVoiceInput();
        } else {
            this.startVoiceInput();
        }
    }
    
    startVoiceInput() {
        if (!this.recognition || this.isListening) return;
        
        try {
            this.isListening = true;
            this.elements.voiceButton.classList.add('listening');
            this.recognition.start();
            this.showSuccessToast('Listening... Speak now');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.showErrorToast('Could not start voice recognition');
            this.stopVoiceInput();
        }
    }
    
    stopVoiceInput() {
        if (!this.recognition || !this.isListening) return;
        
        this.isListening = false;
        this.elements.voiceButton.classList.remove('listening');
        this.recognition.stop();
    }
    
    // Text-to-Speech Methods
    toggleTextToSpeech() {
        this.isSpeechEnabled = !this.isSpeechEnabled;
        localStorage.setItem('talkie-gen-speech', this.isSpeechEnabled);
        this.updateSpeechToggleUI();
        
        if (this.isSpeechEnabled) {
            this.showSuccessToast('Text-to-speech enabled');
        } else {
            this.showSuccessToast('Text-to-speech disabled');
            this.stopSpeaking();
        }
    }
    
    updateSpeechToggleUI() {
        if (this.isSpeechEnabled) {
            this.elements.speakToggle.classList.add('active');
            this.elements.speakToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            this.elements.speakToggle.classList.remove('active');
            this.elements.speakToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }
    
    speakText(text) {
        if (!this.synthesis || !this.isSpeechEnabled) return;
        
        this.stopSpeaking();
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = 0.9;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 0.8;
        
        this.currentUtterance.onend = () => {
            this.currentUtterance = null;
        };
        
        this.synthesis.speak(this.currentUtterance);
    }
    
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.currentUtterance = null;
        }
    }
    
    // Additional Utility Methods
    clearMessageInput() {
        this.elements.messageInput.value = '';
        this.updateCharCount();
        this.updateSendButtonState();
        this.autoResizeTextarea();
        this.elements.messageInput.focus();
        this.showSuccessToast('Input cleared');
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.elements.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                this.showSuccessToast('Entered fullscreen mode');
            }).catch(() => {
                this.showErrorToast('Could not enter fullscreen mode');
            });
        } else {
            document.exitFullscreen().then(() => {
                this.elements.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                this.showSuccessToast('Exited fullscreen mode');
            }).catch(() => {
                this.showErrorToast('Could not exit fullscreen mode');
            });
        }
    }
    
    // Sample Prompts Feature
    showSamplePrompts() {
        const prompts = [
            "Explain quantum computing in simple terms",
            "Write a creative story about AI",
            "Help me plan a healthy meal",
            "Teach me a new skill",
            "Solve a math problem step by step",
            "Give me productivity tips"
        ];
        
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        this.elements.messageInput.value = randomPrompt;
        this.updateCharCount();
        this.updateSendButtonState();
        this.autoResizeTextarea();
        this.hideWelcomeScreen();
        this.elements.messageInput.focus();
        this.showSuccessToast('Sample prompt loaded!');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.talkieGen = new TalkieGen();
});

// Handle escape key to clear current input
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.talkieGen) {
        const messageInput = window.talkieGen.elements.messageInput;
        if (messageInput.value) {
            messageInput.value = '';
            window.talkieGen.updateCharCount();
            window.talkieGen.updateSendButtonState();
            window.talkieGen.autoResizeTextarea();
            window.talkieGen.showSuccessToast('Input cleared');
        }
    }
});