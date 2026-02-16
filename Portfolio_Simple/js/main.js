/* ========================================
   Simple Portfolio — Interactive JavaScript
   Command Palette, Theme Toggle, Animations
   ======================================== */

// DOM Elements
const commandPalette = document.getElementById('command-palette');
const commandInput = document.getElementById('command-input');
const commandList = document.getElementById('command-list');
const commandItems = document.querySelectorAll('.command-item');
let activeCommandIndex = -1;

// ========================
// Command Palette
// ========================
function openCommandPalette() {
    commandPalette.classList.remove('hidden');
    commandInput.focus();
    commandInput.value = '';
    filterCommands('');
    activeCommandIndex = -1;
}

function closeCommandPalette() {
    commandPalette.classList.add('hidden');
    commandInput.value = '';
    activeCommandIndex = -1;
}

function filterCommands(query) {
    const items = commandList.querySelectorAll('.command-item');
    const groups = commandList.querySelectorAll('.command-group');
    
    items.forEach(item => {
        const text = item.querySelector('span:nth-child(2)').textContent.toLowerCase();
        const matches = text.includes(query.toLowerCase());
        item.style.display = matches ? 'flex' : 'none';
    });
    
    // Hide empty groups
    groups.forEach(group => {
        const visibleItems = group.querySelectorAll('.command-item[style="display: flex;"], .command-item:not([style])');
        const hasVisible = Array.from(visibleItems).some(item => item.style.display !== 'none');
        group.style.display = hasVisible ? 'block' : 'none';
    });
}

function navigateCommands(direction) {
    const visibleItems = Array.from(commandList.querySelectorAll('.command-item'))
        .filter(item => item.style.display !== 'none');
    
    if (visibleItems.length === 0) return;
    
    // Remove active class from current
    if (activeCommandIndex >= 0 && activeCommandIndex < visibleItems.length) {
        visibleItems[activeCommandIndex].classList.remove('active');
    }
    
    // Update index
    if (direction === 'down') {
        activeCommandIndex = (activeCommandIndex + 1) % visibleItems.length;
    } else {
        activeCommandIndex = activeCommandIndex <= 0 ? visibleItems.length - 1 : activeCommandIndex - 1;
    }
    
    // Add active class
    visibleItems[activeCommandIndex].classList.add('active');
    visibleItems[activeCommandIndex].scrollIntoView({ block: 'nearest' });
}

function executeCommand(item) {
    const section = item.dataset.section;
    const action = item.dataset.action;
    
    closeCommandPalette();
    
    if (section) {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    if (action) {
        switch (action) {
            case 'download-resume':
                downloadResume();
                break;
            case 'copy-email':
                copyEmail();
                break;
        }
    }
}

// ========================
// Actions (No theme toggle - dark mode only)
// ========================
function downloadResume() {
    showToast('Resume download started!');
    // In a real scenario, this would trigger a download
    // window.location.href = '/resume.pdf';
}

function copyEmail() {
    const email = '22csaiml002@jssaten.ac.in';
    navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy email');
    });
}

// ========================
// Toast Notifications
// ========================
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 5rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.75rem 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--accent-primary);
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--text-primary);
        z-index: 2000;
        animation: toastIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Add toast animations to document
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes toastOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(toastStyles);

// ========================
// Keyboard Shortcuts
// ========================
document.addEventListener('keydown', (e) => {
    // Open command palette with Cmd/Ctrl + J
    if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        if (commandPalette.classList.contains('hidden')) {
            openCommandPalette();
        } else {
            closeCommandPalette();
        }
        return;
    }
    
    // Close with Escape
    if (e.key === 'Escape' && !commandPalette.classList.contains('hidden')) {
        closeCommandPalette();
        return;
    }
    
    // Navigate command palette
    if (!commandPalette.classList.contains('hidden')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateCommands('down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateCommands('up');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const visibleItems = Array.from(commandList.querySelectorAll('.command-item'))
                .filter(item => item.style.display !== 'none');
            if (activeCommandIndex >= 0 && activeCommandIndex < visibleItems.length) {
                executeCommand(visibleItems[activeCommandIndex]);
            }
        }
        return;
    }
    
    // Quick navigation with number keys (when palette is closed)
    const sectionKeys = {
        '1': 'about',
        '2': 'experience',
        '3': 'skills',
        '4': 'projects',
        '5': 'contact'
    };
    
    if (sectionKeys[e.key] && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const section = document.getElementById(sectionKeys[e.key]);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Theme toggle with T
    if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        toggleTheme();
    }
});

// ========================
// Event Listeners
// ========================
// Command input
commandInput.addEventListener('input', (e) => {
    filterCommands(e.target.value);
    activeCommandIndex = -1;
});

// Command items click
commandItems.forEach(item => {
    item.addEventListener('click', () => executeCommand(item));
});

// Backdrop click
document.querySelector('.command-backdrop').addEventListener('click', closeCommandPalette);

// ========================
// Intersection Observer for Animations
// ========================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(section);
});

// ========================
// Smooth Scroll for Internal Links
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================
// Initialize (Dark theme only)
// ========================

// Add subtle parallax to background
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    document.querySelector('.bg-gradient').style.transform = `translate(${x}px, ${y}px)`;
});

console.log('%c👋 Hello, curious developer!', 'font-size: 24px; font-weight: bold; color: #10b981;');
console.log('%cFeel free to explore the code. Press Cmd+J to open the command palette!', 'font-size: 14px; color: #a1a1aa;');
