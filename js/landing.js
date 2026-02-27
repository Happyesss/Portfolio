/* ========================================
   Setflix Landing Page — Netflix Clone
   TUDUM Animation & Profile Selection
   ======================================== */

// ========================
// Netflix TUDUM Sound — plays assets/tudum.mp3
// ========================
class TudumSound {
    constructor() {
        this.audio = new Audio('assets/tudum.mp3');
        this.audio.volume = 1.0;
        // Pre-load so it's ready instantly
        this.audio.load();
    }

    init() {
        // Nothing to init — Audio element is ready
        return true;
    }

    play() {
        this.audio.currentTime = 0;
        return this.audio.play().catch(() => {
            // Browser blocked autoplay — will retry on first interaction
        });
    }
}

// ========================
// Intro Animation Controller
// ========================
class SetflixIntro {
    constructor() {
        this.overlay = document.getElementById('introOverlay');
        this.mainContent = document.getElementById('mainContent');
        this.tudumSound = new TudumSound();
        this.hasPlayed = sessionStorage.getItem('setflixIntroPlayed');
        this.skipButton = null;
        this.soundInitialized = false;
    }

    init() {
        // NOTE: we used to skip the intro when sessionStorage indicated it
        // had played, but that made development/testing confusing and
        // sometimes resulted in the page popping in "without the sound"
        // (the browser blocked audio and the overlay was removed instantly).
        // Always show the animation for now; users can clear storage if
        // they really want to bypass it.
        // if (this.hasPlayed) {
        //     this.skipIntro();
        //     return;
        // }

        this.createSkipButton();

        // Try autoplay immediately — succeeds if the browser permits it
        // (e.g. user has interacted with the origin before)
        const playPromise = this.tudumSound.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked — wait for the first tap/click then play
                const onInteraction = () => {
                    this.tudumSound.play();
                };
                document.addEventListener('pointerdown', onInteraction, { once: true });
                document.addEventListener('keydown',     onInteraction, { once: true });
            });
        }

        // End intro after exactly 3 seconds
        setTimeout(() => {
            this.endIntro();
        }, 3000);
    }

    createSkipButton() {
        this.skipButton = document.createElement('button');
        this.skipButton.className = 'skip-intro';
        this.skipButton.innerHTML = 'Skip Intro';
        this.skipButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.skipIntro();
        });
        document.body.appendChild(this.skipButton);
    }

    skipIntro() {
        if (this.overlay) {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.overlay.classList.add('hidden');
            }, 500);
        }
        if (this.mainContent) {
            this.mainContent.classList.add('visible');
        }
        if (this.skipButton) {
            this.skipButton.remove();
        }
        sessionStorage.setItem('setflixIntroPlayed', 'true');
    }

    endIntro() {
        if (this.overlay) {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.overlay.classList.add('hidden');
            }, 1000);
        }
        if (this.mainContent) {
            setTimeout(() => {
                this.mainContent.classList.add('visible');
            }, 500);
        }
        if (this.skipButton) {
            this.skipButton.style.opacity = '0';
            setTimeout(() => {
                if (this.skipButton && this.skipButton.parentNode) {
                    this.skipButton.remove();
                }
            }, 300);
        }
        sessionStorage.setItem('setflixIntroPlayed', 'true');
    }
}

// ========================
// Profile Manager - Fixed hover issues
// ========================
class ProfileManager {
    constructor() {
        this.profiles = document.querySelectorAll('.profile:not(.add-profile)');
        this.addProfileEl = document.getElementById('addProfile');
        this.manageBtn = document.getElementById('manageBtn');
        this.isManageMode = false;
    }

    init() {
        this.initProfileClicks();
        this.initManageMode();
        this.initAddProfile();
    }

    initProfileClicks() {
        this.profiles.forEach(profile => {
            profile.addEventListener('click', (e) => {
                if (this.isManageMode) {
                    e.preventDefault();
                    const name = profile.querySelector('.profile-name').textContent;
                    this.showToast(`Edit profile: ${name}`);
                    return;
                }

                // Navigate with transition
                e.preventDefault();
                const href = profile.getAttribute('href');
                
                // Create transition overlay
                const transition = document.createElement('div');
                transition.className = 'page-transition';
                document.body.appendChild(transition);
                
                // Force reflow
                transition.offsetHeight;
                
                setTimeout(() => {
                    transition.classList.add('active');
                }, 10);

                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        });
    }

    initManageMode() {
        if (!this.manageBtn) return;

        this.manageBtn.addEventListener('click', () => {
            this.isManageMode = !this.isManageMode;
            
            if (this.isManageMode) {
                this.manageBtn.textContent = 'Done';
                this.manageBtn.style.background = 'var(--netflix-red, #E50914)';
                this.manageBtn.style.borderColor = 'var(--netflix-red, #E50914)';
                this.manageBtn.style.color = 'white';
                
                this.profiles.forEach(profile => {
                    profile.classList.add('edit-mode');
                });
            } else {
                this.manageBtn.textContent = 'Manage Profiles';
                this.manageBtn.style.background = '';
                this.manageBtn.style.borderColor = '';
                this.manageBtn.style.color = '';
                
                this.profiles.forEach(profile => {
                    profile.classList.remove('edit-mode');
                });
            }
        });
    }

    initAddProfile() {
        if (!this.addProfileEl) return;

        this.addProfileEl.addEventListener('click', () => {
            this.showToast('New portfolio themes coming soon! 🚀');
        });
    }

    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast-message');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 16px 24px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            animation: toastIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========================
// Keyboard Navigation
// ========================
function initKeyboardNav() {
    const profiles = document.querySelectorAll('.profile');
    let currentIndex = -1;

    profiles.forEach((profile, index) => {
        profile.setAttribute('tabindex', '0');
        
        profile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                profile.click();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (!document.querySelector('.main-content.visible')) return;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, profiles.length - 1);
            profiles[currentIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            profiles[currentIndex].focus();
        }
    });
}

// ========================
// Initialize on DOM Ready
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // Start intro
    const intro = new SetflixIntro();
    intro.init();

    // Initialize profiles
    const profileManager = new ProfileManager();
    profileManager.init();

    // Keyboard navigation
    initKeyboardNav();

    // Console branding
    console.log('%c SETFLIX ', 'font-size: 24px; font-weight: bold; color: #E50914; background: #000; padding: 8px 16px; border-radius: 4px;');
    console.log('%c Who\'s watching? ', 'font-size: 12px; color: #808080;');
});

