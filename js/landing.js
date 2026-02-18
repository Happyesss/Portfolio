/* ========================================
   Landing Page — Interactive JavaScript
   Premium Particles, Animations, and Effects
   ======================================== */

// ========================
// Particle System — Enhanced
// ========================
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 15 + 15;
        const hue = Math.random() * 80 + 220; // Purple to cyan range
        
        particle.style.cssText = `
            left: ${x}%;
            width: ${size}px;
            height: ${size}px;
            background: hsl(${hue}, 80%, 65%);
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            box-shadow: 0 0 ${size * 3}px hsl(${hue}, 80%, 55%);
        `;
        
        container.appendChild(particle);
    }
}

// ========================
// Card 3D Tilt Effect — Premium
// ========================
function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        let bounds;
        
        const rotateCard = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            
            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            };
            
            const distance = Math.sqrt(center.x**2 + center.y**2);
            
            card.style.transform = `
                perspective(1200px)
                rotateX(${-center.y / 15}deg)
                rotateY(${center.x / 15}deg)
                translateY(-16px)
                scale3d(1.02, 1.02, 1.02)
            `;
            
            // Update gradient position for shine effect
            card.style.setProperty('--mouse-x', `${leftX}px`);
            card.style.setProperty('--mouse-y', `${topY}px`);
        };
        
        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            card.addEventListener('mousemove', rotateCard);
        });
        
        card.addEventListener('mouseleave', () => {
            card.removeEventListener('mousemove', rotateCard);
            card.style.transform = '';
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
// Intersection Observer for Staggered Animations
// ========================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards with staggered delay
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) rotateX(10deg)';
        card.style.transition = `opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.15}s, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Observe hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(heroTitle);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        heroSubtitle.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        observer.observe(heroSubtitle);
    }
}

// Add visible class styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .card.visible,
    .hero-title.visible,
    .hero-subtitle.visible {
        opacity: 1 !important;
        transform: translateY(0) rotateX(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// ========================
// Mouse Glow Effect — Follows cursor
// ========================
function initMouseGlow() {
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    glow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        transform: translate(-50%, -50%);
        transition: opacity 0.4s ease, transform 0.1s ease;
        opacity: 0;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    
    // Smooth follow animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// ========================
// Card Shine Effect on Hover
// ========================
function initCardShine() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        shine.style.cssText = `
            position: absolute;
            inset: 0;
            background: radial-gradient(
                circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(255, 255, 255, 0.06) 0%,
                transparent 50%
            );
            pointer-events: none;
            z-index: 4;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        card.style.position = 'relative';
        card.appendChild(shine);
        
        card.addEventListener('mouseenter', () => {
            shine.style.opacity = '1';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            shine.style.background = `radial-gradient(
                600px circle at ${x}px ${y}px,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 50%
            )`;
        });
        
        card.addEventListener('mouseleave', () => {
            shine.style.opacity = '0';
        });
    });
}

// ========================
// Magnetic Button Effect
// ========================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-view');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ========================
// Initialize Everything
// ========================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initCardEffects();
    initScrollAnimations();
    initMouseGlow();
    initCardShine();
    initMagneticButtons();
    
    console.log('%c🚀 Portfolio Collection', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cDesigned with ❤️ — Explore four unique experiences!', 'font-size: 14px; color: #a1a1aa;');
});

// ========================
// Smooth Page Load Animation
// ========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
