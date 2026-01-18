// Minecraft Server Website JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize server status
    updateServerStatus();
    
    // Update server status every 30 seconds
    setInterval(updateServerStatus, 30000);

    // Add scroll animation for sections
    observeElements();
});

// Copy Server IP to clipboard
function copyIP() {
    const ip = 'play.minecraftserver.com';
    
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ip).then(() => {
            showToast('Server IP copied to clipboard!');
        }).catch(err => {
            // Fallback for older browsers
            fallbackCopyIP(ip);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyIP(ip);
    }
}

// Fallback copy method for older browsers
function fallbackCopyIP(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Server IP copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy IP. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Show toast notification
function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Update server status (simulated - replace with actual API call)
async function updateServerStatus() {
    const onlinePlayersElement = document.getElementById('onlinePlayers');
    const serverStatusElement = document.getElementById('serverStatus');
    
    if (!onlinePlayersElement || !serverStatusElement) return;

    try {
        // Simulate server status check
        // In a real implementation, you would call a Minecraft server status API
        // For example: https://api.mcsrvstat.us/2/your-server-ip
        
        // Simulated values for demonstration
        const isOnline = true;
        const playerCount = Math.floor(Math.random() * 50) + 10; // Random number between 10-60
        const maxPlayers = 100;
        
        if (isOnline) {
            onlinePlayersElement.textContent = `${playerCount}/${maxPlayers}`;
            serverStatusElement.textContent = 'Online';
            serverStatusElement.style.color = 'var(--minecraft-green)';
        } else {
            onlinePlayersElement.textContent = '0/100';
            serverStatusElement.textContent = 'Offline';
            serverStatusElement.style.color = '#FF5555';
        }
        
        // Example of how to use a real API (commented out):
        /*
        const response = await fetch('https://api.mcsrvstat.us/2/play.minecraftserver.com');
        const data = await response.json();
        
        if (data.online) {
            onlinePlayersElement.textContent = `${data.players.online}/${data.players.max}`;
            serverStatusElement.textContent = 'Online';
            serverStatusElement.style.color = 'var(--minecraft-green)';
        } else {
            onlinePlayersElement.textContent = '0/0';
            serverStatusElement.textContent = 'Offline';
            serverStatusElement.style.color = '#FF5555';
        }
        */
    } catch (error) {
        console.error('Error fetching server status:', error);
        onlinePlayersElement.textContent = 'N/A';
        serverStatusElement.textContent = 'Unknown';
        serverStatusElement.style.color = 'var(--text-muted)';
    }
}

// Intersection Observer for scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all cards
    const cards = document.querySelectorAll('.feature-card, .rule-card, .staff-card, .vote-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Add animation to hero on load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const serverInfoBox = document.querySelector('.server-info-box');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.animation = 'fadeInDown 1s ease';
    }
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'fadeInUp 1s ease 0.2s both';
    }
    if (serverInfoBox) {
        serverInfoBox.style.animation = 'fadeInUp 1s ease 0.4s both';
    }
    if (heroButtons) {
        heroButtons.style.animation = 'fadeInUp 1s ease 0.6s both';
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Particle effect for hero background (optional enhancement)
function createParticles() {
    const particleCount = 50;
    const minecraftBlocks = document.querySelector('.minecraft-blocks');
    
    if (!minecraftBlocks) return;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.background = 'rgba(255, 170, 0, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        minecraftBlocks.appendChild(particle);
    }
}

// Add float animation for particles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles
createParticles();

// Add navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 46, 1)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
    }
});

// Console message
console.log('%c🎮 Minecraft Server Website', 'color: #FFAA00; font-size: 20px; font-weight: bold;');
console.log('%cJoin us at: play.minecraftserver.com', 'color: #00AA00; font-size: 14px;');
