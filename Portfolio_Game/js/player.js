/* ========================================
   Player — Stickman Character System
   Full animated stickman with walk, run,
   jump, crouch, idle animations
   ======================================== */
class Player {
    constructor(x, y) {
        // Position & size
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 60;

        // Physics
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.runSpeed = 6;
        this.jumpForce = -12;
        this.gravity = 0.6;
        this.friction = 0.85;
        this.grounded = false;

        // State
        this.state = 'idle'; // idle, walk, run, jump, fall, crouch, interact
        this.facing = 1; // 1 = right, -1 = left
        this.crouching = false;
        this.interacting = false;

        // Animation
        this.animTime = 0;
        this.walkCycle = 0;
        this.breathCycle = 0;
        this.blinkTimer = 0;
        this.isBlinking = false;
        this.landSquash = 0;
        this.jumpStretch = 0;

        // Stickman proportions
        this.headRadius = 8;
        this.bodyLength = 20;
        this.armLength = 16;
        this.legLength = 18;
        this.lineWidth = 3;

        // Colors
        this.color = '#000000';
        this.glowColor = 'rgba(0, 0, 0, 0.4)';
        this.eyeColor = '#ffffff';

        // Trail effect
        this.trail = [];
        this.maxTrail = 8;

        // Collision box offset (smaller than visual)
        this.colliderOffset = { x: 5, y: 0, w: -10, h: 0 };
    }

    get collider() {
        return {
            x: this.x + this.colliderOffset.x,
            y: this.y + this.colliderOffset.y,
            w: this.w + this.colliderOffset.w,
            h: this.crouching ? this.h * 0.6 : this.h + this.colliderOffset.h
        };
    }

    get centerX() { return this.x + this.w / 2; }
    get centerY() { return this.y + this.h / 2; }
    get feetY() { return this.y + this.h; }

    update(input, platforms, dt) {
        this.animTime += dt;
        this.breathCycle += dt * 2;
        this.walkCycle += dt * (this.state === 'run' ? 14 : 10);

        // Blink timer
        this.blinkTimer -= dt;
        if (this.blinkTimer <= 0) {
            this.isBlinking = !this.isBlinking;
            this.blinkTimer = this.isBlinking ? 0.1 : Utils.randFloat(2, 5);
        }

        // Squash/stretch recovery
        this.landSquash *= 0.85;
        this.jumpStretch *= 0.85;

        // Handle input
        let moveX = 0;
        this.crouching = false;

        if (!this.interacting) {
            if (input.left) moveX -= 1;
            if (input.right) moveX += 1;
            if (input.down && this.grounded) {
                this.crouching = true;
            }
            if (input.jump && this.grounded && !this.crouching) {
                this.vy = this.jumpForce;
                this.grounded = false;
                this.jumpStretch = 1;
                AudioSystem.play('jump');
                // Jump particles
                for (let i = 0; i < 6; i++) {
                    ParticleSystem.spawn(
                        this.centerX, this.feetY,
                        Utils.randFloat(-2, 2), Utils.randFloat(-3, -1),
                        Utils.randFloat(0.3, 0.6),
                        this.color, 3
                    );
                }
            }
        }

        // Apply movement
        const currentSpeed = input.shift ? this.runSpeed : this.speed;
        this.vx += moveX * currentSpeed * 0.3;
        this.vx *= this.friction;

        // Facing direction
        if (moveX !== 0) this.facing = moveX > 0 ? 1 : -1;

        // Apply gravity
        this.vy += this.gravity;
        this.vy = Utils.clamp(this.vy, -20, 20);

        // Move X
        this.x += this.vx;
        this.resolveCollisionX(platforms);

        // Move Y
        this.y += this.vy;
        this.grounded = false;
        this.resolveCollisionY(platforms);

        // Update state
        this.updateState(moveX);

        // Trail
        if (Math.abs(this.vx) > 1 || !this.grounded) {
            this.trail.push({ x: this.centerX, y: this.centerY, alpha: 0.5 });
            if (this.trail.length > this.maxTrail) this.trail.shift();
        }
        this.trail.forEach(t => t.alpha *= 0.9);
        this.trail = this.trail.filter(t => t.alpha > 0.02);

        // Walk particles
        if (this.grounded && Math.abs(this.vx) > 2 && Math.random() < 0.3) {
            ParticleSystem.spawn(
                this.centerX + Utils.randFloat(-5, 5),
                this.feetY,
                Utils.randFloat(-0.5, 0.5),
                Utils.randFloat(-1, -0.3),
                Utils.randFloat(0.2, 0.4),
                '#a1887f', 2
            );
        }
    }

    updateState(moveX) {
        if (this.interacting) {
            this.state = 'interact';
        } else if (this.crouching) {
            this.state = 'crouch';
        } else if (!this.grounded) {
            this.state = this.vy < 0 ? 'jump' : 'fall';
        } else if (Math.abs(this.vx) > 3) {
            this.state = 'run';
        } else if (Math.abs(this.vx) > 0.5) {
            this.state = 'walk';
        } else {
            this.state = 'idle';
        }
    }

    resolveCollisionX(platforms) {
        const col = this.collider;
        for (const p of platforms) {
            if (Utils.collides(col, p)) {
                if (this.vx > 0) {
                    this.x = p.x - this.w + this.colliderOffset.x - 0.1;
                } else if (this.vx < 0) {
                    this.x = p.x + p.w - this.colliderOffset.x + 0.1;
                }
                this.vx = 0;
            }
        }
    }

    resolveCollisionY(platforms) {
        const col = this.collider;
        for (const p of platforms) {
            if (Utils.collides(col, p)) {
                if (this.vy > 0) {
                    // Landing on top
                    this.y = p.y - this.h;
                    this.vy = 0;
                    if (!this.grounded) {
                        this.landSquash = 1;
                        // Land particles
                        for (let i = 0; i < 4; i++) {
                            ParticleSystem.spawn(
                                this.centerX + Utils.randFloat(-8, 8),
                                this.feetY,
                                Utils.randFloat(-2, 2),
                                Utils.randFloat(-2, -0.5),
                                Utils.randFloat(0.3, 0.5),
                                '#a1887f', 3
                            );
                        }
                    }
                    this.grounded = true;
                } else if (this.vy < 0) {
                    // Hitting head
                    this.y = p.y + p.h;
                    this.vy = 0;
                }
            }
        }
    }

    draw(ctx, camera) {
        const sx = this.centerX - camera.x;
        const sy = this.y - camera.y;

        // Draw trail
        this.trail.forEach(t => {
            ctx.beginPath();
            ctx.arc(t.x - camera.x, t.y - camera.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = Utils.hexToRgba('#8d6e63', t.alpha * 0.3);
            ctx.fill();
        });

        ctx.save();
        ctx.translate(sx, sy);

        // Squash & stretch
        const squashX = 1 + this.landSquash * 0.2 - this.jumpStretch * 0.1;
        const squashY = 1 - this.landSquash * 0.2 + this.jumpStretch * 0.15;
        ctx.scale(squashX * this.facing, squashY);
        if (this.facing === -1) ctx.scale(1, 1); // flip handled above

        // Clean stroke (no heavy glow for daytime look)
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 2;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const headY = this.headRadius + 2 + Math.sin(this.breathCycle) * 0.5;
        const bodyTopY = headY + this.headRadius + 2;
        const bodyBottomY = bodyTopY + this.bodyLength;
        const armY = bodyTopY + 4;

        // Compute animation offsets
        const walk = this.walkCycle;
        let armAngleL = 0, armAngleR = 0;
        let legAngleL = 0, legAngleR = 0;
        let bodyTilt = 0;

        switch (this.state) {
            case 'walk':
            case 'run': {
                const amp = this.state === 'run' ? 0.6 : 0.4;
                armAngleL = Math.sin(walk) * amp;
                armAngleR = Math.sin(walk + Math.PI) * amp;
                legAngleL = Math.sin(walk + Math.PI) * amp;
                legAngleR = Math.sin(walk) * amp;
                bodyTilt = Math.sin(walk) * 0.03;
                break;
            }
            case 'jump':
                armAngleL = -0.8;
                armAngleR = -0.8;
                legAngleL = 0.3;
                legAngleR = -0.3;
                break;
            case 'fall':
                armAngleL = 0.6;
                armAngleR = 0.6;
                legAngleL = -0.2;
                legAngleR = 0.2;
                break;
            case 'crouch': {
                armAngleL = 0.3;
                armAngleR = 0.3;
                legAngleL = 0.8;
                legAngleR = -0.8;
                break;
            }
            case 'interact': {
                armAngleR = -1.2;
                armAngleL = 0.2;
                break;
            }
            default: { // idle
                armAngleL = Math.sin(this.breathCycle * 0.5) * 0.1 + 0.15;
                armAngleR = Math.sin(this.breathCycle * 0.5 + 0.5) * 0.1 + 0.15;
                break;
            }
        }

        // Apply body tilt
        ctx.rotate(bodyTilt);

        // Crouch offset
        const crouchOffset = this.crouching ? 12 : 0;

        // === Draw Legs ===
        this.drawLimb(ctx, 0, bodyBottomY + crouchOffset, legAngleL + 0.1, this.legLength - crouchOffset * 0.4);
        this.drawLimb(ctx, 0, bodyBottomY + crouchOffset, legAngleR - 0.1, this.legLength - crouchOffset * 0.4);

        // === Draw Body ===
        ctx.beginPath();
        ctx.moveTo(0, bodyTopY + crouchOffset * 0.3);
        ctx.lineTo(0, bodyBottomY + crouchOffset);
        ctx.stroke();

        // === Draw Arms ===
        this.drawLimb(ctx, 0, armY + crouchOffset * 0.3, armAngleL + Math.PI * 0.05, this.armLength);
        this.drawLimb(ctx, 0, armY + crouchOffset * 0.3, armAngleR - Math.PI * 0.05, this.armLength);

        // === Draw Head ===
        const finalHeadY = headY + crouchOffset * 0.3;
        ctx.beginPath();
        ctx.arc(0, finalHeadY, this.headRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Face
        ctx.shadowBlur = 0;
        if (!this.isBlinking) {
            // Eyes
            ctx.fillStyle = this.eyeColor;
            const eyeX = 2.5;
            const eyeY = finalHeadY - 1;
            ctx.fillRect(eyeX - 1.5, eyeY - 1, 3, 2);
            // Dot pupil
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(eyeX - 0.5, eyeY - 0.5, 1.5, 1.5);
        } else {
            // Closed eyes (line)
            ctx.strokeStyle = this.eyeColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(1, finalHeadY - 1);
            ctx.lineTo(4, finalHeadY - 1);
            ctx.stroke();
        }

        // Small mouth
        ctx.strokeStyle = Utils.hexToRgba('#ffffff', 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(1, finalHeadY + 3);
        ctx.lineTo(3, finalHeadY + 3.5);
        ctx.stroke();

        ctx.restore();
    }

    drawLimb(ctx, ox, oy, angle, length) {
        const endX = ox + Math.sin(angle) * length;
        const endY = oy + Math.cos(angle) * length;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}
