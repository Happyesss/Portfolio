/* ========================================
   Landing Page — Interactive JavaScript
   Particles, Animations, and Interactions
   ======================================== */

// ========================
// Particle System
// ========================
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        const hue = Math.random() * 60 + 240; // Purple to cyan range
        
        particle.style.cssText = `
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background: hsl(${hue}, 70%, 60%);
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            box-shadow: 0 0 ${size * 2}px hsl(${hue}, 70%, 60%);
        `;
        
        container.appendChild(particle);
    }
}

// ========================
// Card Hover Effects
// ========================
function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ========================
// Smooth Scroll
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================
// Intersection Observer for Animations
// ========================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe cards
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Add visible class styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    .card.visible:hover {
        transform: translateY(-8px) !important;
    }
`;
document.head.appendChild(animationStyles);

// ========================
// Mouse Glow Effect
// ========================
function initMouseGlow() {
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glow);
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
}

// ========================
// Typing Effect for Terminal Preview
// ========================
function initTerminalTyping() {
    const terminalLines = document.querySelectorAll('.preview-terminal .terminal-line');
    // Animation is handled by CSS, but we could add more dynamic content here
}

// ========================
// Initialize Everything
// ========================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initCardEffects();
    initScrollAnimations();
    initMouseGlow();
    initTerminalTyping();
    
    console.log('%c🚀 Portfolio Collection', 'font-size: 24px; font-weight: bold; color: #8b5cf6;');
    console.log('%cExplore four unique portfolio experiences!', 'font-size: 14px; color: #a1a1aa;');
});

// ========================
// Preload Images for Smooth Transitions
// ========================
const preloadImages = [
    'Portfolio_Simple/index.html',
    'Portfolio_Game/index.html',
    'Portfolio_Forest/Index.html',
    'Portfolio_Hacker/Index.html'
];

// Add subtle animation on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
