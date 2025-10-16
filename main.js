import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { Player } from './game/player.js';
import { createPath } from './game/path.js';
//import { isBuildable } from './game/tower.js';
import { Enemy } from './game/enemy.js';

// Constants
const TILE_SIZE = 1;
const GRID_SIZE = 50;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // light blue sky

// Camera (slightly tilted for better view)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(20, 30, 20); // back and above
  camera.lookAt(0, 0, 0);

// Renderer
const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);


// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Ground
const groundGeometry = new THREE.BoxGeometry(GRID_SIZE, 1, GRID_SIZE);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -0.5; // so top of ground is at y=0
scene.add(ground);

const {pathTiles, tiles, grid, pathCoords} = createPath(scene);

// Use pathCoords directly for enemy movement
// Enemy wave logic
const enemies = [];
function spawnWave(numEnemies) {
  for (let i = 0; i < numEnemies; i++) {
    const enemy = new Enemy(pathCoords, scene);
    // Stagger spawn by offsetting their starting progress
    enemy.progress = -i * 0.5;
    enemies.push(enemy);
  }
}

spawnWave(5); // Spawn 5 enemies for the wave

// Player
const player = new Player();
player.mesh.position.y = 1; // raise above ground
scene.add(player.mesh);

// Player movement
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function handlePlayerMovement() {
  if (keys['w'] || keys['ArrowUp']) player.move('up');
  if (keys['s'] || keys['ArrowDown']) player.move('down');
  if (keys['a'] || keys['ArrowLeft']) player.move('left');
  if (keys['d'] || keys['ArrowRight']) player.move('right');
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  handlePlayerMovement();
  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    // Remove enemy if it reached the end
    if (enemies[i].currentStep >= enemies[i].pathCoords.length - 1) {
      scene.remove(enemies[i].mesh);
      enemies.splice(i, 1);
    }
  }
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
