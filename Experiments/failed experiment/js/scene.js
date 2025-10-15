// scene.js
import * as THREE from 'three';

export let scene, camera, renderer, controls;

export function initScene(containerId, playerHeight = 1.8) {
    const container = document.getElementById(containerId);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.y = playerHeight;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('gameCanvas') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    // PointerLockControls
    controls = new THREE.PointerLockControls(camera, document.body);

    // Lights
    addLights();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    return { scene, camera, renderer, controls };
}

function addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
}

// Animate loop
export function animate(updateCallback) {
    let prevTime = performance.now();

    function loop() {
        requestAnimationFrame(loop);
        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        // Call game-specific update logic (player, enemies, collectibles)
        if (updateCallback) updateCallback(delta);

        renderer.render(scene, camera);
        prevTime = time;
    }

    loop();
}

function onWindowResize() {
    const container = document.getElementById('game-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}