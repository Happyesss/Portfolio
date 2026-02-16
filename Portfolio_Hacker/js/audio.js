/* ═══════════════════════════════════════════════════════
   AUDIO.JS — Sound Effects (Web Audio API)
   ═══════════════════════════════════════════════════════ */

const Audio = (() => {
    let ctx;
    let enabled = true;

    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return ctx;
    }

    function keyClick() {
        if (!enabled) return;
        try {
            const c = getCtx();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(800 + Math.random() * 400, c.currentTime);
            gain.gain.setValueAtTime(0.03, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.05);
        } catch (e) {}
    }

    function enterKey() {
        if (!enabled) return;
        try {
            const c = getCtx();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, c.currentTime);
            osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.08);
            gain.gain.setValueAtTime(0.04, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.1);
        } catch (e) {}
    }

    function error() {
        if (!enabled) return;
        try {
            const c = getCtx();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, c.currentTime);
            osc.frequency.linearRampToValueAtTime(100, c.currentTime + 0.2);
            gain.gain.setValueAtTime(0.05, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.2);
        } catch (e) {}
    }

    function bootBeep() {
        if (!enabled) return;
        try {
            const c = getCtx();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, c.currentTime);
            gain.gain.setValueAtTime(0.06, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.3);
        } catch (e) {}
    }

    function hackSound() {
        if (!enabled) return;
        try {
            const c = getCtx();
            for (let i = 0; i < 5; i++) {
                const osc = c.createOscillator();
                const gain = c.createGain();
                osc.connect(gain);
                gain.connect(c.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(200 + Math.random() * 1000, c.currentTime + i * 0.1);
                gain.gain.setValueAtTime(0.02, c.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.1 + 0.08);
                osc.start(c.currentTime + i * 0.1);
                osc.stop(c.currentTime + i * 0.1 + 0.08);
            }
        } catch (e) {}
    }

    function toggle() {
        enabled = !enabled;
        return enabled;
    }

    return { keyClick, enterKey, error, bootBeep, hackSound, toggle };
})();
