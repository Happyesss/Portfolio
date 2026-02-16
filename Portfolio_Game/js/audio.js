/* ========================================
   Audio System — Sound Effects via Web Audio API
   Generates sounds procedurally (no external files)
   ======================================== */
const AudioSystem = {
    ctx: null,
    enabled: true,
    volume: 0.3,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    play(type) {
        if (!this.enabled || !this.ctx) return;

        switch (type) {
            case 'jump':
                this.playTone(400, 600, 0.1, 'sine', 0.15);
                break;
            case 'land':
                this.playNoise(0.05, 0.1);
                break;
            case 'hit':
                this.playTone(200, 100, 0.2, 'sawtooth', 0.2);
                break;
            case 'interact':
                this.playTone(500, 800, 0.1, 'sine', 0.1);
                setTimeout(() => this.playTone(700, 1000, 0.1, 'sine', 0.08), 80);
                break;
            case 'portal':
                this.playTone(300, 900, 0.4, 'sine', 0.15);
                this.playTone(400, 1200, 0.4, 'sine', 0.1);
                break;
            case 'step':
                this.playNoise(0.02, 0.05);
                break;
            case 'menu':
                this.playTone(600, 800, 0.05, 'sine', 0.1);
                break;
        }
    },

    playTone(startFreq, endFreq, duration, type, vol) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(endFreq, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime((vol || 0.1) * this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playNoise(duration, vol) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }

        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime((vol || 0.05) * this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    }
};
