/* ========================================
   Interactions — Handles player interaction
   with NPCs, signboards, portals, obstacles
   ======================================== */
class InteractionSystem {
    constructor(game) {
        this.game = game;
        this.activeNPC = null;
        this.dialogueIndex = 0;
        this.nearbyInteractable = null;
        this.nearbyNPC = null;
        this.nearbyPortal = null;
        this.typewriterText = '';
        this.typewriterTarget = '';
        this.typewriterIndex = 0;
        this.typewriterSpeed = 30; // ms per char
        this.typewriterTimer = 0;
        this.isDialogueActive = false;
        this.respawnPos = null;

        // Damage cooldown
        this.damageCooldown = 0;
        this.damageFlash = 0;

        // Cooldown to prevent auto-reopen after closing panel
        this.interactionCooldown = 0;
        this.lastInteractedObj = null;
    }

    update(dt) {
        const player = this.game.player;
        const world = this.game.world;

        // Damage cooldown
        if (this.damageCooldown > 0) this.damageCooldown -= dt;
        if (this.damageFlash > 0) this.damageFlash -= dt;

        // Interaction cooldown (prevents auto-reopen after closing)
        if (this.interactionCooldown > 0) this.interactionCooldown -= dt;

        // Check nearby interactables - show prompt instead of auto-interact
        this.nearbyInteractable = null;
        for (const obj of world.interactables) {
            if (Utils.dist(player.centerX, player.centerY, obj.x + obj.w / 2, obj.y + obj.h / 2) < 70) {
                this.nearbyInteractable = obj;
                break;
            }
        }

        // Check nearby NPCs - show prompt instead of auto-interact
        this.nearbyNPC = null;
        for (const npc of world.npcs) {
            if (Utils.dist(player.centerX, player.centerY, npc.x + npc.w / 2, npc.y + npc.h / 2) < 70) {
                this.nearbyNPC = npc;
                break;
            }
        }

        // Check nearby portals - show prompt instead of auto-enter
        this.nearbyPortal = null;
        for (const portal of world.portals) {
            if (Utils.dist(player.centerX, player.centerY, portal.x + portal.w / 2, portal.y + portal.h / 2) < 50) {
                this.nearbyPortal = portal;
                break;
            }
        }

        // Show/hide interact prompt
        const prompt = document.getElementById('interact-prompt');
        const hasNearby = this.nearbyInteractable || this.nearbyNPC || this.nearbyPortal;
        const panelOpen = !document.getElementById('info-panel').classList.contains('hidden');
        
        if (hasNearby && !panelOpen && !this.isDialogueActive) {
            prompt.classList.remove('hidden');
            // Update prompt text based on nearby object
            if (this.nearbyPortal) {
                prompt.innerHTML = '<span class="key">E</span> Enter Portal';
            } else if (this.nearbyNPC) {
                prompt.innerHTML = '<span class="key">E</span> Talk';
            } else {
                prompt.innerHTML = '<span class="key">E</span> Interact';
            }
        } else {
            prompt.classList.add('hidden');
        }

        // Reset lastInteractedObj if player moves away
        if (this.lastInteractedObj && this.nearbyInteractable !== this.lastInteractedObj) {
            this.lastInteractedObj = null;
            this.interactionCooldown = 0;
        }

        // Check obstacle collisions
        this.checkObstacles(dt);

        // Typewriter effect
        if (this.isDialogueActive && this.typewriterIndex < this.typewriterTarget.length) {
            this.typewriterTimer += dt * 1000;
            while (this.typewriterTimer >= this.typewriterSpeed && this.typewriterIndex < this.typewriterTarget.length) {
                this.typewriterTimer -= this.typewriterSpeed;
                this.typewriterIndex++;
                this.typewriterText = this.typewriterTarget.substring(0, this.typewriterIndex);
                document.getElementById('dialogue-text').textContent = this.typewriterText;
            }
        }

        // Wind push
        for (const obs of world.obstacles) {
            if (obs.type === 'wind') {
                const playerCol = player.collider;
                if (Utils.collides(playerCol, obs)) {
                    player.vx += obs.pushX * 0.1;
                    // Wind particles
                    if (Math.random() < 0.2) {
                        ParticleSystem.spawn(
                            player.centerX, player.centerY,
                            obs.pushX * 2, Utils.randFloat(-1, 1),
                            0.5, '#aabbff', 2
                        );
                    }
                }
            }
        }

        // Damage flash on player
        if (this.damageFlash > 0) {
            this.game.player.color = this.damageFlash % 0.1 > 0.05 ? '#ff2244' : '#000000';
        } else {
            this.game.player.color = '#000000';
        }
    }

    checkObstacles(dt) {
        const player = this.game.player;
        const world = this.game.world;

        for (const obs of world.obstacles) {
            if (obs.type === 'spikes' && obs.damage && this.damageCooldown <= 0) {
                const col = player.collider;
                if (Utils.collides(col, obs)) {
                    this.takeDamage();
                }
            }

            if (obs.type === 'laser' && obs.active && this.damageCooldown <= 0) {
                const laserBox = { x: obs.x - 5, y: obs.y, w: obs.w + 10, h: obs.h };
                if (Utils.collides(player.collider, laserBox)) {
                    this.takeDamage();
                }
            }
        }

        // Fall off world
        if (player.y > 700) {
            this.respawnPlayer();
        }
    }

    takeDamage() {
        this.damageCooldown = 1.5;
        this.damageFlash = 0.5;
        AudioSystem.play('hit');

        // Knockback
        this.game.player.vy = -8;
        this.game.player.vx = -this.game.player.facing * 5;

        // Damage particles
        for (let i = 0; i < 10; i++) {
            ParticleSystem.spawn(
                this.game.player.centerX,
                this.game.player.centerY,
                Utils.randFloat(-4, 4),
                Utils.randFloat(-4, 2),
                Utils.randFloat(0.3, 0.6),
                '#ff2244',
                Utils.randFloat(2, 5)
            );
        }
    }

    respawnPlayer() {
        const zone = this.game.world.zones[this.game.world.currentZone];
        const spawn = this.respawnPos || zone.playerSpawn;
        this.game.player.x = spawn.x;
        this.game.player.y = spawn.y;
        this.game.player.vx = 0;
        this.game.player.vy = 0;

        // Respawn effect
        for (let i = 0; i < 15; i++) {
            ParticleSystem.spawn(
                spawn.x + 15, spawn.y + 30,
                Utils.randFloat(-3, 3), Utils.randFloat(-3, 3),
                Utils.randFloat(0.4, 0.8),
                '#00f0ff', Utils.randFloat(2, 5)
            );
        }
    }

    // Called when E is pressed
    interact() {
        if (this.isDialogueActive) {
            this.advanceDialogue();
            return;
        }

        // Panel open? Close it
        if (!document.getElementById('info-panel').classList.contains('hidden')) {
            PanelSystem.close();
            this.game.player.interacting = false;
            // Set cooldown and remember what was interacted
            this.interactionCooldown = 0.5;
            this.lastInteractedObj = this.nearbyInteractable;
            return;
        }

        // Skip if on cooldown with same object
        if (this.interactionCooldown > 0 && this.lastInteractedObj === this.nearbyInteractable) {
            return;
        }

        // Interact with portal
        if (this.nearbyPortal) {
            this.enterPortal(this.nearbyPortal);
            return;
        }

        // Interact with NPC
        if (this.nearbyNPC) {
            this.startDialogue(this.nearbyNPC);
            return;
        }

        // Interact with signboard
        if (this.nearbyInteractable) {
            this.game.player.interacting = true;
            PanelSystem.open(this.nearbyInteractable.panelType);
            AudioSystem.play('interact');
            return;
        }
    }

    startDialogue(npc) {
        this.activeNPC = npc;
        this.dialogueIndex = 0;
        this.isDialogueActive = true;
        this.game.player.interacting = true;

        const box = document.getElementById('dialogue-box');
        document.getElementById('dialogue-name').textContent = npc.name;
        document.getElementById('dialogue-portrait').textContent = npc.portrait;
        box.classList.remove('hidden');

        this.showDialogueLine(npc.dialogues[0]);
        AudioSystem.play('interact');
    }

    advanceDialogue() {
        if (!this.activeNPC) return;

        // If typewriter not finished, skip to end
        if (this.typewriterIndex < this.typewriterTarget.length) {
            this.typewriterIndex = this.typewriterTarget.length;
            this.typewriterText = this.typewriterTarget;
            document.getElementById('dialogue-text').textContent = this.typewriterText;
            return;
        }

        this.dialogueIndex++;
        if (this.dialogueIndex >= this.activeNPC.dialogues.length) {
            this.endDialogue();
            return;
        }

        this.showDialogueLine(this.activeNPC.dialogues[this.dialogueIndex]);
    }

    showDialogueLine(text) {
        this.typewriterTarget = text;
        this.typewriterText = '';
        this.typewriterIndex = 0;
        this.typewriterTimer = 0;
        document.getElementById('dialogue-text').textContent = '';
    }

    endDialogue() {
        this.isDialogueActive = false;
        this.activeNPC = null;
        this.dialogueIndex = 0;
        this.game.player.interacting = false;
        document.getElementById('dialogue-box').classList.add('hidden');
    }

    enterPortal(portal) {
        AudioSystem.play('portal');
        this.game.transitionToZone(portal.targetZone, portal.spawnX, portal.spawnY);
    }
}
