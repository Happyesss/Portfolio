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

    /* ── Stats ticker ── */
    Effects.updateStats();

    /* ── Auto-focus terminal input ── */
    const termInput = document.getElementById('terminal-input');
    if (termInput) {
        termInput.focus();
        // Re-focus when window regains focus
        window.addEventListener('focus', () => termInput.focus());
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
