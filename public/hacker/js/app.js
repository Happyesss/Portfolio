/* ═══════════════════════════════════════════════════════
   APP.JS — Main Orchestrator
   Boot → Scene → Terminal → Guide → Effects
   ═══════════════════════════════════════════════════════ */

(async () => {
    'use strict';

    /* ── Matrix rain initialized but NOT started ── */
    Effects.initMatrix();

    /* ── Boot sequence ── */
    await Boot.run();

    /* ── 3D scene ── */
    Scene3D.init();

    /* ── Terminal ── */
    Terminal.init();

    /* ── Guide panel ── */
    Guide.init();
    Guide.show();

    // Collapse guide by default on mobile to save screen space
    if (window.innerWidth <= 480) {
        Guide.collapse();
    }

    /* ── Stats ticker ── */
    Effects.updateStats();

    /* ── Auto-focus terminal input (desktop only) ── */
    const termInput = document.getElementById('terminal-input');
    if (termInput) {
        // Only auto-focus on non-touch devices to avoid pulling up keyboard unexpectedly
        if (!('ontouchstart' in window)) {
            termInput.focus();
        }
        // Re-focus when window regains focus (desktop)
        window.addEventListener('focus', () => {
            if (!('ontouchstart' in window)) termInput.focus();
        });
        // Tap on terminal area focuses input on mobile
        document.getElementById('terminal-container').addEventListener('click', () => {
            termInput.focus();
        });
    }

    /* ── Block context menu for immersion ── */
    document.addEventListener('contextmenu', e => e.preventDefault());

    /* ── Konami code easter egg ── */
    const konamiCode = [
        'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
        'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
        'b','a'
    ];
    let konamiIdx = 0;
    document.addEventListener('keydown', e => {
        if (e.key === konamiCode[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === konamiCode.length) {
                konamiIdx = 0;
                Terminal.appendOutput(
                    '<br><span class="success-line">🎉 KONAMI CODE ACTIVATED! You found the easter egg!</span><br>'
                );
                Effects.triggerGlitch(null, 3000);
                Audio.hackSound();
            }
        } else {
            konamiIdx = 0;
        }
    });

    console.log('%c[SHADOW_ROOT] All systems online.', 'color:#00ff41;font-weight:bold;');
})();
