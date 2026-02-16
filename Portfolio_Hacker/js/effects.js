/* ═══════════════════════════════════════════════════════
   EFFECTS.JS — Matrix Rain, Glitch, Visual Effects
   ═══════════════════════════════════════════════════════ */

const Effects = (() => {
    let matrixCanvas, matrixCtx;
    let matrixColumns = [];
    let matrixAnimId = null;
    let matrixActive = false;

    const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\';
    const FONT_SIZE = 14;

    /* ═══════ MATRIX RAIN ═══════ */
    function initMatrix() {
        matrixCanvas = document.getElementById('matrix-rain');
        if (!matrixCanvas) return;
        matrixCtx = matrixCanvas.getContext('2d');
        resizeMatrix();
        window.addEventListener('resize', resizeMatrix);
        startMatrix();
    }

    function resizeMatrix() {
        if (!matrixCanvas) return;
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        const cols = Math.floor(matrixCanvas.width / FONT_SIZE);
        matrixColumns = Array(cols).fill(0).map(() => Math.random() * matrixCanvas.height / FONT_SIZE);
    }

    function drawMatrix() {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        matrixCtx.fillStyle = '#00ff41';
        matrixCtx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;

        for (let i = 0; i < matrixColumns.length; i++) {
            const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            const x = i * FONT_SIZE;
            const y = matrixColumns[i] * FONT_SIZE;

            // Vary brightness
            const brightness = Math.random();
            if (brightness > 0.95) {
                matrixCtx.fillStyle = '#ffffff';
            } else if (brightness > 0.8) {
                matrixCtx.fillStyle = '#39ff14';
            } else {
                matrixCtx.fillStyle = '#00ff41';
            }

            matrixCtx.fillText(char, x, y);

            if (y > matrixCanvas.height && Math.random() > 0.975) {
                matrixColumns[i] = 0;
            }
            matrixColumns[i]++;
        }

        matrixAnimId = requestAnimationFrame(drawMatrix);
    }

    function startMatrix() {
        if (matrixActive) return;
        matrixActive = true;
        drawMatrix();
    }

    function stopMatrix() {
        matrixActive = false;
        if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
    }

    /* ═══════ INTENSIFY MATRIX ═══════ */
    function matrixIntensify(duration = 3000) {
        document.body.classList.add('matrix-intense');
        if (matrixCanvas) matrixCanvas.style.opacity = '0.5';
        setTimeout(() => {
            document.body.classList.remove('matrix-intense');
            if (matrixCanvas) matrixCanvas.style.opacity = '0.15';
        }, duration);
    }

    /* ═══════ GLITCH EFFECT ═══════ */
    function triggerGlitch(element, duration = 2000) {
        if (!element) element = document.getElementById('terminal-container');
        if (!element) return;
        element.classList.add('glitch-active');
        setTimeout(() => element.classList.remove('glitch-active'), duration);
    }

    /* ═══════ SCREEN FLICKER ═══════ */
    function screenFlicker(element) {
        if (!element) element = document.getElementById('terminal-container');
        if (!element) return;
        element.classList.add('screen-flicker');
        setTimeout(() => element.classList.remove('screen-flicker'), 200);
    }

    /* ═══════ RANDOM STAT FLUCTUATION ═══════ */
    function updateStats() {
        const cpuBar = document.getElementById('cpu-bar');
        const cpuVal = document.getElementById('cpu-val');
        const memBar = document.getElementById('mem-bar');
        const memVal = document.getElementById('mem-val');
        const netBar = document.getElementById('net-bar');
        const netVal = document.getElementById('net-val');
        const clock  = document.getElementById('sys-clock');

        function fluctuate() {
            const cpu = Math.floor(20 + Math.random() * 60);
            const mem = Math.floor(40 + Math.random() * 40);
            const net = Math.floor(50 + Math.random() * 50);

            if (cpuBar) { cpuBar.style.width = cpu + '%'; cpuVal.textContent = cpu + '%'; }
            if (memBar) { memBar.style.width = mem + '%'; memVal.textContent = mem + '%'; }
            if (netBar) { netBar.style.width = net + '%'; netVal.textContent = net + '%'; }

            if (clock) {
                const now = new Date();
                clock.textContent = now.toLocaleTimeString('en-GB');
            }
        }

        fluctuate();
        setInterval(fluctuate, 2000);
        // Update clock every second
        setInterval(() => {
            if (clock) {
                const now = new Date();
                clock.textContent = now.toLocaleTimeString('en-GB');
            }
        }, 1000);
    }

    return {
        initMatrix,
        startMatrix,
        stopMatrix,
        matrixIntensify,
        triggerGlitch,
        screenFlicker,
        updateStats
    };
})();
