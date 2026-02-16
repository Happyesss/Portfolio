/* ═══════════════════════════════════════════════════════
   SCENE.JS — Three.js 3D Retro Computer Scene
   • Smooth, detailed models (rounded edges, bevels, curves)
   • Terminal HTML overlays precisely onto the 3D CRT screen
   • QWERTY-mapped keyboard — real key → matching 3D key
   ═══════════════════════════════════════════════════════ */

const Scene3D = (() => {
    let scene, camera, renderer;
    let computerGroup;
    let screenMesh;
    let animationId;
    let mouseX = 0, mouseY = 0;
    let particles = [];
    let clock;
    let frameCount = 0;

    /* ── Keyboard tracking ── */
    const keyMap = {};          // e.key / e.code  →  mesh index
    let keyMeshes = [];
    let keyOriginalY = [];
    let keyAnimState = [];      // 0 = idle, >0 = pressing/releasing
    let keyPressedMat, keyNormalMat, keyGlowMat;
    const KEY_PRESS_DEPTH = 0.03;

    /* ── Screen projection constants ── */
    const SCREEN_W = 3.4;
    const SCREEN_H = 2.6;
    const SCREEN_CENTER_Y = 1.85;
    const SCREEN_Z = 0.96;

    /* ── Helper: rounded box geometry ── */
    function RoundedBox(w, h, d, radius, segments) {
        radius = Math.min(radius, w / 2, h / 2, d / 2);
        const s = segments || 3;
        const shape = new THREE.Shape();
        const hw = w / 2 - radius;
        const hh = h / 2 - radius;
        shape.moveTo(-hw, -h / 2);
        shape.lineTo(hw, -h / 2);
        shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh);
        shape.lineTo(w / 2, hh);
        shape.quadraticCurveTo(w / 2, h / 2, hw, h / 2);
        shape.lineTo(-hw, h / 2);
        shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh);
        shape.lineTo(-w / 2, -hh);
        shape.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);
        const extrudeSettings = { depth: d, bevelEnabled: true, bevelThickness: radius, bevelSize: radius, bevelSegments: s };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.translate(0, 0, -d / 2);
        return geo;
    }

    function init() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        clock = new THREE.Clock();

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x040804);
        scene.fog = new THREE.FogExp2(0x040804, 0.012);

        camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 4.2, 10.5);
        camera.lookAt(0, 1.5, 0);

        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        createLights();
        createDesk();
        createComputer();
        createKeyboard();
        createMouse();
        createEnvironment();
        createParticles();

        window.addEventListener('resize', onResize);
        document.addEventListener('keydown', onKeyDown);

        animate();
        requestAnimationFrame(() => requestAnimationFrame(syncOverlay));
    }

    /* ═══════════════════════════════════════
       LIGHTS
       ═══════════════════════════════════════ */
    function createLights() {
        scene.add(new THREE.AmbientLight(0x112211, 0.5));

        const screenLight = new THREE.PointLight(0x00ff41, 2.8, 16);
        screenLight.position.set(0, 3.0, 4);
        screenLight.castShadow = true;
        screenLight.shadow.mapSize.set(1024, 1024);
        scene.add(screenLight);

        const fillLeft = new THREE.PointLight(0x00e5ff, 0.5, 14);
        fillLeft.position.set(-6, 4, 2);
        scene.add(fillLeft);

        const accentRight = new THREE.PointLight(0xff0040, 0.2, 9);
        accentRight.position.set(5, 2, -1);
        scene.add(accentRight);

        const topDir = new THREE.DirectionalLight(0x00ff41, 0.25);
        topDir.position.set(0, 10, 3);
        topDir.castShadow = true;
        scene.add(topDir);

        const rimBack = new THREE.PointLight(0x00ff41, 0.35, 10);
        rimBack.position.set(0, 3, -5);
        scene.add(rimBack);

        // Enhanced keyboard lighting - multiple lights for better key visibility
        const kbLightMain = new THREE.PointLight(0x00ff41, 0.9, 6);
        kbLightMain.position.set(0, 1.6, 2.5);
        scene.add(kbLightMain);

        // Additional keyboard accent lights
        const kbLightLeft = new THREE.PointLight(0x00ff41, 0.4, 4);
        kbLightLeft.position.set(-1.5, 1.2, 2.5);
        scene.add(kbLightLeft);

        const kbLightRight = new THREE.PointLight(0x00ff41, 0.4, 4);
        kbLightRight.position.set(1.5, 1.2, 2.5);
        scene.add(kbLightRight);

        // Front fill light for keyboard
        const kbFrontLight = new THREE.PointLight(0x00aa33, 0.3, 5);
        kbFrontLight.position.set(0, 0.8, 3.8);
        scene.add(kbFrontLight);
    }

    /* ═══════════════════════════════════════
       DESK — rounded slab + tapered legs
       ═══════════════════════════════════════ */
    function createDesk() {
        // Desk top — rounded box (wider to fit larger keyboard)
        const deskGeo = RoundedBox(10.5, 0.18, 5.2, 0.06, 3);
        const deskMat = new THREE.MeshStandardMaterial({ color: 0x1c1209, roughness: 0.72, metalness: 0.08 });
        const desk = new THREE.Mesh(deskGeo, deskMat);
        desk.position.set(0, 0, 0.3);
        desk.receiveShadow = true;
        scene.add(desk);

        // Tapered cylindrical legs
        const legMat = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.55, roughness: 0.4 });
        [[-4.7, -1.4, -1.8], [4.7, -1.4, -1.8], [-4.7, -1.4, 2.5], [4.7, -1.4, 2.5]].forEach(p => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 2.8, 12), legMat);
            leg.position.set(...p);
            leg.castShadow = true;
            scene.add(leg);
        });

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshStandardMaterial({ color: 0x060806, roughness: 0.95 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.8;
        floor.receiveShadow = true;
        scene.add(floor);

        const grid = new THREE.GridHelper(50, 100, 0x002a00, 0x001200);
        grid.position.y = -2.79;
        scene.add(grid);
    }

    /* ═══════════════════════════════════════
       CRT MONITOR — smooth bevelled body
       ═══════════════════════════════════════ */
    function createComputer() {
        computerGroup = new THREE.Group();
        const stdMat = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r ?? 0.55, metalness: m ?? 0.2 });

        // ── Monitor body (deep CRT) — rounded box
        const bodyGeo = RoundedBox(4.2, 3.4, 2.8, 0.18, 4);
        const body = new THREE.Mesh(bodyGeo, stdMat(0x2d2d2d, 0.5, 0.22));
        body.position.set(0, 1.75, -0.45);
        body.castShadow = true;
        computerGroup.add(body);

        // ── Front bezel frame — slightly larger rounded box
        const bezelGeo = RoundedBox(4.45, 3.6, 0.15, 0.14, 4);
        const bezel = new THREE.Mesh(bezelGeo, stdMat(0x353535, 0.5, 0.18));
        bezel.position.set(0, 1.75, 0.84);
        computerGroup.add(bezel);

        // ── Inner bezel recess
        const innerGeo = RoundedBox(3.55, 2.8, 0.06, 0.06, 3);
        const inner = new THREE.Mesh(innerGeo, new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 }));
        inner.position.set(0, SCREEN_CENTER_Y, 0.91);
        computerGroup.add(inner);

        // ── THE SCREEN — slightly curved
        const screenGeo = new THREE.PlaneGeometry(SCREEN_W, SCREEN_H, 20, 20);
        // Add subtle CRT bulge
        const posAttr = screenGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const nx = x / (SCREEN_W / 2);
            const ny = y / (SCREEN_H / 2);
            const bulge = 0.04 * (1 - nx * nx) * (1 - ny * ny);
            posAttr.setZ(i, bulge);
        }
        posAttr.needsUpdate = true;
        screenGeo.computeVertexNormals();

        const screenMat = new THREE.MeshStandardMaterial({
            color: 0x001100,
            emissive: 0x00ff41,
            emissiveIntensity: 0.2,
            roughness: 0.05,
            metalness: 0.85,
        });
        screenMesh = new THREE.Mesh(screenGeo, screenMat);
        screenMesh.position.set(0, SCREEN_CENTER_Y, SCREEN_Z);
        computerGroup.add(screenMesh);

        // Screen glow halo
        const glow = new THREE.Mesh(
            new THREE.PlaneGeometry(SCREEN_W + 0.6, SCREEN_H + 0.5),
            new THREE.MeshBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.03 })
        );
        glow.position.set(0, SCREEN_CENTER_Y, SCREEN_Z + 0.015);
        computerGroup.add(glow);

        // ── Monitor stand — taller neck + wider visible base
        const standMat = stdMat(0x262626, 0.45, 0.3);
        const standDarkMat = stdMat(0x1e1e1e, 0.5, 0.25);

        // Stand neck (taller so monitor is clearly above the desk)
        const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.7, 16), standMat);
        standNeck.position.set(0, -0.05, -0.3);
        standNeck.castShadow = true;
        computerGroup.add(standNeck);

        // Stand base plate — wide oval to show it's on the desk
        const standBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.85, 0.9, 0.06, 32),
            standDarkMat
        );
        standBase.position.set(0, -0.38, -0.3);
        standBase.receiveShadow = true;
        computerGroup.add(standBase);

        // Stand base ring (decorative)
        const standRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.82, 0.025, 8, 32),
            standMat
        );
        standRing.position.set(0, -0.35, -0.3);
        standRing.rotation.x = Math.PI / 2;
        computerGroup.add(standRing);

        // Anti-slip pads on the base
        [[-0.6, -0.41, 0.2], [0.6, -0.41, 0.2], [-0.6, -0.41, -0.8], [0.6, -0.41, -0.8]].forEach(p => {
            const pad = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8),
                new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
            );
            pad.position.set(...p);
            computerGroup.add(pad);
        });

        // ── Power LED
        const led = new THREE.Mesh(
            new THREE.SphereGeometry(0.04, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x00ff41 })
        );
        led.position.set(1.85, 0.45, 0.95);
        computerGroup.add(led);

        // ── Side vents (subtle grooves)
        for (let i = 0; i < 5; i++) {
            const vent = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.06, 1.6),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
            );
            vent.position.set(2.12, 2.1 - i * 0.28, -0.45);
            computerGroup.add(vent);
        }

        // ── Monitor brand label (small rectangle)
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(0.7, 0.14),
            new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 })
        );
        label.position.set(0, 0.25, 0.95);
        computerGroup.add(label);

        // ── CPU Tower — rounded box
        const cpuGeo = RoundedBox(1.1, 2.8, 1.6, 0.1, 3);
        const cpu = new THREE.Mesh(cpuGeo, stdMat(0x252525, 0.5, 0.2));
        cpu.position.set(-3.5, -1.3, 0.2);
        cpu.castShadow = true;
        computerGroup.add(cpu);

        // CPU front panel detail
        const cpuPanel = new THREE.Mesh(
            RoundedBox(0.85, 0.4, 0.04, 0.03, 2),
            stdMat(0x1e1e1e, 0.7, 0.1)
        );
        cpuPanel.position.set(-3.5, -0.6, 1.02);
        computerGroup.add(cpuPanel);

        // CPU LEDs
        [0x00ff41, 0xff6600].forEach((c, i) => {
            const l = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 10, 10),
                new THREE.MeshBasicMaterial({ color: c })
            );
            l.position.set(-3.5, -0.35 + i * 0.18, 1.02);
            computerGroup.add(l);
        });

        // ── Cable from CPU to monitor
        const cablePoints = [
            new THREE.Vector3(-2.9, 0, 0.2),
            new THREE.Vector3(-2.3, 0.5, 0.3),
            new THREE.Vector3(-1.5, 0.45, 0.1),
            new THREE.Vector3(-0.8, 0.15, -0.3)
        ];
        const cable = new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePoints), 32, 0.03, 8, false),
            new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7 })
        );
        computerGroup.add(cable);

        // Raise the whole computer group so the stand is visible above desk
        computerGroup.position.y = 0.35;

        scene.add(computerGroup);
    }

    /* ═══════════════════════════════════════
       KEYBOARD — QWERTY layout, rounded keys,
       each key mapped to its real counterpart
       ═══════════════════════════════════════ */
    function createKeyboard() {
        const kbGroup = new THREE.Group();
        keyMeshes = [];
        keyOriginalY = [];
        keyAnimState = [];

        // ── Keyboard body — trimmed width for cut effect
        const kbBodyGeo = RoundedBox(3.35, 0.12, 1.2, 0.06, 3); // reduced width
        const kbBody = new THREE.Mesh(
            kbBodyGeo,
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.25 })
        );
        kbBody.position.set(0, 0.06, 2.5);
        kbBody.castShadow = true;
        kbBody.receiveShadow = true;
        kbGroup.add(kbBody);

        // Keyboard plate (top surface with slight border, trimmed width)
        const kbPlateGeo = RoundedBox(3.15, 0.02, 1.0, 0.04, 2); // reduced width
        const kbPlate = new THREE.Mesh(
            kbPlateGeo,
            new THREE.MeshStandardMaterial({ color: 0x252525, roughness: 0.6, metalness: 0.2 })
        );
        kbPlate.position.set(0, 0.13, 2.5);
        kbGroup.add(kbPlate);

        // Keyboard feet / risers (more prominent)
        const footMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.2 });
        [[-1.7, 0.03, 3.0], [1.7, 0.03, 3.0]].forEach(p => {
            const foot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.08), footMat);
            foot.position.set(...p);
            kbGroup.add(foot);
        });

        // Status LED indicators on keyboard
        const ledMat1 = new THREE.MeshBasicMaterial({ color: 0x00ff41 });
        const ledMat2 = new THREE.MeshBasicMaterial({ color: 0x003311 });
        [[-1.5, 0.15, 1.90], [-1.3, 0.15, 1.90], [-1.1, 0.15, 1.90]].forEach((p, i) => {
            const led = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.015, 0.03),
                i === 0 ? ledMat1 : ledMat2
            );
            led.position.set(...p);
            kbGroup.add(led);
        });

        kbGroup.rotation.x = -0.03;

        // Materials for keys — better contrast and glow
        keyNormalMat = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a, 
            roughness: 0.5, 
            metalness: 0.15,
        });
        keyGlowMat = new THREE.MeshStandardMaterial({ 
            color: 0x2e2e2e, 
            emissive: 0x00ff41, 
            emissiveIntensity: 0.08, 
            roughness: 0.5, 
            metalness: 0.15 
        });
        keyPressedMat = new THREE.MeshStandardMaterial({ 
            color: 0x404040, 
            emissive: 0x00ff41, 
            emissiveIntensity: 0.8, 
            roughness: 0.3, 
            metalness: 0.3 
        });

        // Key cap top material (lighter, shows key surface better)
        const keyTopMat = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,
            roughness: 0.4,
            metalness: 0.1
        });

        const kw = 0.19;    // key width — larger keys
        const kd = 0.16;    // key depth (z) — reduced for tighter spacing
        const kh = 0.055;   // key height — taller keys
        const gap = 0.012;  // gap between keys — reduced
        const bevel = 0.012;
        const baseY = 0.16;

        // QWERTY rows: each row is an array of { label, w (width multiplier) }
        const rows = [
            // Row 0 (top): number row
            [
                { l:'Backquote', w:1 },{ l:'Digit1', w:1 },{ l:'Digit2', w:1 },{ l:'Digit3', w:1 },
                { l:'Digit4', w:1 },{ l:'Digit5', w:1 },{ l:'Digit6', w:1 },{ l:'Digit7', w:1 },
                { l:'Digit8', w:1 },{ l:'Digit9', w:1 },{ l:'Digit0', w:1 },{ l:'Minus', w:1 },
                { l:'Equal', w:1 },{ l:'Backspace', w:1.6 }
            ],
            // Row 1: QWERTY
            [
                { l:'Tab', w:1.4 },{ l:'KeyQ', w:1 },{ l:'KeyW', w:1 },{ l:'KeyE', w:1 },
                { l:'KeyR', w:1 },{ l:'KeyT', w:1 },{ l:'KeyY', w:1 },{ l:'KeyU', w:1 },
                { l:'KeyI', w:1 },{ l:'KeyO', w:1 },{ l:'KeyP', w:1 },{ l:'BracketLeft', w:1 },
                { l:'BracketRight', w:1 },{ l:'Backslash', w:1.2 }
            ],
            // Row 2: ASDF
            [
                { l:'CapsLock', w:1.6 },{ l:'KeyA', w:1 },{ l:'KeyS', w:1 },{ l:'KeyD', w:1 },
                { l:'KeyF', w:1 },{ l:'KeyG', w:1 },{ l:'KeyH', w:1 },{ l:'KeyJ', w:1 },
                { l:'KeyK', w:1 },{ l:'KeyL', w:1 },{ l:'Semicolon', w:1 },{ l:'Quote', w:1 },
                { l:'Enter', w:1.8 }
            ],
            // Row 3: ZXCV
            [
                { l:'ShiftLeft', w:2.0 },{ l:'KeyZ', w:1 },{ l:'KeyX', w:1 },{ l:'KeyC', w:1 },
                { l:'KeyV', w:1 },{ l:'KeyB', w:1 },{ l:'KeyN', w:1 },{ l:'KeyM', w:1 },
                { l:'Comma', w:1 },{ l:'Period', w:1 },{ l:'Slash', w:1 },{ l:'ShiftRight', w:2.0 }
            ],
            // Row 4: Space row
            [
                { l:'ControlLeft', w:1.2 },{ l:'MetaLeft', w:1.0 },{ l:'AltLeft', w:1.0 },
                { l:'Space', w:5.6 },
                { l:'AltRight', w:1.0 },{ l:'MetaRight', w:1.0 },{ l:'ControlRight', w:1.2 }
            ]
        ];

        const keyboardFrontZ = 1.95;
        const keyboardBackZ = 2.85;
        const rowSpacing = rows.length > 1 ? (keyboardBackZ - keyboardFrontZ) / (rows.length - 1) : 0;

        rows.forEach((row, ri) => {
            // Calculate total row width to center it
            const totalW = row.reduce((sum, k) => sum + k.w * kw + gap, -gap);
            let cx = -totalW / 2;

            row.forEach((keyDef) => {
                const w = keyDef.w * kw;
                const x = cx + w / 2;
                cx += w + gap;

                // Key base (sides) — darker color
                const keyBaseGeo = RoundedBox(w - 0.008, kh, kd - 0.008, bevel, 2);
                const baseMat = new THREE.MeshStandardMaterial({ 
                    color: 0x1e1e1e, 
                    roughness: 0.6, 
                    metalness: 0.15 
                });
                const keyBase = new THREE.Mesh(keyBaseGeo, baseMat);
                const rowZ = keyboardFrontZ + ri * rowSpacing;
                keyBase.position.set(x, baseY, rowZ);
                keyBase.castShadow = true;
                kbGroup.add(keyBase);

                // Key cap top (the visible key surface) — lighter, slightly inset
                const keyCapGeo = RoundedBox(w - 0.025, 0.015, kd - 0.025, bevel * 0.6, 2);
                const isSpecialKey = keyDef.l.includes('Shift') || keyDef.l.includes('Control') || 
                                    keyDef.l.includes('Alt') || keyDef.l.includes('Meta') ||
                                    keyDef.l === 'Space' || keyDef.l === 'Enter' || 
                                    keyDef.l === 'Tab' || keyDef.l === 'CapsLock' ||
                                    keyDef.l === 'Backspace';
                const capColor = isSpecialKey ? 0x2a2a2a : 0x353535;
                const capMat = new THREE.MeshStandardMaterial({ 
                    color: capColor, 
                    roughness: 0.45, 
                    metalness: 0.12,
                    emissive: 0x00ff41,
                    emissiveIntensity: Math.random() > 0.85 ? 0.04 : 0.0
                });
                const keyCap = new THREE.Mesh(keyCapGeo, capMat);
                keyCap.position.set(x, baseY + kh / 2 + 0.008, rowZ);
                keyCap.castShadow = true;
                kbGroup.add(keyCap);

                // Add subtle key character indication (small raised bump for tactile feel on F and J)
                if (keyDef.l === 'KeyF' || keyDef.l === 'KeyJ') {
                    const bumpGeo = new THREE.BoxGeometry(0.04, 0.004, 0.008);
                    const bumpMat = new THREE.MeshStandardMaterial({ color: 0x454545, roughness: 0.4 });
                    const bump = new THREE.Mesh(bumpGeo, bumpMat);
                    bump.position.set(x, baseY + kh / 2 + 0.018, rowZ + 0.04);
                    kbGroup.add(bump);
                }

                // Group key base and cap for animation
                const keyGroup = new THREE.Group();
                keyGroup.add(keyBase.clone());
                keyGroup.position.set(0, 0, 0);

                const idx = keyMeshes.length;
                keyMeshes.push(keyBase);
                keyOriginalY.push(baseY);
                keyAnimState.push(0);

                // Map this key code to its mesh index
                keyMap[keyDef.l] = idx;
            });
        });

        // Also map some common e.key values that differ from e.code
        const keyAlias = {
            ' ': 'Space', 'Enter': 'Enter', 'Tab': 'Tab', 'Backspace': 'Backspace',
            'Shift': 'ShiftLeft', 'Control': 'ControlLeft', 'Alt': 'AltLeft', 'Meta': 'MetaLeft',
            'CapsLock': 'CapsLock', 'Escape': 'Backquote',
            'a':'KeyA','b':'KeyB','c':'KeyC','d':'KeyD','e':'KeyE','f':'KeyF','g':'KeyG',
            'h':'KeyH','i':'KeyI','j':'KeyJ','k':'KeyK','l':'KeyL','m':'KeyM','n':'KeyN',
            'o':'KeyO','p':'KeyP','q':'KeyQ','r':'KeyR','s':'KeyS','t':'KeyT','u':'KeyU',
            'v':'KeyV','w':'KeyW','x':'KeyX','y':'KeyY','z':'KeyZ',
            'A':'KeyA','B':'KeyB','C':'KeyC','D':'KeyD','E':'KeyE','F':'KeyF','G':'KeyG',
            'H':'KeyH','I':'KeyI','J':'KeyJ','K':'KeyK','L':'KeyL','M':'KeyM','N':'KeyN',
            'O':'KeyO','P':'KeyP','Q':'KeyQ','R':'KeyR','S':'KeyS','T':'KeyT','U':'KeyU',
            'V':'KeyV','W':'KeyW','X':'KeyX','Y':'KeyY','Z':'KeyZ',
            '1':'Digit1','2':'Digit2','3':'Digit3','4':'Digit4','5':'Digit5',
            '6':'Digit6','7':'Digit7','8':'Digit8','9':'Digit9','0':'Digit0',
            '!':'Digit1','@':'Digit2','#':'Digit3','$':'Digit4','%':'Digit5',
            '^':'Digit6','&':'Digit7','*':'Digit8','(':'Digit9',')':'Digit0',
            '-':'Minus','_':'Minus','=':'Equal','+':'Equal',
            '[':'BracketLeft','{':'BracketLeft',']':'BracketRight','}':'BracketRight',
            '\\':'Backslash','|':'Backslash',';':'Semicolon',':':'Semicolon',
            "'": 'Quote', '"':'Quote', ',':'Comma','<':'Comma','.':'Period','>':'Period',
            '/':'Slash','?':'Slash','`':'Backquote','~':'Backquote',
            'ArrowUp':'Slash','ArrowDown':'Period','ArrowLeft':'Comma','ArrowRight':'Slash',
        };
        for (const [alias, code] of Object.entries(keyAlias)) {
            if (keyMap[code] !== undefined && keyMap[alias] === undefined) {
                keyMap[alias] = keyMap[code];
            }
        }

        scene.add(kbGroup);
    }

    /* ═══════════════════════════════════════
       MOUSE — smooth ergonomic shape
       ═══════════════════════════════════════ */
    function createMouse() {
        const mouseGroup = new THREE.Group();
        const mouseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.45, metalness: 0.2 });

        // Mouse body — ellipsoid (squished sphere)
        const bodyGeo = new THREE.SphereGeometry(1, 24, 16);
        bodyGeo.scale(0.16, 0.075, 0.24);
        const body = new THREE.Mesh(bodyGeo, mouseMat);
        body.position.set(0, 0.075, 0);
        body.castShadow = true;
        mouseGroup.add(body);

        // Flat bottom cut — a thin disc under
        const bottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.15, 0.015, 20),
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })
        );
        bottom.position.set(0, 0.008, 0);
        mouseGroup.add(bottom);

        // Left click button
        const btnGeo = new THREE.SphereGeometry(1, 16, 8, 0, Math.PI);
        btnGeo.scale(0.07, 0.01, 0.11);
        const leftBtn = new THREE.Mesh(btnGeo, new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.25 }));
        leftBtn.position.set(-0.04, 0.135, -0.05);
        mouseGroup.add(leftBtn);

        // Right click button
        const rightBtn = leftBtn.clone();
        rightBtn.position.set(0.04, 0.135, -0.05);
        mouseGroup.add(rightBtn);

        // Divider line between buttons
        const divider = new THREE.Mesh(
            new THREE.BoxGeometry(0.005, 0.012, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 })
        );
        divider.position.set(0, 0.138, -0.05);
        mouseGroup.add(divider);

        // Scroll wheel — small torus
        const wheel = new THREE.Mesh(
            new THREE.TorusGeometry(0.018, 0.006, 8, 16),
            new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.3, metalness: 0.4 })
        );
        wheel.position.set(0, 0.145, -0.06);
        wheel.rotation.x = Math.PI / 2;
        mouseGroup.add(wheel);

        // Mouse cable (curved tube going back)
        const cablePoints = [
            new THREE.Vector3(0, 0.05, -0.22),
            new THREE.Vector3(0, 0.08, -0.45),
            new THREE.Vector3(-0.1, 0.04, -0.7),
            new THREE.Vector3(-0.2, 0.02, -1.0),
        ];
        const cableCurve = new THREE.CatmullRomCurve3(cablePoints);
        const cableMesh = new THREE.Mesh(
            new THREE.TubeGeometry(cableCurve, 20, 0.012, 6, false),
            new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.7 })
        );
        mouseGroup.add(cableMesh);

        mouseGroup.position.set(2.5, 0.09, 2.0);
        scene.add(mouseGroup);

        // Mouse pad — rounded rectangle
        const padGeo = RoundedBox(1.1, 0.02, 1.0, 0.04, 2);
        const pad = new THREE.Mesh(padGeo, new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.92 }));
        pad.position.set(2.5, 0.08, 2.0);
        pad.receiveShadow = true;
        scene.add(pad);
    }

    /* ═══════════════════════════════════════
       ENVIRONMENT
       ═══════════════════════════════════════ */
    function createEnvironment() {
        // Coffee mug — cylinder with handle torus
        const mugMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.38, metalness: 0.3 });
        const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.38, 24), mugMat);
        mugBody.position.set(3.4, 0.28, 0.7);
        mugBody.castShadow = true;
        scene.add(mugBody);

        // Mug inside (darker top)
        const mugInside = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.04, 20),
            new THREE.MeshStandardMaterial({ color: 0x1a0800, roughness: 0.9 })
        );
        mugInside.position.set(3.4, 0.46, 0.7);
        scene.add(mugInside);

        // Mug handle
        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI),
            mugMat
        );
        handle.position.set(3.55, 0.28, 0.7);
        handle.rotation.x = Math.PI / 2;
        handle.rotation.z = -Math.PI / 2;
        scene.add(handle);

        // Books stack — rounded
        const bookColors = [0x3a1111, 0x113a11, 0x11113a];
        bookColors.forEach((c, i) => {
            const bookGeo = RoundedBox(0.65, 0.1, 0.85, 0.02, 2);
            const book = new THREE.Mesh(bookGeo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
            book.position.set(-3.0, 0.14 + i * 0.11, 1.5);
            book.rotation.y = 0.12 * i;
            book.castShadow = true;
            scene.add(book);
        });

        // Pen — thin cylinder
        const pen = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.008, 0.55, 8),
            new THREE.MeshStandardMaterial({ color: 0x111144, roughness: 0.35, metalness: 0.3 })
        );
        pen.position.set(3.0, 0.1, 1.8);
        pen.rotation.z = Math.PI / 2;
        pen.rotation.y = 0.35;
        scene.add(pen);

        // Sticky note
        const note = new THREE.Mesh(
            new THREE.PlaneGeometry(0.32, 0.32),
            new THREE.MeshBasicMaterial({ color: 0x33220a, transparent: true, opacity: 0.6 })
        );
        note.position.set(1.7, 2.6, 0.88);
        note.rotation.y = 0.06;
        scene.add(note);

        // Wall
        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 22),
            new THREE.MeshStandardMaterial({ color: 0x080a08, roughness: 0.97 })
        );
        wall.position.set(0, 5, -6);
        scene.add(wall);
    }

    /* ═══════════════════════════════════════
       PARTICLES
       ═══════════════════════════════════════ */
    function createParticles() {
        const N = 280;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 28;
            pos[i * 3 + 1] = Math.random() * 14 - 3;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const ptsMat = new THREE.PointsMaterial({
            color: 0x00ff41, size: 0.03, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending
        });
        const pts = new THREE.Points(geo, ptsMat);
        scene.add(pts);
        particles.push({ pts, N });
    }

    /* ═══════════════════════════════════════
       ANIMATION LOOP
       ═══════════════════════════════════════ */
    function animate() {
        animationId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Mouse parallax disabled — keep computer static for usability
        // computerGroup stays at its initial rotation

        // Screen pulse
        if (screenMesh) {
            screenMesh.material.emissiveIntensity = 0.18 + Math.sin(t * 1.5) * 0.04;
        }

        tickKeys();

        // Particles - update every 3 frames to reduce CPU load
        frameCount++;
        if (frameCount % 3 === 0) {
            particles.forEach(p => {
                const arr = p.pts.geometry.attributes.position.array;
                for (let i = 0; i < p.N; i++) {
                    arr[i * 3 + 1] += Math.sin(t + i * 0.5) * 0.0008;
                    arr[i * 3]     += Math.cos(t * 0.3 + i) * 0.0004;
                }
                p.pts.geometry.attributes.position.needsUpdate = true;
                p.pts.rotation.y = t * 0.012;
            });
        }

        renderer.render(scene, camera);
        
        // Only sync overlay every 5 frames instead of every frame (huge performance boost)
        if (frameCount % 5 === 0) {
            syncOverlay();
        }
    }

    /* ═══════════════════════════════════════
       KEY ANIMATION — correct key mapping
       ═══════════════════════════════════════ */
    function onKeyDown(e) {
        // Try e.code first (most reliable), then e.key
        let idx = keyMap[e.code];
        if (idx === undefined) idx = keyMap[e.key];
        if (idx === undefined) {
            // Fallback: press a random key if unmapped
            idx = Math.floor(Math.random() * keyMeshes.length);
        }
        triggerKeyPress(idx);

        // For shift/ctrl combos, also press the modifier
        if (e.shiftKey) {
            const si = keyMap['ShiftLeft'];
            if (si !== undefined) triggerKeyPress(si);
        }
        if (e.ctrlKey) {
            const ci = keyMap['ControlLeft'];
            if (ci !== undefined) triggerKeyPress(ci);
        }
    }

    function triggerKeyPress(idx) {
        if (idx < 0 || idx >= keyMeshes.length) return;
        if (keyAnimState[idx] !== 0) return; // already animating
        keyAnimState[idx] = 1.0;
        keyMeshes[idx]._savedMat = keyMeshes[idx].material;
        keyMeshes[idx].material = keyPressedMat;
    }

    function tickKeys() {
        const speed = 0.11;
        for (let i = 0; i < keyMeshes.length; i++) {
            if (keyAnimState[i] <= 0) continue;
            const mesh = keyMeshes[i];
            const origY = keyOriginalY[i];

            if (keyAnimState[i] > 0.5) {
                mesh.position.y = origY - KEY_PRESS_DEPTH * ((1.0 - keyAnimState[i]) * 2);
                keyAnimState[i] -= speed;
                if (keyAnimState[i] <= 0.5) {
                    mesh.position.y = origY - KEY_PRESS_DEPTH;
                }
            } else {
                mesh.position.y = origY - KEY_PRESS_DEPTH * (keyAnimState[i] * 2);
                keyAnimState[i] -= speed * 0.55;
                if (keyAnimState[i] <= 0) {
                    keyAnimState[i] = 0;
                    mesh.position.y = origY;
                    if (mesh._savedMat) {
                        mesh.material = mesh._savedMat;
                        mesh._savedMat = null;
                    }
                }
            }
        }
    }

    /* ═══════════════════════════════════════
       SYNC HTML TERMINAL → 3D SCREEN
       ═══════════════════════════════════════ */
    function syncOverlay() {
        if (!camera || !renderer || !computerGroup) return;
        const el = document.getElementById('terminal-container');
        if (!el) return;

        const hw = SCREEN_W / 2;
        const hh = SCREEN_H / 2;

        const tl = new THREE.Vector3(-hw, SCREEN_CENTER_Y + hh, SCREEN_Z);
        const tr = new THREE.Vector3( hw, SCREEN_CENTER_Y + hh, SCREEN_Z);
        const bl = new THREE.Vector3(-hw, SCREEN_CENTER_Y - hh, SCREEN_Z);

        computerGroup.localToWorld(tl);
        computerGroup.localToWorld(tr);
        computerGroup.localToWorld(bl);

        tl.project(camera);
        tr.project(camera);
        bl.project(camera);

        const toScreen = v => ({
            x: ( v.x * 0.5 + 0.5) * window.innerWidth,
            y: (-v.y * 0.5 + 0.5) * window.innerHeight
        });

        const sTL = toScreen(tl);
        const sTR = toScreen(tr);
        const sBL = toScreen(bl);

        // Add small inset so text doesn't touch bezel edges
        const inset = 4;
        const left   = sTL.x + inset;
        const top    = sTL.y + inset;
        const width  = (sTR.x - sTL.x) - inset * 2;
        const height = (sBL.y - sTL.y) - inset * 2;

        el.style.left   = left + 'px';
        el.style.top    = top + 'px';
        el.style.width  = width + 'px';
        el.style.height = height + 'px';
    }

    /* ═══════════════════════════════════════
       EVENT HANDLERS
       ═══════════════════════════════════════ */
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        syncOverlay();
    }

    /* ═══════════════════════════════════════
       PUBLIC API
       ═══════════════════════════════════════ */
    function flashScreen() {
        if (!screenMesh) return;
        const orig = screenMesh.material.emissiveIntensity;
        screenMesh.material.emissive.setHex(0xffffff);
        screenMesh.material.emissiveIntensity = 1.5;
        setTimeout(() => {
            screenMesh.material.emissive.setHex(0x00ff41);
            screenMesh.material.emissiveIntensity = orig;
        }, 120);
    }

    function setScreenColor(hex) {
        if (!screenMesh) return;
        screenMesh.material.emissive.setHex(hex);
    }

    return { init, flashScreen, setScreenColor };
})();
