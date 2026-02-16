/* ========================================
   Scene — Mario-Inspired Daytime Renderer
   Bright, colorful 2D pixel-art style
   ======================================== */
class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this._clouds = null;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // ============================
    // Main Draw
    // ============================
    draw(world, player, camera, dt) {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;
        this.time += dt;
        ctx.clearRect(0, 0, W, H);

        const zone = world.zones[world.currentZone];
        const bg = zone.bg;

        // Sky gradient (bright daytime!)
        this.drawSky(ctx, W, H, bg);

        // Parallax layers
        this.drawParallax(ctx, world, camera, W, H);

        // Ambient particles
        this.drawAmbientParticles(ctx, world, camera);

        // Decorations (behind platforms)
        this.drawDecorations(ctx, world, camera);

        // Platforms
        this.drawPlatforms(ctx, world, camera);

        // Obstacles
        this.drawObstacles(ctx, world, camera);

        // Portals
        this.drawPortals(ctx, world, camera);

        // NPCs
        this.drawNPCs(ctx, world, camera);

        // Interactables
        this.drawInteractables(ctx, world, camera);

        // Player
        player.draw(ctx, camera);

        // Particles
        ParticleSystem.draw(ctx, camera);

        // Subtle vignette (lighter)
        this.drawVignette(ctx, W, H);
    }

    // ============================
    // SKY — Bright daytime gradient
    // ============================
    drawSky(ctx, W, H, bg) {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, bg.top || '#4fc3f7');
        grad.addColorStop(0.7, bg.bottom || '#81d4fa');
        grad.addColorStop(1, '#e8f5e9'); // green-ish horizon
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    // ============================
    // Parallax Backgrounds
    // ============================
    drawParallax(ctx, world, camera, W, H) {
        world.parallaxLayers.forEach(layer => {
            const offsetX = camera.x * layer.speed;
            const el = layer.elements;

            if (el.type === 'hills') {
                ctx.fillStyle = el.color;
                ctx.beginPath();
                ctx.moveTo(-50, H);
                el.points.forEach(p => {
                    ctx.lineTo(p.x - offsetX, p.y);
                });
                ctx.lineTo(W + 50, H);
                ctx.closePath();
                ctx.fill();
            }

            if (el.type === 'snow_mountains') {
                // Mountain body
                ctx.fillStyle = el.color;
                ctx.beginPath();
                ctx.moveTo(-50, H);
                el.points.forEach(p => {
                    ctx.lineTo(p.x - offsetX, p.y);
                });
                ctx.lineTo(W + 50, H);
                ctx.closePath();
                ctx.fill();

                // Snow caps
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.beginPath();
                el.points.forEach((p, i) => {
                    const sx = p.x - offsetX;
                    const sy = p.y;
                    if (i === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                });
                // close with a slightly lower line
                for (let i = el.points.length - 1; i >= 0; i--) {
                    ctx.lineTo(el.points[i].x - offsetX, el.points[i].y + 20);
                }
                ctx.closePath();
                ctx.fill();
            }

            if (el.type === 'buildings') {
                el.buildings.forEach(b => {
                    const sx = b.x - offsetX;
                    // Building body
                    ctx.fillStyle = el.color;
                    ctx.fillRect(sx, b.y - b.h, b.w, b.h);
                    // Windows
                    ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                    for (let wy = b.y - b.h + 12; wy < b.y - 12; wy += 22) {
                        for (let wx = sx + 10; wx < sx + b.w - 10; wx += 18) {
                            ctx.fillRect(wx, wy, 8, 10);
                        }
                    }
                });
            }

            if (el.type === 'mountains') {
                ctx.fillStyle = el.color;
                ctx.beginPath();
                ctx.moveTo(-50, H);
                el.points.forEach(p => {
                    ctx.lineTo(p.x - offsetX, p.y);
                });
                ctx.lineTo(W + 50, H);
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    // ============================
    // Ambient Particles (butterflies, pollen)
    // ============================
    drawAmbientParticles(ctx, world, camera) {
        world.ambientParticles.forEach(p => {
            const sx = p.x - camera.x;
            const sy = p.y - camera.y;
            const alpha = (p.life / p.maxLife) * 0.6;
            ctx.beginPath();
            ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color ? Utils.hexToRgba(p.color, alpha) : `rgba(255, 249, 196, ${alpha})`;
            ctx.fill();
        });
    }

    // ============================
    // Decorations
    // ============================
    drawDecorations(ctx, world, camera) {
        world.decorations.forEach(d => {
            const sx = d.x - camera.x;
            const sy = (d.y || 0) - camera.y;

            switch (d.type) {
                case 'mario_tree': this.drawMarioTree(ctx, sx, sy, d.size, d.trunkColor, d.leafColor); break;
                case 'tree': this.drawMarioTree(ctx, sx, sy, d.size, '#795548', d.color); break;
                case 'bush': this.drawBush(ctx, sx, sy, d.size, d.color); break;
                case 'flower': this.drawFlower(ctx, sx, sy, d.size, d.color); break;
                case 'cloud': this.drawCloud(ctx, sx + Math.sin(this.time * d.speed) * 20, sy, d.size); break;
                case 'sun': this.drawSun(ctx, d.x, sy, d.size); break;
                case 'bird': this.drawBird(ctx, sx, sy, d.speed, d.offset); break;
                case 'village_house': this.drawVillageHouse(ctx, sx, sy, d); break;
                case 'fence': this.drawFence(ctx, sx, sy); break;
                case 'question_block': this.drawQuestionBlock(ctx, sx, sy, d.size); break;
                case 'coin': this.drawCoin(ctx, sx, sy, d.floatOffset); break;
                case 'pipe': this.drawPipe(ctx, sx, sy, d.height, d.color); break;
                case 'underground': this.drawUnderground(ctx, sx, sy, d.w, d.h, d.color); break;
                case 'river': this.drawRiver(ctx, sx, sy, d.w, d.h); break;
                case 'house': this.drawVillageHouse(ctx, sx, sy, { w: d.w, h: d.h, roofColor: '#c0392b', wallColor: '#f5e6ca', windowColor: '#87ceeb', doorColor: '#8b4513', hasChimney: false }); break;
                case 'house_small': this.drawVillageHouse(ctx, sx, sy, { w: d.w, h: d.h, roofColor: '#2980b9', wallColor: '#ffeaa7', windowColor: '#87ceeb', doorColor: '#6d4c41', hasChimney: false }); break;
                case 'lamppost': this.drawLamppost(ctx, sx, sy, d.color); break;
                case 'code_fragment': this.drawCodeFragment(ctx, sx, sy, d.symbol, d.floatOffset); break;
                case 'skill_pillar': this.drawSkillPillar(ctx, sx, sy, d.label, d.height, d.color); break;
                case 'machine': this.drawMachine(ctx, sx, sy, d.variant, d.size); break;
                case 'conveyor': this.drawConveyor(ctx, sx, sy, d.width); break;
                case 'gear': this.drawGear(ctx, sx, sy, d.size, d.speed, d.color); break;
                case 'smokestack': this.drawSmokestack(ctx, sx, sy, d.height); break;
                case 'factory_building': this.drawFactoryBuilding(ctx, sx, sy, d); break;
                case 'timeline_post': this.drawTimelinePost(ctx, sx, sy, d.year, d.title, d.color); break;
                case 'bridge_tower': this.drawBridgeTower(ctx, sx, sy, d.height); break;
                case 'tower_top': this.drawTowerTop(ctx, sx, sy); break;
                case 'tower_body': this.drawTowerBody(ctx, sx, sy, d.height); break;
                case 'signal_dish': this.drawSignalDish(ctx, sx, sy); break;
                case 'signal_wave': this.drawSignalWave(ctx, d.x - camera.x, d.y - camera.y, d.radius, d.offset); break;
                case 'sparkle': this.drawSparkle(ctx, sx, sy, d.size, d.offset); break;
            }
        });
    }

    // ---- MARIO-STYLE DECORATION RENDERERS ----

    drawMarioTree(ctx, x, y, size, trunkColor, leafColor) {
        // Trunk — thick brown rectangle
        const tw = size * 0.2;
        const th = size * 0.5;
        ctx.fillStyle = trunkColor || '#795548';
        ctx.fillRect(x - tw / 2, y - th, tw, th);
        // Trunk highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x - tw / 2 + 2, y - th, tw * 0.3, th);

        // Canopy — stacked round circles (Mario style)
        ctx.fillStyle = leafColor || '#4caf50';
        const r = size * 0.35;
        ctx.beginPath(); ctx.arc(x, y - th - r * 0.3, r, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x - r * 0.6, y - th + r * 0.2, r * 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.6, y - th + r * 0.2, r * 0.8, 0, Math.PI * 2); ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath(); ctx.arc(x - r * 0.2, y - th - r * 0.5, r * 0.4, 0, Math.PI * 2); ctx.fill();
    }

    drawBush(ctx, x, y, size, color) {
        ctx.fillStyle = color || '#388e3c';
        const r = size;
        ctx.beginPath(); ctx.arc(x, y - r * 0.4, r * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x - r * 0.5, y - r * 0.2, r * 0.45, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.5, y - r * 0.2, r * 0.45, 0, Math.PI * 2); ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.arc(x, y - r * 0.55, r * 0.25, 0, Math.PI * 2); ctx.fill();
    }

    drawFlower(ctx, x, y, size, color) {
        // Stem
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - size * 2.5);
        ctx.stroke();
        // Petals
        ctx.fillStyle = color || '#f44336';
        const petalR = size;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + this.time * 0.5;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * petalR, y - size * 2.5 + Math.sin(angle) * petalR, petalR * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        // Center
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath(); ctx.arc(x, y - size * 2.5, petalR * 0.4, 0, Math.PI * 2); ctx.fill();
    }

    drawCloud(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        const r = size * 0.3;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x - r * 0.8, y + r * 0.2, r * 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.8, y + r * 0.2, r * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 1.4, y + r * 0.1, r * 0.55, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x - r * 1.3, y + r * 0.15, r * 0.5, 0, Math.PI * 2); ctx.fill();
        // Flat bottom
        ctx.fillRect(x - r * 1.5, y + r * 0.3, r * 3.2, r * 0.4);
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.4, 0, Math.PI * 2); ctx.fill();
    }

    drawSun(ctx, x, y, size) {
        // Glow
        const grad = ctx.createRadialGradient(x, y, size * 0.3, x, y, size * 1.5);
        grad.addColorStop(0, 'rgba(255, 235, 59, 0.6)');
        grad.addColorStop(0.5, 'rgba(255, 193, 7, 0.2)');
        grad.addColorStop(1, 'rgba(255, 193, 7, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x - size * 2, y - size * 2, size * 4, size * 4);

        // Sun body
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Rays
        ctx.strokeStyle = '#ffc107';
        ctx.lineWidth = 3;
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + this.time * 0.3;
            const r1 = size * 0.6;
            const r2 = size * 0.85 + Math.sin(this.time * 2 + i) * 4;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * r1, y + Math.sin(angle) * r1);
            ctx.lineTo(x + Math.cos(angle) * r2, y + Math.sin(angle) * r2);
            ctx.stroke();
        }

        // Face (cute Mario-style)
        ctx.fillStyle = '#f57f17';
        // Eyes
        ctx.beginPath(); ctx.arc(x - 8, y - 4, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 8, y - 4, 3, 0, Math.PI * 2); ctx.fill();
        // Smile
        ctx.strokeStyle = '#f57f17';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y + 2, 8, 0.1, Math.PI - 0.1);
        ctx.stroke();
    }

    drawBird(ctx, x, y, speed, offset) {
        const flap = Math.sin(this.time * 6 * speed + offset) * 8;
        const drift = Math.sin(this.time * speed + offset) * 30;
        const bx = x + drift;
        const by = y + Math.sin(this.time * 0.5 + offset) * 5;
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx - 8, by + flap * 0.5);
        ctx.quadraticCurveTo(bx - 4, by - Math.abs(flap), bx, by);
        ctx.quadraticCurveTo(bx + 4, by - Math.abs(flap), bx + 8, by + flap * 0.5);
        ctx.stroke();
    }

    drawVillageHouse(ctx, x, y, d) {
        const w = d.w, h = d.h;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x + 5, y - h + 25, w, h - 20);

        // Wall
        ctx.fillStyle = d.wallColor || '#f5e6ca';
        ctx.fillRect(x, y - h + 20, w, h - 20);
        // Wall border
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - h + 20, w, h - 20);

        // Roof (triangle)
        ctx.fillStyle = d.roofColor || '#c0392b';
        ctx.beginPath();
        ctx.moveTo(x - 8, y - h + 22);
        ctx.lineTo(x + w / 2, y - h - 15);
        ctx.lineTo(x + w + 8, y - h + 22);
        ctx.closePath();
        ctx.fill();
        // Roof outline
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 8, y - h + 22);
        ctx.lineTo(x + w / 2, y - h - 15);
        ctx.lineTo(x + w + 8, y - h + 22);
        ctx.closePath();
        ctx.stroke();

        // Chimney
        if (d.hasChimney) {
            ctx.fillStyle = '#8d6e63';
            ctx.fillRect(x + w * 0.7, y - h - 10, 14, 30);
            ctx.fillStyle = '#6d4c41';
            ctx.fillRect(x + w * 0.7 - 2, y - h - 12, 18, 6);
            // Smoke
            for (let s = 0; s < 3; s++) {
                const smokeY = y - h - 15 - s * 12 - (this.time * 10 % 12);
                const smokeX = x + w * 0.7 + 7 + Math.sin(this.time + s) * 5;
                ctx.fillStyle = `rgba(200,200,200,${0.3 - s * 0.08})`;
                ctx.beginPath();
                ctx.arc(smokeX, smokeY, 5 + s * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Windows (with shutters!)
        const winColor = d.windowColor || '#87ceeb';
        const winW = Math.min(18, w * 0.15);
        const winH = winW * 1.2;
        // Left window
        ctx.fillStyle = winColor;
        ctx.fillRect(x + w * 0.15, y - h + 35, winW, winH);
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + w * 0.15, y - h + 35, winW, winH);
        // Cross
        ctx.beginPath();
        ctx.moveTo(x + w * 0.15 + winW / 2, y - h + 35);
        ctx.lineTo(x + w * 0.15 + winW / 2, y - h + 35 + winH);
        ctx.moveTo(x + w * 0.15, y - h + 35 + winH / 2);
        ctx.lineTo(x + w * 0.15 + winW, y - h + 35 + winH / 2);
        ctx.stroke();

        // Right window
        ctx.fillStyle = winColor;
        ctx.fillRect(x + w * 0.65, y - h + 35, winW, winH);
        ctx.strokeRect(x + w * 0.65, y - h + 35, winW, winH);
        ctx.beginPath();
        ctx.moveTo(x + w * 0.65 + winW / 2, y - h + 35);
        ctx.lineTo(x + w * 0.65 + winW / 2, y - h + 35 + winH);
        ctx.moveTo(x + w * 0.65, y - h + 35 + winH / 2);
        ctx.lineTo(x + w * 0.65 + winW, y - h + 35 + winH / 2);
        ctx.stroke();

        // Door
        ctx.fillStyle = d.doorColor || '#8b4513';
        const doorW = Math.min(20, w * 0.18);
        const doorH = Math.min(30, h * 0.35);
        ctx.fillRect(x + w / 2 - doorW / 2, y - doorH, doorW, doorH);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + w / 2 - doorW / 2, y - doorH, doorW, doorH);
        // Doorknob
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath();
        ctx.arc(x + w / 2 + doorW / 4, y - doorH / 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFence(ctx, x, y) {
        ctx.fillStyle = '#d7ccc8';
        // Post
        ctx.fillRect(x, y - 30, 5, 30);
        ctx.fillRect(x + 20, y - 30, 5, 30);
        // Rails
        ctx.fillRect(x - 2, y - 25, 29, 4);
        ctx.fillRect(x - 2, y - 15, 29, 4);
        // Pointed tops
        ctx.beginPath();
        ctx.moveTo(x, y - 30); ctx.lineTo(x + 2.5, y - 36); ctx.lineTo(x + 5, y - 30);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + 20, y - 30); ctx.lineTo(x + 22.5, y - 36); ctx.lineTo(x + 25, y - 30);
        ctx.fill();
    }

    drawQuestionBlock(ctx, x, y, size) {
        const bob = Math.sin(this.time * 3) * 3;
        const bx = x - size / 2;
        const by = y - size + bob;

        // Block body
        ctx.fillStyle = '#ffc107';
        ctx.fillRect(bx, by, size, size);
        // Dark outline
        ctx.strokeStyle = '#e65100';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, size, size);
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(bx + 2, by + 2, size * 0.4, size * 0.4);
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(bx + size * 0.5, by + size * 0.5, size * 0.48, size * 0.48);
        // Question mark
        ctx.font = `bold ${size * 0.6}px "Press Start 2P", monospace`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('?', x, y - size * 0.25 + bob);
        ctx.textAlign = 'left';
    }

    drawCoin(ctx, x, y, offset) {
        const floatY = y + Math.sin(this.time * 3 + offset) * 6;
        const scaleX = Math.abs(Math.sin(this.time * 4 + offset));
        ctx.save();
        ctx.translate(x, floatY);
        ctx.scale(scaleX || 0.1, 1);
        // Coin body
        ctx.fillStyle = '#ffc107';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e65100';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Star
        ctx.fillStyle = '#ff8f00';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', 0, 3);
        ctx.textAlign = 'left';
        ctx.restore();
    }

    drawPipe(ctx, x, y, height, color) {
        const pipeColor = color || '#43a047';
        const w = 40;
        // Pipe body
        ctx.fillStyle = pipeColor;
        ctx.fillRect(x, y - height, w, height);
        // Pipe top (wider)
        ctx.fillStyle = pipeColor;
        ctx.fillRect(x - 5, y - height - 10, w + 10, 14);
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x + 5, y - height, 8, height);
        ctx.fillRect(x - 2, y - height - 10, 12, 14);
        // Dark side
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x + w - 10, y - height, 10, height);
        // Outline
        ctx.strokeStyle = '#2e7d32';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - height, w, height);
        ctx.strokeRect(x - 5, y - height - 10, w + 10, 14);
    }

    drawUnderground(ctx, x, y, w, h, color) {
        ctx.fillStyle = color || '#4a2c12';
        ctx.fillRect(x, y, w, h);
        // Dirt texture dots
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let dy = 0; dy < h; dy += 20) {
            for (let dx = 0; dx < w; dx += 25) {
                if (Math.random() > 0.5) {
                    ctx.beginPath();
                    ctx.arc(x + dx + 10, y + dy + 10, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    drawRiver(ctx, x, y, w, h) {
        // Water body
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(x, y, w, h);
        // Wave highlights
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let wx = 0; wx < w; wx += 40) {
            const wy = Math.sin(this.time * 2 + wx * 0.05) * 3;
            ctx.fillRect(x + wx, y + 5 + wy, 25, 3);
        }
        // Darker bottom
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x, y + h - 15, w, 15);
    }

    drawFactoryBuilding(ctx, x, y, d) {
        const w = d.w, h = d.h;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x + 5, y - h + 5, w, h);
        // Wall
        ctx.fillStyle = d.color || '#8d6e63';
        ctx.fillRect(x, y - h, w, h);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y - h, w, h);
        // Roof
        ctx.fillStyle = d.roofColor || '#6d4c41';
        ctx.fillRect(x - 5, y - h - 8, w + 10, 12);
        // Windows
        ctx.fillStyle = 'rgba(135,206,235,0.6)';
        for (let wy = y - h + 15; wy < y - 20; wy += 25) {
            for (let wx = x + 15; wx < x + w - 15; wx += 30) {
                ctx.fillRect(wx, wy, 16, 16);
                ctx.strokeStyle = '#5d4037';
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, 16, 16);
            }
        }
        // Door
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + w / 2 - 12, y - 35, 24, 35);
    }

    drawLamppost(ctx, x, y, color) {
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 60);
        ctx.stroke();
        // Lamp
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(x, y - 65, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCodeFragment(ctx, x, y, symbol, offset) {
        const floatY = y + Math.sin(this.time * 2 + offset) * 8;
        const alpha = 0.6 + Math.sin(this.time * 3 + offset) * 0.2;
        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`;
        ctx.shadowColor = '#4caf50';
        ctx.shadowBlur = 8;
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, floatY);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }

    drawSkillPillar(ctx, x, y, label, height, color) {
        // Pillar body
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x - 18, y - height, 36, height);
        ctx.globalAlpha = 1;
        // Top cap
        ctx.fillStyle = color;
        ctx.fillRect(x - 22, y - height - 4, 44, 8);
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(x - 14, y - height, 10, height);
        // Label
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(label, x, y - height - 12);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }

    drawMachine(ctx, x, y, variant, size) {
        const h = size, w = size * 0.8;
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(x - w / 2, y - h, w, h);
        ctx.strokeStyle = '#37474f';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - w / 2, y - h, w, h);
        // Screen
        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.fillRect(x - w / 2 + 8, y - h + 10, w - 16, h * 0.3);
        // Lights
        for (let i = 0; i < 3; i++) {
            const on = Math.sin(this.time * (2 + variant) + i) > 0;
            ctx.fillStyle = on ? '#4caf50' : '#263238';
            ctx.beginPath();
            ctx.arc(x - w / 2 + 15 + i * 14, y - h + h * 0.5, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawConveyor(ctx, x, y, width) {
        ctx.fillStyle = '#78909c';
        ctx.fillRect(x, y - 4, width, 8);
        const offset = (this.time * 40) % 20;
        ctx.strokeStyle = '#90a4ae';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(x + i + offset, y - 4);
            ctx.lineTo(x + i + offset + 10, y + 4);
            ctx.stroke();
        }
    }

    drawGear(ctx, x, y, size, speed, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.time * speed);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        const teeth = 8;
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            const r1 = size * 0.7, r2 = size;
            ctx.lineTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
            ctx.lineTo(Math.cos(angle + 0.15) * r2, Math.sin(angle + 0.15) * r2);
            ctx.lineTo(Math.cos(angle + 0.25) * r2, Math.sin(angle + 0.25) * r2);
            ctx.lineTo(Math.cos(angle + 0.4) * r1, Math.sin(angle + 0.4) * r1);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    drawSmokestack(ctx, x, y, height) {
        ctx.fillStyle = '#78909c';
        ctx.fillRect(x - 10, y, 20, height);
        ctx.fillStyle = '#90a4ae';
        ctx.fillRect(x - 14, y - 4, 28, 8);
        // Smoke puffs
        for (let i = 0; i < 4; i++) {
            const py = y - i * 20 - (this.time * 12) % 20;
            const px = x + Math.sin(this.time + i * 2) * 8;
            const sz = 8 + i * 5;
            ctx.fillStyle = `rgba(200, 200, 210, ${0.25 - i * 0.05})`;
            ctx.beginPath();
            ctx.arc(px, py, sz, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawTimelinePost(ctx, x, y, year, title, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y + 120);
        ctx.lineTo(x, y);
        ctx.stroke();
        // Flag
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 40, y + 10);
        ctx.lineTo(x, y + 20);
        ctx.closePath();
        ctx.fill();
        // Year
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(year, x, y - 10);
        ctx.font = '6px "Press Start 2P"';
        ctx.fillStyle = '#5d4037';
        ctx.fillText(title, x, y - 22);
        ctx.textAlign = 'left';
    }

    drawBridgeTower(ctx, x, y, height) {
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(x - 12, y, 24, height);
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(x - 22, y - 10, 44, 16);
        // Cables
        ctx.strokeStyle = 'rgba(141, 110, 99, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = -5; i <= 5; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + i * 50, y + height);
            ctx.stroke();
        }
    }

    drawTowerTop(ctx, x, y) {
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(x + 8, y - 30, 4, 30);
        // Blinking light
        const on = Math.sin(this.time * 4) > 0;
        ctx.fillStyle = on ? '#f44336' : '#b71c1c';
        ctx.beginPath();
        ctx.arc(x + 10, y - 35, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTowerBody(ctx, x, y, height) {
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < height; i += 20) {
            ctx.beginPath(); ctx.moveTo(x, y + i); ctx.lineTo(x + 60, y + i); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y + i); ctx.lineTo(x + 60, y + i + 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + 60, y + i); ctx.lineTo(x, y + i + 20); ctx.stroke();
        }
    }

    drawSignalDish(ctx, x, y) {
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, -0.5, 0.5);
        ctx.stroke();
        ctx.fillStyle = '#ffc107';
        ctx.beginPath();
        ctx.arc(x + 10, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSignalWave(ctx, x, y, radius, offset) {
        const alpha = 0.15 + Math.sin(this.time * 2 + offset) * 0.1;
        const r = radius + Math.sin(this.time + offset) * 10;
        ctx.strokeStyle = `rgba(255, 193, 7, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSparkle(ctx, x, y, size, offset) {
        const alpha = 0.4 + Math.sin(this.time * 3 + offset) * 0.3;
        const s = size + Math.sin(this.time * 2 + offset) * 1;
        ctx.fillStyle = `rgba(255, 235, 59, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================
    // Platforms — Mario-style brick, block, metal, ground
    // ============================
    drawPlatforms(ctx, world, camera) {
        world.platforms.forEach(p => {
            const sx = p.x - camera.x;
            const sy = p.y - camera.y;

            if (p.type === 'ground') {
                // Grass top layer
                ctx.fillStyle = p.topColor || '#4caf50';
                ctx.fillRect(sx, sy, p.w, 8);
                // Grass highlight
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(sx, sy, p.w, 3);
                // Dirt body
                ctx.fillStyle = p.color || '#6b4226';
                ctx.fillRect(sx, sy + 8, p.w, p.h - 8);
                // Dirt texture
                ctx.fillStyle = 'rgba(0,0,0,0.08)';
                for (let dx = 0; dx < p.w; dx += 30) {
                    for (let dy = 12; dy < p.h; dy += 18) {
                        ctx.beginPath();
                        ctx.arc(sx + dx + 15, sy + dy + 5, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                // Grass blades
                ctx.fillStyle = p.topColor || '#4caf50';
                for (let gx = sx; gx < sx + p.w; gx += 12) {
                    ctx.beginPath();
                    ctx.moveTo(gx, sy);
                    ctx.lineTo(gx + 3, sy - 5);
                    ctx.lineTo(gx + 6, sy);
                    ctx.fill();
                }

            } else if (p.type === 'brick') {
                // Mario brick block
                this.drawBrickPlatform(ctx, sx, sy, p.w, p.h, p.color);

            } else if (p.type === 'block') {
                // Solid block (staircase)
                this.drawBlockPlatform(ctx, sx, sy, p.w, p.h, p.color);

            } else if (p.type === 'metal') {
                // Metal industrial platform
                ctx.fillStyle = p.color || '#90a4ae';
                ctx.fillRect(sx, sy, p.w, p.h);
                ctx.strokeStyle = '#607d8b';
                ctx.lineWidth = 2;
                ctx.strokeRect(sx, sy, p.w, p.h);
                // Rivets
                ctx.fillStyle = '#546e7a';
                for (let rx = sx + 8; rx < sx + p.w - 4; rx += 20) {
                    ctx.beginPath(); ctx.arc(rx, sy + p.h / 2, 2, 0, Math.PI * 2); ctx.fill();
                }
                // Highlight
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillRect(sx, sy, p.w, 3);

            } else if (p.type === 'bridge_plank') {
                // Wooden bridge plank
                ctx.fillStyle = p.color || '#8d6e63';
                ctx.fillRect(sx, sy, p.w, p.h);
                // Wood grain
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 1;
                for (let px = sx + 10; px < sx + p.w; px += 14) {
                    ctx.beginPath(); ctx.moveTo(px, sy); ctx.lineTo(px, sy + p.h); ctx.stroke();
                }
                // Highlight
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(sx, sy, p.w, 3);
                // Nails
                ctx.fillStyle = '#5d4037';
                ctx.beginPath(); ctx.arc(sx + 5, sy + p.h / 2, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(sx + p.w - 5, sy + p.h / 2, 1.5, 0, Math.PI * 2); ctx.fill();

            } else if (p.type === 'bridge') {
                // Old-style bridge
                ctx.fillStyle = p.color || '#8d6e63';
                ctx.fillRect(sx, sy, p.w, p.h);
                ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                ctx.lineWidth = 1;
                for (let px = sx; px < sx + p.w; px += 12) {
                    ctx.beginPath(); ctx.moveTo(px, sy); ctx.lineTo(px, sy + p.h); ctx.stroke();
                }
            } else {
                // Default platform (clean)
                ctx.fillStyle = p.color || '#8d6e63';
                ctx.fillRect(sx, sy, p.w, p.h);
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(sx, sy, p.w, 3);
                ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                ctx.lineWidth = 1;
                ctx.strokeRect(sx, sy, p.w, p.h);
            }
        });
    }

    drawBrickPlatform(ctx, x, y, w, h, color) {
        ctx.fillStyle = color || '#c4722a';
        ctx.fillRect(x, y, w, h);
        // Brick lines
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        const brickW = 16;
        const brickH = h / 2;
        for (let row = 0; row < 2; row++) {
            const offsetX = row % 2 === 0 ? 0 : brickW / 2;
            for (let bx = 0; bx < w; bx += brickW) {
                ctx.strokeRect(x + bx + offsetX, y + row * brickH, brickW, brickH);
            }
        }
        // Top highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x, y, w, 2);
        // Bottom shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x, y + h - 2, w, 2);
    }

    drawBlockPlatform(ctx, x, y, w, h, color) {
        ctx.fillStyle = color || '#c4722a';
        ctx.fillRect(x, y, w, h);
        // Block grid
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        const blockSize = 16;
        for (let bx = 0; bx < w; bx += blockSize) {
            for (let by = 0; by < h; by += blockSize) {
                ctx.strokeRect(x + bx, y + by, blockSize, blockSize);
            }
        }
        // Top highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x, y, w, 3);
        // Side shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x + w - 3, y, 3, h);
    }

    // ============================
    // Obstacles
    // ============================
    drawObstacles(ctx, world, camera) {
        world.obstacles.forEach(obs => {
            const sx = obs.x - camera.x;
            const sy = obs.y - camera.y;

            switch (obs.type) {
                case 'spikes':
                    this.drawSpikes(ctx, sx, sy, obs.w, obs.h);
                    break;
                case 'moving_platform':
                    ctx.fillStyle = '#78909c';
                    ctx.fillRect(sx, sy, obs.w, obs.h);
                    ctx.fillStyle = 'rgba(255,255,255,0.2)';
                    ctx.fillRect(sx, sy, obs.w, 3);
                    ctx.strokeStyle = '#546e7a';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(sx, sy, obs.w, obs.h);
                    ctx.fillStyle = '#546e7a';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(obs.moveDir === 'x' ? '↔' : '↕', sx + obs.w / 2, sy - 5);
                    ctx.textAlign = 'left';
                    break;
                case 'laser':
                    if (obs.active) {
                        this.drawLaser(ctx, sx, sy, obs.w, obs.h);
                    } else {
                        ctx.strokeStyle = 'rgba(244, 67, 54, 0.15)';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        ctx.moveTo(sx + obs.w / 2, sy);
                        ctx.lineTo(sx + obs.w / 2, sy + obs.h);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    }
                    break;
                case 'wind':
                    this.drawWind(ctx, sx, sy, obs.w, obs.h, obs.pushX);
                    break;
                case 'falling_platform':
                    const shake = obs.fallTimer > 0 && !obs.isFalling ? Utils.randFloat(-2, 2) : 0;
                    ctx.fillStyle = obs.isFalling ? 'rgba(244, 67, 54, 0.5)' : '#a1887f';
                    ctx.fillRect(sx + shake, sy, obs.w, obs.h);
                    ctx.fillStyle = 'rgba(255,255,255,0.15)';
                    ctx.fillRect(sx + shake, sy, obs.w, 3);
                    if (obs.fallTimer > 0 && !obs.isFalling) {
                        ctx.strokeStyle = 'rgba(244, 67, 54, 0.6)';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(sx + shake, sy, obs.w, obs.h);
                    }
                    break;
            }
        });
    }

    drawSpikes(ctx, x, y, w, h) {
        // Red spikes with warning feel
        ctx.fillStyle = '#e53935';
        const count = Math.floor(w / 10);
        for (let i = 0; i < count; i++) {
            const sx = x + i * (w / count);
            ctx.beginPath();
            ctx.moveTo(sx, y + h);
            ctx.lineTo(sx + w / count / 2, y);
            ctx.lineTo(sx + w / count, y + h);
            ctx.closePath();
            ctx.fill();
        }
        // Outline
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 1;
        for (let i = 0; i < count; i++) {
            const sx = x + i * (w / count);
            ctx.beginPath();
            ctx.moveTo(sx, y + h);
            ctx.lineTo(sx + w / count / 2, y);
            ctx.lineTo(sx + w / count, y + h);
            ctx.closePath();
            ctx.stroke();
        }
    }

    drawLaser(ctx, x, y, w, h) {
        ctx.fillStyle = 'rgba(244, 67, 54, 0.7)';
        ctx.shadowColor = '#f44336';
        ctx.shadowBlur = 12;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(244, 67, 54, 0.15)';
        ctx.fillRect(x - 8, y, w + 16, h);
        ctx.shadowBlur = 0;
        // Emitters
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(x - 4, y - 4, w + 8, 8);
        ctx.fillRect(x - 4, y + h - 4, w + 8, 8);
    }

    drawWind(ctx, x, y, w, h, pushX) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        const dir = pushX > 0 ? 1 : -1;
        ctx.strokeStyle = '#90caf9';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 10; i++) {
            const lx = x + Utils.randFloat(0, w);
            const ly = y + Utils.randFloat(0, h);
            const len = 20 + Math.sin(this.time * 3 + i) * 10;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + dir * len, ly + Utils.randFloat(-3, 3));
            ctx.stroke();
        }
        ctx.restore();
    }

    // ============================
    // Portals — Bright swirl
    // ============================
    drawPortals(ctx, world, camera) {
        world.portals.forEach(p => {
            const sx = p.x - camera.x + p.w / 2;
            const sy = p.y - camera.y + p.h / 2;

            ctx.save();
            ctx.translate(sx, sy);

            // Glow
            const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 40);
            gradient.addColorStop(0, 'rgba(76, 175, 80, 0.7)');
            gradient.addColorStop(0.5, 'rgba(255, 193, 7, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(-45, -45, 90, 90);

            // Rings
            for (let i = 0; i < 3; i++) {
                const r = 15 + i * 8;
                const rotation = this.time * (2 - i * 0.5);
                ctx.strokeStyle = `rgba(76, 175, 80, ${0.5 - i * 0.12})`;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.ellipse(0, 0, r, r * 0.6, rotation, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Center spark
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#4caf50';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, 5 + Math.sin(this.time * 5) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Arrow
            ctx.font = '12px "Press Start 2P"';
            ctx.fillStyle = 'rgba(76, 175, 80, 0.7)';
            ctx.textAlign = 'center';
            ctx.fillText('→', 0, -38 + Math.sin(this.time * 3) * 3);
            ctx.textAlign = 'left';

            ctx.restore();
        });
    }

    // ============================
    // NPCs — Bright friendly characters
    // ============================
    drawNPCs(ctx, world, camera) {
        world.npcs.forEach(npc => {
            const sx = npc.x - camera.x + npc.w / 2;
            const sy = npc.y - camera.y;

            ctx.save();
            ctx.translate(sx, sy);

            const bob = Math.sin(this.time * 2) * 2;

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.ellipse(0, 60, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // NPC body glow
            ctx.shadowColor = '#ff9800';
            ctx.shadowBlur = 8;
            ctx.strokeStyle = '#ff9800';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            // Head
            ctx.beginPath();
            ctx.arc(0, 10 + bob, 9, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#ffe0b2';
            ctx.fill();

            // Body
            ctx.beginPath();
            ctx.moveTo(0, 20 + bob);
            ctx.lineTo(0, 40 + bob);
            ctx.stroke();

            // Arms
            ctx.beginPath();
            ctx.moveTo(0, 26 + bob);
            ctx.lineTo(-12, 32 + bob + Math.sin(this.time * 2) * 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 26 + bob);
            ctx.lineTo(12, 28 + bob - Math.sin(this.time * 3) * 6);
            ctx.stroke();

            // Legs
            ctx.beginPath();
            ctx.moveTo(0, 40 + bob);
            ctx.lineTo(-8, 58 + bob);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 40 + bob);
            ctx.lineTo(8, 58 + bob);
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Name tag with background
            ctx.fillStyle = 'rgba(255, 152, 0, 0.8)';
            const nameWidth = npc.name.length * 6 + 12;
            ctx.fillRect(-nameWidth / 2, -8 + bob, nameWidth, 14);
            ctx.font = '7px "Press Start 2P"';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, 0, 3 + bob);

            // Speech bubble
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(16, 2 + bob + Math.sin(this.time * 4) * 3, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#5d4037';
            ctx.font = '10px sans-serif';
            ctx.fillText('💬', 16, 6 + bob + Math.sin(this.time * 4) * 3);

            ctx.textAlign = 'left';
            ctx.restore();
        });
    }

    // ============================
    // Interactables — Clean sign posts
    // ============================
    drawInteractables(ctx, world, camera) {
        world.interactables.forEach(obj => {
            const sx = obj.x - camera.x + obj.w / 2;
            const sy = obj.y - camera.y;

            // Wooden post
            ctx.fillStyle = '#795548';
            ctx.fillRect(sx - 3, sy, 6, 50);

            // Sign board with warm colors
            const bw = 54, bh = 38;
            ctx.fillStyle = '#fff8e1';
            ctx.fillRect(sx - bw / 2, sy - bh, bw, bh);
            ctx.strokeStyle = '#8d6e63';
            ctx.lineWidth = 2;
            ctx.strokeRect(sx - bw / 2, sy - bh, bw, bh);

            // Icon
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.fillText(obj.icon, sx, sy - bh / 2 + 7);

            // Pulse border
            const pulse = Math.sin(this.time * 3) * 0.2 + 0.3;
            ctx.strokeStyle = `rgba(255, 193, 7, ${pulse})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(sx - bw / 2 - 3, sy - bh - 3, bw + 6, bh + 6);

            ctx.textAlign = 'left';
        });
    }

    // ============================
    // Vignette (very subtle for daytime)
    // ============================
    drawVignette(ctx, W, H) {
        const gradient = ctx.createRadialGradient(W / 2, H / 2, W * 0.4, W / 2, H / 2, W * 0.8);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
    }
}