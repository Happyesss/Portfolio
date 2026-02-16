/* ========================================
   Main — Game Entry Point & Loop
   Ties everything together: input, camera,
   game loop, state management
   ======================================== */
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.scene = new Scene(this.canvas);
        this.world = new World();
        this.player = null;
        this.interactions = null;
        this.hud = new HUDSystem();
        this.camera = { x: 0, y: 0 };
        this.cameraSmooth = 0.08;

        // Input state
        this.input = {
            left: false,
            right: false,
            jump: false,
            down: false,
            shift: false,
            interact: false
        };

        // Game state
        this.state = 'loading'; // loading, start, playing, paused, transition
        this.lastTime = 0;
        this.transitioning = false;

        this.init();
    }

    init() {
        // Resize
        this.scene.resize();
        window.addEventListener('resize', () => this.scene.resize());

        // Input
        this.setupInput();

        // UI Buttons
        this.setupUI();

        // Loading
        this.simulateLoading();
    }

    // ============================
    // Loading Screen
    // ============================
    simulateLoading() {
        const fill = document.querySelector('.loader-fill');
        const hint = document.querySelector('.loader-hint');
        const hints = [
            'Generating world...',
            'Spawning stickman...',
            'Placing obstacles...',
            'Loading portfolio...',
            'Compiling code...',
            'Almost ready...'
        ];

        let progress = 0;
        const interval = setInterval(() => {
            progress += Utils.randFloat(5, 15);
            if (progress > 100) progress = 100;
            fill.style.width = progress + '%';
            hint.textContent = hints[Math.floor((progress / 100) * (hints.length - 1))];

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    document.getElementById('loading-screen').classList.add('hidden');
                    document.getElementById('start-screen').classList.remove('hidden');
                    this.state = 'start';
                }, 500);
            }
        }, 200);
    }

    // ============================
    // Setup Input
    // ============================
    setupInput() {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.input.left = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.input.right = true;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                case 'Space':
                    this.input.jump = true;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.input.down = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.input.shift = true;
                    break;
                case 'KeyE':
                    if (this.state === 'playing') {
                        this.interactions.interact();
                    }
                    break;
                case 'Escape':
                    if (this.state === 'playing') {
                        this.pause();
                    } else if (this.state === 'paused') {
                        this.resume();
                    }
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.input.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.input.right = false;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                case 'Space':
                    this.input.jump = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.input.down = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.input.shift = false;
                    break;
            }
        });
    }

    // ============================
    // Setup UI Buttons
    // ============================
    setupUI() {
        // Start button
        document.getElementById('btn-start').addEventListener('click', () => {
            this.startGame();
        });

        // Panel close
        document.getElementById('panel-close').addEventListener('click', () => {
            PanelSystem.close();
            if (this.player) {
                this.player.interacting = false;
            }
            if (this.interactions) {
                this.interactions.interactionCooldown = 0.5;
                this.interactions.lastInteractedObj = this.interactions.nearbyInteractable;
            }
        });

        // Pause buttons
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.resume();
        });

        document.getElementById('btn-restart').addEventListener('click', () => {
            this.restart();
        });

        // Close panel on backdrop click
        document.querySelector('.panel-backdrop').addEventListener('click', () => {
            PanelSystem.close();
            if (this.player) this.player.interacting = false;
            if (this.interactions) {
                this.interactions.interactionCooldown = 0.5;
                this.interactions.lastInteractedObj = this.interactions.nearbyInteractable;
            }
        });
    }

    // ============================
    // Start Game
    // ============================
    startGame() {
        AudioSystem.init();
        AudioSystem.resume();
        AudioSystem.play('menu');

        document.getElementById('start-screen').classList.add('hidden');

        // Initialize player
        const zone = this.world.zones[this.world.currentZone];
        this.player = new Player(zone.playerSpawn.x, zone.playerSpawn.y);
        this.interactions = new InteractionSystem(this);

        // Show HUD
        this.hud.show();
        this.hud.updateZone(0);

        // Start game
        this.state = 'playing';
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // ============================
    // Game Loop
    // ============================
    gameLoop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        if (this.state === 'playing') {
            this.update(dt);
        }

        if (this.state === 'playing' || this.state === 'paused') {
            this.render(dt);
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // ============================
    // Update
    // ============================
    update(dt) {
        if (this.transitioning) return;

        // World update (moving obstacles, ambient particles)
        this.world.update(dt, this.player);

        // Player update
        const solidPlatforms = this.world.getSolidPlatforms();
        this.player.update(this.input, solidPlatforms, dt);

        // Interactions
        this.interactions.update(dt);

        // Particles
        ParticleSystem.update(dt);

        // Camera
        this.updateCamera(dt);

        // Clamp player to world bounds
        const zoneWidth = this.world.zones[this.world.currentZone].width || 3000;
        this.player.x = Utils.clamp(this.player.x, -50, zoneWidth - this.player.w + 50);
    }

    // ============================
    // Camera
    // ============================
    updateCamera(dt) {
        const targetX = this.player.centerX - this.canvas.width / 2;
        const targetY = this.player.centerY - this.canvas.height / 2 + 50;

        this.camera.x = Utils.lerp(this.camera.x, targetX, this.cameraSmooth);
        this.camera.y = Utils.lerp(this.camera.y, targetY, this.cameraSmooth);

        // Clamp camera
        const zoneWidth = this.world.zones[this.world.currentZone].width || 3000;
        this.camera.x = Utils.clamp(this.camera.x, -100, zoneWidth - this.canvas.width + 100);
        this.camera.y = Utils.clamp(this.camera.y, -200, 300);
    }

    // ============================
    // Render
    // ============================
    render(dt) {
        this.scene.draw(this.world, this.player, this.camera, dt);
    }

    // ============================
    // Zone Transition
    // ============================
    transitionToZone(zoneIndex, spawnX, spawnY) {
        if (this.transitioning) return;
        this.transitioning = true;

        const transition = document.getElementById('zone-transition');
        const info = this.world.getZoneInfo(zoneIndex);

        document.getElementById('transition-zone-name').textContent = info.name;
        document.getElementById('transition-zone-desc').textContent = info.desc;

        transition.classList.remove('hidden');
        // Force reflow
        void transition.offsetWidth;
        transition.classList.add('active');

        AudioSystem.play('portal');

        setTimeout(() => {
            // Load new zone
            this.world.loadZone(zoneIndex);
            this.player.x = spawnX;
            this.player.y = spawnY;
            this.player.vx = 0;
            this.player.vy = 0;
            this.camera.x = spawnX - this.canvas.width / 2;
            this.camera.y = spawnY - this.canvas.height / 2;

            // Update HUD
            this.hud.updateZone(zoneIndex);

            // Clear particles
            ParticleSystem.clear();

            // Clear stars cache so they regenerate for new zone
            this.scene._stars = null;

            // Set respawn
            this.interactions.respawnPos = { x: spawnX, y: spawnY };

            setTimeout(() => {
                transition.classList.remove('active');
                setTimeout(() => {
                    transition.classList.add('hidden');
                    this.transitioning = false;
                }, 600);
            }, 1000);
        }, 800);
    }

    // ============================
    // Pause / Resume / Restart
    // ============================
    pause() {
        this.state = 'paused';
        document.getElementById('pause-menu').classList.remove('hidden');
    }

    resume() {
        this.state = 'playing';
        document.getElementById('pause-menu').classList.add('hidden');
        this.lastTime = performance.now();
    }

    restart() {
        document.getElementById('pause-menu').classList.add('hidden');
        this.world = new World();
        const zone = this.world.zones[0];
        this.player.x = zone.playerSpawn.x;
        this.player.y = zone.playerSpawn.y;
        this.player.vx = 0;
        this.player.vy = 0;
        this.hud.updateZone(0);
        ParticleSystem.clear();
        this.scene._stars = null;
        this.interactions = new InteractionSystem(this);
        this.transitioning = false;
        this.state = 'playing';
        this.lastTime = performance.now();
    }
}

// ============================
// Bootstrap
// ============================
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
