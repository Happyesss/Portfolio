/* ========================================
   World — Level Builder & Zone System
   Mario-Inspired Daytime Adventure World
   5 Zones with bright, grounded visuals
   ======================================== */
class World {
    constructor() {
        this.zones = [];
        this.currentZone = 0;
        this.platforms = [];
        this.decorations = [];
        this.interactables = [];
        this.obstacles = [];
        this.npcs = [];
        this.portals = [];
        this.parallaxLayers = [];
        this.ambientParticles = [];
        this.time = 0;
        this.buildZones();
    }

    buildZones() {
        this.zones = [
            this.buildSpawnVillage(),
            this.buildSkillMountains(),
            this.buildProjectFactory(),
            this.buildExperienceBridge(),
            this.buildContactTower()
        ];
        this.loadZone(0);
    }

    loadZone(index) {
        this.currentZone = index;
        const zone = this.zones[index];
        this.platforms = zone.platforms;
        this.decorations = zone.decorations;
        this.interactables = zone.interactables;
        this.obstacles = zone.obstacles || [];
        this.npcs = zone.npcs || [];
        this.portals = zone.portals || [];
        this.parallaxLayers = zone.parallax || [];
        this.ambientParticles = [];
        return zone;
    }

    getZoneInfo(index) {
        const infos = [
            { name: 'Spawn Village', icon: '🏠', desc: 'A peaceful village where your journey begins...', color: '#2d8a4e' },
            { name: 'Skill Mountains', icon: '⛰️', desc: 'Climb the peaks of knowledge...', color: '#4a90d9' },
            { name: 'Project Factory', icon: '🏭', desc: 'Where ideas become reality...', color: '#d4760a' },
            { name: 'Experience Bridge', icon: '🌉', desc: 'Crossing the timeline of growth...', color: '#c44dbb' },
            { name: 'Contact Tower', icon: '🗼', desc: 'Reach out to the creator...', color: '#d4a017' }
        ];
        return infos[index] || infos[0];
    }

    // ============================
    // ZONE 0: Spawn Village — Bright sunny Mario village
    // ============================
    buildSpawnVillage() {
        const platforms = [];
        const decorations = [];
        const interactables = [];
        const npcs = [];
        const portals = [];
        const groundY = 500;

        // === GROUND ===
        platforms.push({ x: -200, y: groundY, w: 3800, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        decorations.push({ x: -200, y: groundY + 80, type: 'underground', w: 3800, h: 200, color: '#4a2c12' });

        // === BRICK PLATFORMS (Mario-style) ===
        platforms.push({ x: 250, y: 390, w: 128, h: 24, type: 'brick', color: '#c4722a' });
        platforms.push({ x: 500, y: 340, w: 96, h: 24, type: 'brick', color: '#c4722a' });
        platforms.push({ x: 750, y: 380, w: 96, h: 24, type: 'brick', color: '#c4722a' });
        platforms.push({ x: 1000, y: 420, w: 160, h: 24, type: 'brick', color: '#c4722a' });
        platforms.push({ x: 1300, y: 360, w: 128, h: 24, type: 'brick', color: '#c4722a' });
        platforms.push({ x: 1600, y: 320, w: 96, h: 24, type: 'brick', color: '#c4722a' });
        platforms.push({ x: 1900, y: 400, w: 192, h: 24, type: 'brick', color: '#c4722a' });

        // Staircase blocks
        platforms.push({ x: 2200, y: 460, w: 64, h: 40, type: 'block', color: '#c4722a' });
        platforms.push({ x: 2264, y: 420, w: 64, h: 80, type: 'block', color: '#c4722a' });
        platforms.push({ x: 2328, y: 380, w: 64, h: 120, type: 'block', color: '#c4722a' });
        platforms.push({ x: 2392, y: 340, w: 200, h: 160, type: 'block', color: '#c4722a' });

        // === VILLAGE HOUSES — ON the ground, Mario-style ===
        decorations.push({ x: 80, y: groundY, type: 'village_house', w: 120, h: 100, roofColor: '#c0392b', wallColor: '#f5e6ca', windowColor: '#87ceeb', doorColor: '#8b4513', hasChimney: true });
        decorations.push({ x: 350, y: groundY, type: 'village_house', w: 80, h: 70, roofColor: '#2980b9', wallColor: '#ffeaa7', windowColor: '#87ceeb', doorColor: '#6d4c41', hasChimney: false });
        decorations.push({ x: 900, y: groundY, type: 'village_house', w: 140, h: 110, roofColor: '#27ae60', wallColor: '#fff3e0', windowColor: '#87ceeb', doorColor: '#5d4037', hasChimney: true });
        decorations.push({ x: 1500, y: groundY, type: 'village_house', w: 100, h: 85, roofColor: '#e67e22', wallColor: '#fce4ec', windowColor: '#87ceeb', doorColor: '#795548', hasChimney: true });
        decorations.push({ x: 2000, y: groundY, type: 'village_house', w: 70, h: 60, roofColor: '#8e44ad', wallColor: '#e8f5e9', windowColor: '#87ceeb', doorColor: '#6d4c41', hasChimney: false });

        // === MARIO-STYLE TREES (rounded bushy, on ground) ===
        [  -50, 220, 480, 650, 820, 1100, 1350, 1680, 1850, 2150, 2600, 2900, 3200].forEach(tx => {
            decorations.push({ x: tx, y: groundY, type: 'mario_tree', size: Utils.randFloat(50, 90), trunkColor: '#795548', leafColor: `hsl(${Utils.randInt(100, 140)}, ${Utils.randInt(55, 75)}%, ${Utils.randInt(35, 50)}%)` });
        });

        // === BUSHES ===
        for (let i = 0; i < 15; i++) {
            decorations.push({ x: Utils.randFloat(-100, 3500), y: groundY, type: 'bush', size: Utils.randFloat(15, 35), color: `hsl(${Utils.randInt(110, 140)}, ${Utils.randInt(50, 70)}%, ${Utils.randInt(30, 45)}%)` });
        }

        // === FLOWERS ===
        for (let i = 0; i < 20; i++) {
            decorations.push({ x: Utils.randFloat(0, 3500), y: groundY, type: 'flower', color: ['#e74c3c', '#f1c40f', '#e91e63', '#ff9800', '#9c27b0', '#ffffff'][Utils.randInt(0, 5)], size: Utils.randFloat(4, 8) });
        }

        // === CLOUDS ===
        for (let i = 0; i < 10; i++) {
            decorations.push({ x: Utils.randFloat(-200, 3800), y: Utils.randFloat(40, 180), type: 'cloud', size: Utils.randFloat(40, 100), speed: Utils.randFloat(0.15, 0.4) });
        }

        // === FENCE ===
        for (let i = 0; i < 6; i++) {
            decorations.push({ x: 580 + i * 60, y: groundY, type: 'fence' });
        }

        // === PIPE (Mario-style warp pipe) ===
        decorations.push({ x: 700, y: groundY, type: 'pipe', height: 50, color: '#43a047' });
        decorations.push({ x: 1800, y: groundY, type: 'pipe', height: 70, color: '#43a047' });

        // === SUN ===
        decorations.push({ x: 150, y: 80, type: 'sun', size: 50 });

        // === BIRDS ===
        for (let i = 0; i < 4; i++) {
            decorations.push({ x: Utils.randFloat(200, 3000), y: Utils.randFloat(50, 200), type: 'bird', speed: Utils.randFloat(0.5, 1.5), offset: Utils.randFloat(0, Math.PI * 2) });
        }

        // === SIGNBOARD ===
        interactables.push({ x: 160, y: groundY - 50, w: 60, h: 50, type: 'signboard', icon: '📋', panelType: 'about', hint: 'Read the welcome sign' });

        // === NPC ===
        npcs.push({ x: 600, y: groundY - 60, w: 30, h: 60, type: 'npc', name: 'Old Compiler', portrait: '🧙', dialogues: [
            "Welcome, young developer! You've jumped into a portfolio.",
            "Explore this world to discover the story of the coder who built it.",
            "Each zone reveals a part of their journey. Start by reading that signboard!",
            "Use arrow keys to move, UP to jump, and DOWN to crouch.",
            "Head right to reach the Skill Mountains. Good luck!"
        ]});

        // === CODE FRAGMENTS ===
        for (let i = 0; i < 5; i++) {
            decorations.push({ x: 400 + i * 250, y: Utils.randFloat(320, 420), type: 'code_fragment', symbol: ['</', '{', '()', '=>', '[]'][i], floatOffset: Utils.randFloat(0, Math.PI * 2) });
        }

        // === PORTAL ===
        portals.push({ x: 2500, y: 280, w: 50, h: 60, targetZone: 1, spawnX: 80, spawnY: 400 });

        return {
            platforms, decorations, interactables, npcs, portals,
            bg: { type: 'daytime', top: '#4fc3f7', bottom: '#81d4fa', stars: false },
            width: 3800,
            playerSpawn: { x: 80, y: 420 },
            parallax: [
                { speed: 0.08, elements: this.generateRollingHills(3800, '#66bb6a', 280, 0.002) },
                { speed: 0.15, elements: this.generateRollingHills(3800, '#81c784', 230, 0.004) },
                { speed: 0.25, elements: this.generateRollingHills(3800, '#a5d6a7', 180, 0.006) }
            ]
        };
    }

    // ============================
    // ZONE 1: Skill Mountains
    // ============================
    buildSkillMountains() {
        const platforms = [];
        const decorations = [];
        const interactables = [];
        const obstacles = [];
        const npcs = [];
        const portals = [];
        const groundY = 500;

        // Ground with gaps
        platforms.push({ x: -100, y: groundY, w: 500, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        platforms.push({ x: 600, y: groundY, w: 300, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        platforms.push({ x: 1050, y: groundY, w: 400, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        platforms.push({ x: 1600, y: groundY, w: 600, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        platforms.push({ x: 2400, y: groundY, w: 800, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });

        // Climbing platforms
        const steps = [
            { x: 450, y: 440, w: 80 }, { x: 560, y: 380, w: 80 },
            { x: 680, y: 320, w: 80 }, { x: 820, y: 260, w: 100 },
            { x: 980, y: 200, w: 120 }, { x: 1100, y: 260, w: 80 },
            { x: 1200, y: 330, w: 80 }, { x: 1350, y: 400, w: 100 },
            { x: 1650, y: 420, w: 80 }, { x: 1780, y: 360, w: 80 },
            { x: 1920, y: 300, w: 100 }, { x: 2050, y: 240, w: 120 },
            { x: 2200, y: 300, w: 80 }, { x: 2350, y: 380, w: 80 },
        ];
        steps.forEach(s => {
            platforms.push({ x: s.x, y: s.y, w: s.w, h: 24, type: 'brick', color: '#8d6e63' });
        });

        // High skill-view platforms
        platforms.push({ x: 930, y: 180, w: 200, h: 24, type: 'brick', color: '#a1887f' });
        platforms.push({ x: 2000, y: 220, w: 200, h: 24, type: 'brick', color: '#a1887f' });

        // Skill pillars
        const skills = ['HTML', 'CSS', 'JS', 'React', 'Node', 'Python', 'Git', 'SQL'];
        skills.forEach((skill, i) => {
            decorations.push({ x: 200 + i * 350, y: groundY, type: 'skill_pillar', label: skill, height: 40 + i * 15, color: `hsl(${i * 45}, 70%, 55%)` });
        });

        // Clouds & flowers
        for (let i = 0; i < 8; i++) decorations.push({ x: Utils.randFloat(-200, 3500), y: Utils.randFloat(30, 140), type: 'cloud', size: Utils.randFloat(50, 100), speed: Utils.randFloat(0.2, 0.5) });
        for (let i = 0; i < 12; i++) decorations.push({ x: Utils.randFloat(0, 3200), y: groundY, type: 'flower', color: ['#e74c3c', '#f39c12', '#9b59b6', '#3498db'][Utils.randInt(0, 3)], size: Utils.randFloat(4, 7) });

        // Pipes
        decorations.push({ x: 400, y: groundY, type: 'pipe', height: 50, color: '#43a047' });

        // Sun
        decorations.push({ x: 200, y: 70, type: 'sun', size: 45 });

        // Signboards
        interactables.push({ x: 980, y: 130, w: 60, h: 50, type: 'signboard', icon: '🎨', panelType: 'skills_frontend', hint: 'View Frontend Skills' });
        interactables.push({ x: 2050, y: 170, w: 60, h: 50, type: 'signboard', icon: '⚙️', panelType: 'skills_backend', hint: 'View Backend Skills' });

        // Obstacles
        obstacles.push({ x: 520, y: groundY - 12, w: 60, h: 12, type: 'spikes', damage: true });
        obstacles.push({ x: 960, y: groundY - 12, w: 70, h: 12, type: 'spikes', damage: true });
        obstacles.push({ x: 1480, y: groundY - 12, w: 80, h: 12, type: 'spikes', damage: true });
        obstacles.push({ x: 1480, y: 440, w: 80, h: 24, type: 'moving_platform', moveRange: 120, moveSpeed: 1.5, moveDir: 'y', platform: true });

        // NPC
        npcs.push({ x: 300, y: groundY - 60, w: 30, h: 60, type: 'npc', name: 'Byte Sage', portrait: '🧑‍💻', dialogues: [
            "These mountains represent the skills you've mastered.",
            "Each pillar grows taller with experience.",
            "Climb to the peaks to see detailed skill breakdowns!",
            "Watch out for the spike traps — bugs in the code!"
        ]});

        // Portal
        portals.push({ x: 2900, y: 440, w: 50, h: 60, targetZone: 2, spawnX: 80, spawnY: 400 });

        return {
            platforms, decorations, interactables, obstacles, npcs, portals,
            bg: { type: 'daytime', top: '#64b5f6', bottom: '#90caf9', stars: false },
            width: 3200,
            playerSpawn: { x: 80, y: 420 },
            parallax: [
                { speed: 0.06, elements: this.generateSnowMountains(3200, '#90a4ae', 300) },
                { speed: 0.12, elements: this.generateSnowMountains(3200, '#b0bec5', 240) },
                { speed: 0.2, elements: this.generateRollingHills(3200, '#a5d6a7', 160, 0.005) }
            ]
        };
    }

    // ============================
    // ZONE 2: Project Factory — Warm industrial
    // ============================
    buildProjectFactory() {
        const platforms = [];
        const decorations = [];
        const interactables = [];
        const obstacles = [];
        const npcs = [];
        const portals = [];
        const groundY = 500;

        // Ground
        platforms.push({ x: -100, y: groundY, w: 4000, h: 80, type: 'ground', color: '#8d6e63', topColor: '#a1887f' });
        decorations.push({ x: -100, y: groundY + 80, type: 'underground', w: 4000, h: 200, color: '#5d4037' });

        // Metal platforms
        platforms.push({ x: 200, y: 400, w: 300, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 600, y: 380, w: 200, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 900, y: 350, w: 250, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 1300, y: 400, w: 200, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 1600, y: 360, w: 300, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 2000, y: 320, w: 250, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 2400, y: 380, w: 200, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 2700, y: 340, w: 300, h: 24, type: 'metal', color: '#90a4ae' });
        platforms.push({ x: 3100, y: 400, w: 200, h: 24, type: 'metal', color: '#90a4ae' });

        // Factory buildings ON the ground
        decorations.push({ x: 100, y: groundY, type: 'factory_building', w: 160, h: 140, color: '#8d6e63', roofColor: '#6d4c41' });
        decorations.push({ x: 800, y: groundY, type: 'factory_building', w: 200, h: 180, color: '#795548', roofColor: '#5d4037' });
        decorations.push({ x: 1800, y: groundY, type: 'factory_building', w: 180, h: 150, color: '#a1887f', roofColor: '#6d4c41' });
        decorations.push({ x: 2800, y: groundY, type: 'factory_building', w: 150, h: 130, color: '#8d6e63', roofColor: '#5d4037' });

        // Machines, conveyors, gears, smokestacks
        for (let i = 0; i < 6; i++) decorations.push({ x: 150 + i * 550, y: groundY, type: 'machine', variant: i % 3, size: Utils.randFloat(60, 100) });
        for (let i = 0; i < 4; i++) decorations.push({ x: 300 + i * 800, y: groundY - 2, type: 'conveyor', width: 200 });
        for (let i = 0; i < 8; i++) decorations.push({ x: Utils.randFloat(0, 3500), y: Utils.randFloat(200, 480), type: 'gear', size: Utils.randFloat(20, 50), speed: Utils.randFloat(0.5, 2), color: `hsl(${30 + Utils.randInt(0, 20)}, 50%, ${Utils.randInt(45, 65)}%)` });
        for (let i = 0; i < 5; i++) decorations.push({ x: 100 + i * 700, y: groundY - 180, type: 'smokestack', height: 180 });

        // Clouds
        for (let i = 0; i < 6; i++) decorations.push({ x: Utils.randFloat(0, 3800), y: Utils.randFloat(30, 120), type: 'cloud', size: Utils.randFloat(50, 90), speed: Utils.randFloat(0.15, 0.4) });

        // Sun
        decorations.push({ x: 300, y: 70, type: 'sun', size: 45 });

        // Interactables
        interactables.push({ x: 300, y: 350, w: 60, h: 50, type: 'signboard', icon: '🖥️', panelType: 'project_1', hint: 'View Project: Portfolio Hacker' });
        interactables.push({ x: 950, y: 300, w: 60, h: 50, type: 'signboard', icon: '📱', panelType: 'project_2', hint: 'View Project: Code Quest Game' });
        interactables.push({ x: 1700, y: 310, w: 60, h: 50, type: 'signboard', icon: '🌲', panelType: 'project_3', hint: 'View Project: Forest Portfolio' });
        interactables.push({ x: 2800, y: 290, w: 60, h: 50, type: 'signboard', icon: '🚀', panelType: 'project_4', hint: 'View More Projects' });

        // Obstacles
        obstacles.push({ x: 550, y: 400, w: 8, h: 100, type: 'laser', speed: 2, active: true });
        obstacles.push({ x: 1200, y: 350, w: 8, h: 150, type: 'laser', speed: 3, active: true });
        obstacles.push({ x: 2350, y: 380, w: 8, h: 120, type: 'laser', speed: 1.5, active: true });

        // NPC
        npcs.push({ x: 100, y: groundY - 60, w: 30, h: 60, type: 'npc', name: 'Factory Bot', portrait: '🤖', dialogues: [
            "Welcome to the Project Factory!",
            "Each machine here represents a project I've built.",
            "Interact with the displays to see the details.",
            "Watch out for the lasers — they're security systems!"
        ]});

        // Portal
        portals.push({ x: 3400, y: 440, w: 50, h: 60, targetZone: 3, spawnX: 80, spawnY: 400 });

        return {
            platforms, decorations, interactables, obstacles, npcs, portals,
            bg: { type: 'sunset', top: '#ff8a65', bottom: '#ffcc80', stars: false },
            width: 3600,
            playerSpawn: { x: 80, y: 420 },
            parallax: [
                { speed: 0.08, elements: this.generateFactoryBG(3600, '#d7ccc8', 0) },
                { speed: 0.15, elements: this.generateFactoryBG(3600, '#efebe9', 1) },
            ]
        };
    }

    // ============================
    // ZONE 3: Experience Bridge — Golden hour
    // ============================
    buildExperienceBridge() {
        const platforms = [];
        const decorations = [];
        const interactables = [];
        const obstacles = [];
        const npcs = [];
        const portals = [];
        const groundY = 500;

        // Start ground
        platforms.push({ x: -100, y: groundY, w: 400, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });

        // Bridge planks over a river
        for (let i = 0; i < 20; i++) {
            const bx = 400 + i * 150;
            const by = 480 - Math.sin(i * 0.3) * 30;
            platforms.push({ x: bx, y: by, w: 120, h: 24, type: 'bridge_plank', color: '#8d6e63' });
        }

        // End ground
        platforms.push({ x: 3400, y: groundY, w: 500, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        platforms.push({ x: 3500, y: 380, w: 300, h: 24, type: 'brick', color: '#a1887f' });

        // River
        decorations.push({ x: 350, y: 530, type: 'river', w: 3100, h: 100 });

        // Timeline posts
        const timelineEvents = [
            { year: '2020', title: 'Started Coding' },
            { year: '2021', title: 'First Website' },
            { year: '2022', title: 'Learned React' },
            { year: '2023', title: 'Full Stack Dev' },
            { year: '2024', title: 'Open Source' },
            { year: '2025', title: 'Current Year' },
        ];
        timelineEvents.forEach((ev, i) => {
            decorations.push({ x: 550 + i * 480, y: 380, type: 'timeline_post', year: ev.year, title: ev.title, color: `hsl(${30 + i * 30}, 70%, 55%)` });
        });

        // Bridge towers
        decorations.push({ x: 350, y: 200, type: 'bridge_tower', height: 300 });
        decorations.push({ x: 1700, y: 200, type: 'bridge_tower', height: 300 });
        decorations.push({ x: 3400, y: 200, type: 'bridge_tower', height: 300 });

        // Clouds
        for (let i = 0; i < 7; i++) decorations.push({ x: Utils.randFloat(-200, 4200), y: Utils.randFloat(30, 150), type: 'cloud', size: Utils.randFloat(50, 100), speed: Utils.randFloat(0.2, 0.5) });

        // Sun
        decorations.push({ x: 350, y: 80, type: 'sun', size: 55 });

        // Interactable
        interactables.push({ x: 3550, y: 330, w: 60, h: 50, type: 'signboard', icon: '📜', panelType: 'experience', hint: 'View Experience Timeline' });

        // Obstacles
        obstacles.push({ x: 800, y: 300, w: 200, h: 200, type: 'wind', pushX: -2 });
        obstacles.push({ x: 1600, y: 300, w: 200, h: 200, type: 'wind', pushX: 3 });
        obstacles.push({ x: 2400, y: 300, w: 200, h: 200, type: 'wind', pushX: -3 });
        for (let i = 0; i < 5; i++) {
            obstacles.push({ x: 700 + i * 500, y: 450, w: 80, h: 24, type: 'falling_platform', fallDelay: 0.5, isFalling: false, fallTimer: 0, originalY: 450, platform: true });
        }

        // NPC
        npcs.push({ x: 200, y: groundY - 60, w: 30, h: 60, type: 'npc', name: 'Time Keeper', portrait: '⏰', dialogues: [
            "This bridge spans the timeline of my career.",
            "Each post marks a milestone in the journey.",
            "Be careful — the winds of change blow strong here!",
            "Some platforms crumble under pressure. Don't stand too long!",
            "The experience archive awaits at the other end."
        ]});

        // Portal
        portals.push({ x: 3700, y: 440, w: 50, h: 60, targetZone: 4, spawnX: 80, spawnY: 400 });

        return {
            platforms, decorations, interactables, obstacles, npcs, portals,
            bg: { type: 'golden', top: '#ffb74d', bottom: '#ffe0b2', stars: false },
            width: 4000,
            playerSpawn: { x: 80, y: 420 },
            parallax: [
                { speed: 0.05, elements: this.generateRollingHills(4000, '#c8e6c9', 260, 0.002) },
                { speed: 0.12, elements: this.generateRollingHills(4000, '#a5d6a7', 200, 0.004) },
            ]
        };
    }

    // ============================
    // ZONE 4: Contact Tower — Bright clear sky
    // ============================
    buildContactTower() {
        const platforms = [];
        const decorations = [];
        const interactables = [];
        const npcs = [];
        const portals = [];
        const groundY = 500;

        // Ground
        platforms.push({ x: -100, y: groundY, w: 2500, h: 80, type: 'ground', color: '#6b4226', topColor: '#4caf50' });
        decorations.push({ x: -100, y: groundY + 80, type: 'underground', w: 2500, h: 200, color: '#4a2c12' });

        // Tower platforms - better climbing layout (stair-like, closer together)
        const towerX = 800;
        const towerBase = groundY;
        
        // Starting approach platforms
        platforms.push({ x: 200, y: 420, w: 150, h: 24, type: 'brick', color: '#a1887f' });
        platforms.push({ x: 400, y: 360, w: 130, h: 24, type: 'brick', color: '#a1887f' });
        platforms.push({ x: 580, y: 310, w: 140, h: 24, type: 'brick', color: '#bcaaa4' });
        
        // Tower climbing platforms - zigzag pattern with closer, jumpable gaps
        const climbPlatforms = [
            { x: towerX - 100, y: towerBase - 60, w: 140 },
            { x: towerX + 60, y: towerBase - 110, w: 130 },
            { x: towerX - 80, y: towerBase - 160, w: 130 },
            { x: towerX + 70, y: towerBase - 210, w: 120 },
            { x: towerX - 70, y: towerBase - 260, w: 120 },
            { x: towerX + 60, y: towerBase - 310, w: 110 },
            { x: towerX - 60, y: towerBase - 360, w: 110 },
            { x: towerX + 50, y: towerBase - 410, w: 100 },
            { x: towerX - 50, y: towerBase - 460, w: 100 },
            { x: towerX + 40, y: towerBase - 510, w: 100 },
            { x: towerX - 40, y: towerBase - 560, w: 100 },
            { x: towerX, y: towerBase - 620, w: 160 }, // Top platform
        ];
        
        climbPlatforms.forEach((p, i) => {
            platforms.push({ 
                x: p.x, 
                y: p.y, 
                w: p.w, 
                h: 24, 
                type: 'brick', 
                color: `hsl(${40 + i * 8}, 55%, ${52 + i * 2}%)` 
            });
        });

        // Tower structure
        decorations.push({ x: towerX - 20, y: towerBase - 600, type: 'tower_top' });
        decorations.push({ x: towerX - 30, y: towerBase - 200, type: 'tower_body', height: 200 });
        decorations.push({ x: towerX + 50, y: towerBase - 620, type: 'signal_dish' });
        decorations.push({ x: towerX - 90, y: towerBase - 580, type: 'signal_dish' });
        for (let i = 0; i < 6; i++) decorations.push({ x: towerX, y: towerBase - 650, type: 'signal_wave', radius: 50 + i * 40, offset: i * 0.5 });

        // Trees, bushes, flowers around
        [-50, 100, 300, 500, 1200, 1500, 1800, 2100].forEach(tx => {
            decorations.push({ x: tx, y: groundY, type: 'mario_tree', size: Utils.randFloat(40, 70), trunkColor: '#795548', leafColor: `hsl(${Utils.randInt(100, 140)}, 60%, ${Utils.randInt(35, 50)}%)` });
        });
        for (let i = 0; i < 8; i++) decorations.push({ x: Utils.randFloat(0, 2500), y: groundY, type: 'bush', size: Utils.randFloat(15, 30), color: `hsl(${Utils.randInt(110, 140)}, 60%, 40%)` });
        for (let i = 0; i < 10; i++) decorations.push({ x: Utils.randFloat(0, 2500), y: groundY, type: 'flower', color: ['#f44336', '#ffeb3b', '#e91e63', '#ff9800'][Utils.randInt(0, 3)], size: Utils.randFloat(4, 7) });

        // Clouds & sun
        for (let i = 0; i < 6; i++) decorations.push({ x: Utils.randFloat(-200, 2800), y: Utils.randFloat(30, 120), type: 'cloud', size: Utils.randFloat(40, 90), speed: Utils.randFloat(0.2, 0.5) });
        decorations.push({ x: 180, y: 60, type: 'sun', size: 50 });

        // Sparkles
        for (let i = 0; i < 20; i++) decorations.push({ x: towerX + Utils.randFloat(-200, 200), y: towerBase - 500 + Utils.randFloat(-200, 200), type: 'sparkle', size: Utils.randFloat(2, 5), offset: Utils.randFloat(0, Math.PI * 2) });

        // Interactables
        interactables.push({ x: towerX - 30, y: towerBase - 700, w: 60, h: 50, type: 'signboard', icon: '📡', panelType: 'contact', hint: 'View Contact Information' });
        interactables.push({ x: 200, y: 370, w: 60, h: 50, type: 'signboard', icon: '🏆', panelType: 'achievements', hint: 'View Achievements' });

        // NPC
        npcs.push({ x: 400, y: groundY - 60, w: 30, h: 60, type: 'npc', name: 'Signal Master', portrait: '📡', dialogues: [
            "You've made it to the Contact Tower!",
            "Climb to the top to find all the ways to reach me.",
            "This is the final zone — you've explored my entire portfolio!",
            "Thank you for playing Code Quest!",
            "Feel free to restart and explore more. Every journey has new details."
        ]});

        return {
            platforms, decorations, interactables, obstacles: [], npcs, portals: [],
            bg: { type: 'daytime', top: '#42a5f5', bottom: '#90caf9', stars: false },
            width: 2500,
            playerSpawn: { x: 80, y: 420 },
            parallax: [
                { speed: 0.08, elements: this.generateRollingHills(2500, '#66bb6a', 280, 0.003) },
                { speed: 0.18, elements: this.generateRollingHills(2500, '#81c784', 200, 0.005) },
            ]
        };
    }

    // ============================
    // Parallax Generators
    // ============================
    generateRollingHills(width, color, baseY, freq) {
        const points = [];
        let x = -100;
        while (x < width + 200) {
            points.push({ x: x, y: 500 - baseY + Math.sin(x * freq) * 50 + Math.sin(x * freq * 2.5) * 25 });
            x += 30;
        }
        return { type: 'hills', color, points };
    }

    generateSnowMountains(width, color, baseY) {
        const points = [];
        let x = -100;
        while (x < width + 200) {
            points.push({ x: x, y: 500 - baseY + Math.sin(x * 0.002) * 80 + Math.sin(x * 0.005) * 40 });
            x += Utils.randFloat(60, 150);
        }
        return { type: 'snow_mountains', color, snowColor: '#ffffff', points };
    }

    generateFactoryBG(width, color, layer) {
        const buildings = [];
        let x = -50;
        while (x < width + 100) {
            buildings.push({ x: x, y: 500, w: Utils.randFloat(60, 150), h: Utils.randFloat(60, 140 + layer * 40) });
            x += Utils.randFloat(100, 250);
        }
        return { type: 'buildings', color, buildings };
    }

    // ============================
    // Update
    // ============================
    update(dt, player) {
        this.time = (this.time || 0) + dt;
        for (const obs of this.obstacles) {
            if (obs.type === 'moving_platform') {
                if (!obs._startX) obs._startX = obs.x;
                if (!obs._startY) obs._startY = obs.y;
                obs._time = (obs._time || 0) + dt * obs.moveSpeed;
                if (obs.moveDir === 'x') obs.x = obs._startX + Math.sin(obs._time) * obs.moveRange;
                else obs.y = obs._startY + Math.sin(obs._time) * obs.moveRange;
            }
            if (obs.type === 'laser') {
                obs._time = (obs._time || 0) + dt * obs.speed;
                obs.active = Math.sin(obs._time) > 0;
            }
            if (obs.type === 'falling_platform') {
                const playerOn = player.grounded && player.feetY >= obs.y - 5 && player.feetY <= obs.y + 5 && player.centerX > obs.x && player.centerX < obs.x + obs.w;
                if (playerOn && !obs.isFalling) { obs.fallTimer += dt; if (obs.fallTimer >= obs.fallDelay) obs.isFalling = true; }
                if (obs.isFalling) { obs.y += 4; if (obs.y > 800) { obs.y = obs.originalY; obs.isFalling = false; obs.fallTimer = 0; } }
            }
        }

        // Ambient floating particles (butterflies, leaves, pollen)
        if (Math.random() < 0.04) {
            const zone = this.zones[this.currentZone];
            this.ambientParticles.push({
                x: Utils.randFloat(0, zone.width || 3000), y: Utils.randFloat(100, 480),
                vx: Utils.randFloat(-0.5, 0.5), vy: Utils.randFloat(-0.3, 0.3),
                life: Utils.randFloat(3, 7), maxLife: 7, size: Utils.randFloat(2, 4),
                color: ['#fff9c4', '#c8e6c9', '#ffccbc', '#bbdefb'][Utils.randInt(0, 3)]
            });
        }
        this.ambientParticles.forEach(p => {
            p.x += p.vx + Math.sin(this.time * 2 + p.x * 0.01) * 0.3;
            p.y += p.vy + Math.cos(this.time * 1.5 + p.y * 0.01) * 0.2;
            p.life -= dt;
        });
        this.ambientParticles = this.ambientParticles.filter(p => p.life > 0);
    }

    getSolidPlatforms() {
        const solids = [...this.platforms];
        for (const obs of this.obstacles) {
            if (obs.platform && !obs.isFalling) solids.push(obs);
        }
        return solids;
    }
}