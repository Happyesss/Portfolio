import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const leavesVS = /*glsl*/`
    uniform sampler2D uNoiseMap;
    uniform vec3 uBoxMin, uBoxSize, uRaycast;
    uniform float uTime;
    varying vec3 vObjectPos, vNormal, vWorldNormal; 
    varying float vCloseToGround;
    
    vec4 getTriplanar(sampler2D tex){
        vec4 xPixel = texture(tex, (vObjectPos.xy + uTime) / 3.);
        vec4 yPixel = texture(tex, (vObjectPos.yz + uTime) / 3.);
        vec4 zPixel = texture(tex, (vObjectPos.zx + uTime) / 3.);
        vec4 combined = (xPixel + yPixel + zPixel) / 6.0;
        combined.xyz = combined.xyz * vObjectPos; 
        return combined;
    }
    
    void main(){
        mat4 mouseDisplace = mat4(1.);
        vec3 vWorldPos = vec3(modelMatrix * instanceMatrix * mouseDisplace * vec4(position, 1.));
        vCloseToGround = clamp(vWorldPos.y, 0., 1.);
        float offset = clamp(0.8 - distance(uRaycast, instanceMatrix[3].xyz), 0., 999.); 
        offset = (pow(offset, 0.8) / 2.0) * vCloseToGround;
        mouseDisplace[3].xyz = vec3(offset);
        vNormal = normalMatrix * mat3(instanceMatrix) * mat3(mouseDisplace) * normalize(normal); 
        vWorldNormal = vec3(modelMatrix * instanceMatrix * mouseDisplace * vec4(normal, 0.));
        vObjectPos = ((vWorldPos - uBoxMin) * 2.) / uBoxSize - vec3(1.0); 
        vec4 noiseOffset = getTriplanar(uNoiseMap) * vCloseToGround; 
        vec4 newPos = instanceMatrix * mouseDisplace * vec4(position, 1.); 
        newPos.xyz = newPos.xyz + noiseOffset.xyz;
        gl_Position =  projectionMatrix * modelViewMatrix * newPos;
    }
`;

const leavesFS = /*glsl*/`
    #include <common> 
    #include <lights_pars_begin>
    uniform vec3 uColorA, uColorB, uColorC;
    uniform float uTime;
    varying vec3 vObjectPos, vNormal, vWorldNormal; 
    varying float vCloseToGround;
    
    vec3 mix3 (vec3 v1, vec3 v2, vec3 v3, float fa){
        vec3 m; 
        fa > 0.7 ? m = mix(v2, v3, (fa - .5) * 2.) : m = mix(v1, v2, fa * 2.);
        return m;
    }

    float getPosColors(){
        float p = 0.;
        p = smoothstep(0.2, 0.8, distance(vec3(0.), vObjectPos));
        p = p * (-(vWorldNormal.g / 2.) + 0.5) * (- vObjectPos.y / 9. + 0.5); 
        return p;
    }
    float getDiffuse(){
        float intensity;
        for (int i = 0; i < directionalLights.length(); i++){
            intensity = dot(directionalLights[i].direction, vNormal);
            intensity = smoothstep(0.55, 1., intensity) * 0.2 
                        + pow(smoothstep(0.55, 1., intensity), 0.5);
        }
        return intensity;
    }

    void main(){
        float gradMap = (getPosColors() + getDiffuse()) * vCloseToGround / 2. ;
        vec4 c = vec4(mix3(uColorA, uColorB, uColorC, gradMap), 1.0);
        gl_FragColor = vec4(pow(c.xyz,vec3(0.454545)), c.w);
    }
`;

// GENERAL DEFINITIONS
const scene = new THREE.Scene();

// Add skybox as scene background
const sky = new THREE.CubeTextureLoader()
    .setPath('https://threejs.org/examples/textures/cube/skyboxsun25deg/')
    .load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg']);
scene.background = sky;

const loader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.001, 1000);
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
const controls = new OrbitControls(camera, renderer.domElement);
const dummy = new THREE.Object3D();
const matrix = new THREE.Matrix4();
const pointer = new THREE.Vector2(); 
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Enhanced lighting
const dlight01 = new THREE.DirectionalLight(0xffeedd, 1.5);
dlight01.castShadow = true;
dlight01.shadow.mapSize.width = 2048;
dlight01.shadow.mapSize.height = 2048;
dlight01.shadow.camera.near = 0.5;
dlight01.shadow.camera.far = 50;
dlight01.shadow.camera.left = -20;
dlight01.shadow.camera.right = 20;
dlight01.shadow.camera.top = 20;
dlight01.shadow.camera.bottom = -20;
dlight01.shadow.bias = -0.001;

const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);

// Add fog for atmospheric perspective
scene.fog = new THREE.FogExp2(0xa0d0ff, 0.01);

const tree = {group: new THREE.Group()};
const noiseMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/ceramicSoda/treeshader/main/assets/noise.png');
const rayPlane = new THREE.Mesh(new THREE.PlaneGeometry(100,100,1,1), undefined);

// Ground with better texture
const groundGeometry = new THREE.CircleGeometry(20, 64);
const groundTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    map: groundTexture,
    roughness: 0.8
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Water puddle
const waterGeometry = new THREE.CircleGeometry(3, 32);
const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    metalness: 0.5
});
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.set(-2, 0.01, 4);
water.receiveShadow = true;
scene.add(water);

// Animated grass with wind effect
function createGrass() {
    const grassCount = 1000;
    const grassGeometry = new THREE.PlaneGeometry(0.4, 0.8);
    const grassTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/grass.png');
    grassTexture.colorSpace = THREE.SRGBColorSpace;
    const grassMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5
    });
    const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassCount);
    
    for (let i = 0; i < grassCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        dummy.position.set(x, 0, z);
        dummy.rotation.y = Math.random() * Math.PI * 2;
        dummy.rotation.x = -Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        dummy.scale.setScalar(0.5 + Math.random() * 0.7);
        dummy.updateMatrix();
        grass.setMatrixAt(i, dummy.matrix);
    }
    
    grass.instanceMatrix.needsUpdate = true;
    grass.castShadow = true;
    scene.add(grass);
    
    // Animate grass
    function animateGrass() {
        const time = clock.getElapsedTime();
        for (let i = 0; i < grassCount; i++) {
            grass.getMatrixAt(i, matrix);
            matrix.decompose(dummy.position, dummy.rotation, dummy.scale);
            
            // Add gentle wind movement
            dummy.rotation.z = Math.sin(time * 2 + i) * 0.1;
            dummy.updateMatrix();
            grass.setMatrixAt(i, dummy.matrix);
        }
        grass.instanceMatrix.needsUpdate = true;
        requestAnimationFrame(animateGrass);
    }
    animateGrass();
}

// Improved bushes with better shape
function createBushes() {
    const bushCount = 12;
    const bushGeometry = new THREE.SphereGeometry(0.8, 8, 8);
    const bushMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.9
    });
    
    for (let i = 0; i < bushCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 4 + Math.random() * 12;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        bush.position.set(x, 0.5, z);
        bush.scale.y = 0.5 + Math.random() * 0.7;
        bush.scale.x = bush.scale.z = 0.7 + Math.random() * 0.8;
        bush.castShadow = true;
        scene.add(bush);
        
        // Add some flowers around bushes
        if (Math.random() > 0.5) {
            createFlowerCluster(x, z);
        }
    }
}

// Flower clusters
function createFlowerCluster(x, z) {
    const flowerCount = 3 + Math.floor(Math.random() * 5);
    const flowerGeometry = new THREE.CircleGeometry(0.2, 5);
    const flowerColors = [0xff0000, 0xffff00, 0xff00ff, 0xffffff];
    
    for (let i = 0; i < flowerCount; i++) {
        const flowerMaterial = new THREE.MeshStandardMaterial({
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            side: THREE.DoubleSide
        });
        
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(
            x + (Math.random() - 0.5) * 2,
            0.05,
            z + (Math.random() - 0.5) * 2
        );
        flower.rotation.x = -Math.PI / 2;
        flower.scale.setScalar(0.5 + Math.random() * 0.5);
        scene.add(flower);
    }
}

// Rocks
function createRocks() {
    const rockCount = 10;
    const rockGeometry = new THREE.DodecahedronGeometry(0.3, 1);
    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        roughness: 0.8
    });
    
    for (let i = 0; i < rockCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 10;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, 0.1, z);
        rock.scale.setScalar(0.5 + Math.random());
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        scene.add(rock);
    }
}

// Enhanced bench with wood texture
function createBench() {
    const benchTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/wood/Wood049_1K_Color.jpg');
    benchTexture.colorSpace = THREE.SRGBColorSpace;
    const benchMaterial = new THREE.MeshStandardMaterial({ map: benchTexture, roughness: 0.7 });

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.6), benchMaterial);
    seat.position.set(3, 0.55, -2);
    seat.castShadow = true;
    scene.add(seat);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.12);
    const legs = [];
    const legPositions = [[2.6, 0.25, -2.25], [3.4, 0.25, -2.25], [2.6, 0.25, -1.75], [3.4, 0.25, -1.75]];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, benchMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        scene.add(leg);
        legs.push(leg);
    });
}


// Falling leaves particles
function createLeafParticles() {
    const leafCount = 100;
    const leafGeometry = new THREE.PlaneGeometry(0.2, 0.2);
    const leafTexture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/ceramicSoda/treeshader/main/assets/leaf.png');
    const leafMaterial = new THREE.MeshStandardMaterial({
        map: leafTexture,
        transparent: true,
        alphaTest: 0.5,
        side: THREE.DoubleSide
    });
    
    const leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, leafCount);
    const dummy = new THREE.Object3D();
    const positions = [];
    const velocities = [];
    const rotations = [];
    
    for (let i = 0; i < leafCount; i++) {
        positions.push({
            x: (Math.random() - 0.5) * 10,
            y: 5 + Math.random() * 10,
            z: (Math.random() - 0.5) * 10
        });
        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: -0.02 - Math.random() * 0.03,
            z: (Math.random() - 0.5) * 0.01
        });
        rotations.push({
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02
        });
        
        dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
        dummy.rotation.set(rotations[i].x, rotations[i].y, rotations[i].z);
        dummy.scale.setScalar(0.5 + Math.random() * 0.5);
        dummy.updateMatrix();
        leaves.setMatrixAt(i, dummy.matrix);
    }
    
    leaves.instanceMatrix.needsUpdate = true;
    leaves.castShadow = true;
    scene.add(leaves);
    
    // Animate leaves
    function animateLeaves() {
        for (let i = 0; i < leafCount; i++) {
            positions[i].x += velocities[i].x;
            positions[i].y += velocities[i].y;
            positions[i].z += velocities[i].z;
            
            rotations[i].x += rotations[i].speed;
            rotations[i].y += rotations[i].speed * 0.7;
            rotations[i].z += rotations[i].speed * 0.3;
            
            if (positions[i].y < 0) {
                positions[i].y = 5 + Math.random() * 10;
                positions[i].x = (Math.random() - 0.5) * 10;
                positions[i].z = (Math.random() - 0.5) * 10;
            }
            
            dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
            dummy.rotation.set(rotations[i].x, rotations[i].y, rotations[i].z);
            dummy.updateMatrix();
            leaves.setMatrixAt(i, dummy.matrix);
        }
        leaves.instanceMatrix.needsUpdate = true;
        requestAnimationFrame(animateLeaves);
    }
    animateLeaves();
}

// Day/night cycle
function setupDayNightCycle() {
    const skyColor = new THREE.Color(0xa0d0ff);
    const skyUniforms = {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    };
    
    const skyGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent)), 1.0);
            }
        `,
        side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    // Animate day/night cycle
    function updateDayNight() {
        // Start at day: phase offset PI/2
        const time = clock.getElapsedTime() * 0.05 + Math.PI / 2;
        const sunHeight = Math.sin(time);
        
        // Update sun position and intensity
        dlight01.position.set(
            Math.cos(time) * 20,
            Math.max(sunHeight * 20, 0.1),
            Math.sin(time) * 20
        );
        dlight01.intensity = Math.max(sunHeight * 1.5, 0.1);
        
        // Update ambient light
        ambientLight.intensity = Math.max(sunHeight * 0.7, 0.1);
        
        // Update sky color
        if (sunHeight > 0) {
            skyUniforms.topColor.value.setHSL(0.6, 0.7, 0.5 + sunHeight * 0.3);
            skyUniforms.bottomColor.value.setHSL(0.6, 0.7, 0.8 + sunHeight * 0.2);
            scene.fog.color.setHSL(0.6, 0.5, 0.7 + sunHeight * 0.3);
            // Set day gradient on body
            document.body.classList.add("day-gradient");
            document.body.classList.remove("night-gradient");
        } else {
            skyUniforms.topColor.value.setHSL(0.6, 0.5, 0.1);
            skyUniforms.bottomColor.value.setHSL(0.6, 0.5, 0.3);
            scene.fog.color.setHSL(0.6, 0.3, 0.2);
            // Set night gradient on body
            document.body.classList.add("night-gradient");
            document.body.classList.remove("day-gradient");
        }
        
        requestAnimationFrame(updateDayNight);
    }
    updateDayNight();
}

// MATERIALS
const leavesMat = new THREE.ShaderMaterial({
    lights: true,
    side: THREE.DoubleSide,
    uniforms: {
        ...THREE.UniformsLib.lights,
        uTime: {value: 0.},
        uColorA: {value: new THREE.Color(0xb45252)},
        uColorB: {value: new THREE.Color(0xd3a068)},
        uColorC: {value: new THREE.Color(0xede19e)},
        uBoxMin: {value: new THREE.Vector3(0,0,0)},
        uBoxSize: {value: new THREE.Vector3(10,10,10)},
        uRaycast: {value: new THREE.Vector3(0,0,0)},
        uNoiseMap: {value: noiseMap},
    },
    vertexShader: leavesVS,
    fragmentShader: leavesFS,
});

// GLTF LOADING 
loader.loadAsync("https://raw.githubusercontent.com/ceramicSoda/treeshader/main/assets/tree.glb")
    .then(obj => {
        document.getElementById("previewHack").style.display = "none";
        tree.pole = obj.scene.getObjectByName("Pole");
        tree.pole.material = new THREE.MeshStandardMaterial({
            map: tree.pole.material.map,
            roughness: 0.8
        });
        tree.pole.castShadow = true;
        
        tree.crown = obj.scene.getObjectByName("Leaves");
        tree.bbox = new THREE.Box3().setFromObject(tree.crown);
        leavesMat.uniforms.uBoxMin.value.copy(tree.bbox.min); 
        leavesMat.uniforms.uBoxSize.value.copy(tree.bbox.getSize(new THREE.Vector3())); 
        tree.leavesCount = tree.crown.geometry.attributes.position.count;
        tree.whenDied = new Array(tree.leavesCount);
        tree.deadID = []; 
        tree.leafGeometry = obj.scene.getObjectByName("Leaf").geometry; 
        tree.leaves = new THREE.InstancedMesh(tree.leafGeometry, leavesMat, tree.leavesCount); 
        
        for (let i = 0; i < tree.leavesCount; i++) { 
            dummy.position.x = tree.crown.geometry.attributes.position.array[i*3];
            dummy.position.y = tree.crown.geometry.attributes.position.array[i*3+1];
            dummy.position.z = tree.crown.geometry.attributes.position.array[i*3+2];
            dummy.lookAt(dummy.position.x + tree.crown.geometry.attributes.normal.array[i*3],
                        dummy.position.y + tree.crown.geometry.attributes.normal.array[i*3+1],
                        dummy.position.z + tree.crown.geometry.attributes.normal.array[i*3+2]);
            dummy.scale.x = (Math.random() * 0.2 + 0.8);
            dummy.scale.y = (Math.random() * 0.2 + 0.8);
            dummy.scale.z = (Math.random() * 0.2 + 0.8);
            dummy.updateMatrix();
            tree.leaves.setMatrixAt(i, dummy.matrix);
        }
        
        tree.leaves.castShadow = true;
        tree.group.add(tree.pole, tree.leaves);
        for (let i = 0; i < 24; i++)
            tree.deadID.push(Math.floor(Math.random() * tree.leavesCount)); 
        
        // Add additional nature elements after tree loads
        createGrass();
        createBushes();
        createBench();
        createRocks();
        createLeafParticles();
        setupDayNightCycle();
        createWoodenBoards();
    });

// INIT
document.body.appendChild(renderer.domElement); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

dlight01.position.set(3,6,-3);
dlight01.lookAt(0,2.4,0);
scene.add(dlight01, ambientLight, hemisphereLight);

rayPlane.visible = false;
camera.position.set(-7,1,-12);
controls.target = new THREE.Vector3(0,2.4,0);
controls.maxPolarAngle = Math.PI * 0.5; 
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// --- Mobile touch controls support ---
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
if (isMobile()) {
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
    };
    // Prevent page scroll while touching canvas
    renderer.domElement.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
} else {
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.touches = {TWO: THREE.TOUCH.ROTATE};
}
// -------------------------------------

scene.add(tree.group, rayPlane);

noiseMap.wrapS = THREE.RepeatWrapping;
noiseMap.wrapT = THREE.RepeatWrapping;

// MAIN LOOP
animate();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    
    leavesMat.uniforms.uTime.value += delta; 

    if (tree.deadID){
        tree.deadID = tree.deadID.map(i => {
            tree.leaves.getMatrixAt(i, matrix);
            matrix.decompose(dummy.position, dummy.rotation, dummy.scale);
            if (dummy.position.y > 0) {
                dummy.position.y -= 0.04 * delta * 60;
                dummy.position.x += (Math.random()/5 - 0.11) * delta * 60;
                dummy.position.z += (Math.random()/5 - 0.11) * delta * 60;
                dummy.rotation.x += 0.2 * delta * 60;
                dummy.updateMatrix();
                tree.leaves.setMatrixAt(i, dummy.matrix);
                return(i);
            }
        });
        tree.leaves.instanceMatrix.needsUpdate = true; 
    } 

    controls.update(); 
    renderer.render(scene, camera); 
}

// EVENTS
function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}
window.addEventListener("resize", resizeRenderer);
window.addEventListener("orientationchange", resizeRenderer);

// Touch support for pointer events
function getPointerEventCoords(e) {
    if (e.touches && e.touches.length > 0) {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    return {
        x: e.clientX,
        y: e.clientY
    };
}

document.addEventListener("mousemove", (e) => pointerMove(e));
document.addEventListener("touchmove", (e) => {
    pointerMove(e);
    e.preventDefault();
}, { passive: false });

function pointerMove(e) {
    const coords = getPointerEventCoords(e);
    pointer.set(
        (coords.x / window.innerWidth) * 2 - 1,
        -(coords.y / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects([tree.leaves, rayPlane]);
    if (intersects[0]){
        rayPlane.position.copy(intersects[0].point);
        rayPlane.position.multiplyScalar(0.9);
        rayPlane.lookAt(camera.position);
        leavesMat.uniforms.uRaycast.value = intersects[0].point;
        if (Math.random()*5 > 3)
            tree.deadID.push(intersects[0].instanceId);
    }
}

// Add this function before GLTF LOADING
function createWoodenBoards() {
    const boardData = [
        { label: "Projects", position: [5, 1.2, -3], rotationY: -Math.PI / 1, side: "front", link: "../../index.html#projects" },
        { label: "Resume", position: [-4, 1.2, -4], rotationY: Math.PI / 1, side: "front", link: "https://drive.google.com/file/d/1f9dMRt3bONFLbC_42r_44Bdl3NwlgcBL/view?usp=sharing" },
        { label: "Contact", position: [2, 1.2, 6], rotationY: Math.PI / 2.5, side: "front", link: "../../index.html#contact" },
        { label: "About Me", position: [-6, 1.2, 2], rotationY: -Math.PI / 2.5, side: "front", link: "../../index.html#about-me" }
    ];
    const boards = [];
    const loader = new THREE.TextureLoader();
    const woodTexture = loader.load('https://threejs.org/examples/textures/wood/Wood049_1K_Color.jpg');
    woodTexture.colorSpace = THREE.SRGBColorSpace;
    const boardMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.7 });

    boardData.forEach((data, idx) => {
        // Board geometry
        const board = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 1, 0.15),
            boardMaterial
        );
        board.position.set(...data.position);
        board.rotation.y = data.rotationY;
        board.castShadow = true;
        board.userData.label = data.label;
        board.userData.link = data.link;
        scene.add(board);
        boards.push(board);

        // Create canvas for text
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#e6cfa7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "#5a3c1b";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (data.side === "back") {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.fillText(data.label, canvas.width / 2, canvas.height / 2);
            ctx.restore();
        } else {
            ctx.fillText(data.label, canvas.width / 2, canvas.height / 2);
        }

        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.colorSpace = THREE.SRGBColorSpace;
        const textMat = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
        const textMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 0.7),
            textMat
        );

        if (data.side === "back") {
            textMesh.position.set(0, 0, -0.09);
            textMesh.rotation.y = Math.PI;
        } else {
            textMesh.position.set(0, 0, 0.09);
        }
        board.add(textMesh);

        // Add two wooden legs
        const legGeometry = new THREE.BoxGeometry(0.12, 1.1, 0.12);
        const legMaterial = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.7 });
        const legOffsetX = 0.8;
        const legOffsetY = -0.55;
        const legOffsetZ = 0.0;
        for (let lx of [-legOffsetX, legOffsetX]) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(lx, legOffsetY, legOffsetZ);
            leg.castShadow = true;
            board.add(leg);
        }
    });

    // Cursor pointer on hover
    renderer.domElement.addEventListener('pointermove', function (event) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(boards, false);
        if (intersects.length > 0) {
            renderer.domElement.style.cursor = 'pointer';
        } else {
            renderer.domElement.style.cursor = '';
        }
    });

    // Add click interaction
    renderer.domElement.addEventListener('pointerdown', function (event) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(boards, false);
        if (intersects.length > 0) {
            const label = intersects[0].object.userData.label;
            const link = intersects[0].object.userData.link;
            if (label === "Resume") {
                window.open(link, "_blank");
            } else if (link && link.startsWith("#")) {
                window.open(window.location.origin + window.location.pathname + link, "_self");
            } else if (link) {
                window.open(link, "_blank");
            } else {
                console.log("Clicked board:", label);
            }
        }
    });

    // Add touch support for board clicks
    renderer.domElement.addEventListener('touchstart', function (event) {
        const xy = getPointerXY(event);
        pointer.x = xy.x;
        pointer.y = xy.y;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(boards, false);
        if (intersects.length > 0) {
            const label = intersects[0].object.userData.label;
            const link = intersects[0].object.userData.link;
            if (label === "Resume") {
                window.open(link, "_blank");
            } else if (link && link.startsWith("#")) {
                window.open(window.location.origin + window.location.pathname + link, "_self");
            } else if (link) {
                window.open(link, "_blank");
            } else {
                console.log("Clicked board:", label);
            }
        }
    }, { passive: false });
}
