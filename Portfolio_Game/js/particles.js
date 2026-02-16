/* ========================================
   Particle System — Visual Effects
   Handles all particle effects: jump dust,
   landing, damage, portal sparkles, etc.
   ======================================== */
const ParticleSystem = {
    particles: [],
    maxParticles: 300,

    spawn(x, y, vx, vy, life, color, size) {
        if (this.particles.length >= this.maxParticles) return;
        this.particles.push({
            x, y, vx, vy,
            life,
            maxLife: life,
            color,
            size,
            gravity: 0.1
        });
    },

    // Burst effect — many particles at once
    burst(x, y, count, color, spread, speed) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            this.spawn(
                x, y,
                Math.cos(angle) * speed + Utils.randFloat(-spread, spread),
                Math.sin(angle) * speed + Utils.randFloat(-spread, spread),
                Utils.randFloat(0.3, 0.8),
                color,
                Utils.randFloat(2, 5)
            );
        }
    },

    // Trail effect
    trail(x, y, color) {
        this.spawn(
            x + Utils.randFloat(-3, 3),
            y + Utils.randFloat(-3, 3),
            Utils.randFloat(-0.5, 0.5),
            Utils.randFloat(-1, 0),
            Utils.randFloat(0.2, 0.5),
            color,
            Utils.randFloat(1, 3)
        );
    },

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.life -= dt;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw(ctx, camera) {
        this.particles.forEach(p => {
            const sx = p.x - camera.x;
            const sy = p.y - camera.y;
            const alpha = Math.max(0, p.life / p.maxLife);
            const size = p.size * alpha;

            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fillStyle = Utils.hexToRgba(
                p.color.startsWith('#') ? p.color : '#ffffff',
                alpha
            );
            ctx.fill();
        });
    },

    clear() {
        this.particles = [];
    }
};
