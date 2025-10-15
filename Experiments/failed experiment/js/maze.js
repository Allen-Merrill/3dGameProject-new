mport * as THREE from 'three';

// --- Maze Definition ---
export const cellSize = 5; 
export const mazeMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 'S', 0, 'C', 0, 0, 0, 0, 0, 'X', 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 'C', 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export let walls = [];
export let collectibles = [];
export let exitDoor;
export let playerStart;

// --- Shared materials ---
const pathMaterial = new THREE.MeshPhongMaterial({ color: 0x3333ff }); // Blue path
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 }); // Dark floor
const coinMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const exitMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });

// --- Maze building ---
export function buildMaze(scene) {
    // Clear previous arrays
    walls.length = 0;
    collectibles.length = 0;
    exitDoor = null;

    const mazeHeight = mazeMap.length;
    const mazeWidth = mazeMap[0].length;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(mazeWidth * cellSize, mazeHeight * cellSize);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Maze cells
    for (let z = 0; z < mazeHeight; z++) {
        for (let x = 0; x < mazeWidth; x++) {
            const cell = mazeMap[z][x];
            const worldX = (x - mazeWidth / 2 + 0.5) * cellSize;
            const worldZ = (z - mazeHeight / 2 + 0.5) * cellSize;

            if (cell === 0 || cell === 'S' || cell === 'C' || cell === 'X') {
                // Highlight path
                const pathGeometry = new THREE.PlaneGeometry(cellSize, cellSize);
                const path = new THREE.Mesh(pathGeometry, pathMaterial);
                path.rotation.x = -Math.PI / 2;
                path.position.set(worldX, 0.01, worldZ); // Slightly above floor
                scene.add(path);
            }

            if (cell === 'C') {
                // Coin
                const geometry = new THREE.SphereGeometry(cellSize * 0.2, 16, 16);
                const coin = new THREE.Mesh(geometry, coinMaterial);
                coin.position.set(worldX, 0.5, worldZ);
                coin.userData.value = 10;
                scene.add(coin);
                collectibles.push(coin);
            }

            if (cell === 'S') playerStart = new THREE.Vector3(worldX, 0, worldZ);

            if (cell === 'X') {
                const geometry = new THREE.BoxGeometry(cellSize * 0.8, 0.2, cellSize * 0.8);
                exitDoor = new THREE.Mesh(geometry, exitMaterial);
                exitDoor.position.set(worldX, 0.1, worldZ);
                scene.add(exitDoor);
            }
        }
    }
}