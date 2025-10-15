import { initScene, animate, controls, scene } from './scene.js';
import { buildMaze, walls, playerStart, collectibles, exitDoor } from './maze.js';
import { createPlayerMesh, playerState, setupPlayerControls, updatePlayer } from './player.js';
import { createEnemy, updateEnemies, checkPlayerCollision, clearEnemies } from './enemies.js';
import { setupUI, updateScoreDisplay, showOverlay, hideAllOverlays } from './ui.js';

// --- Game State ---
let score = 0;
let gameStarted = false;
let isPaused = false;
let gameOver = false;
let player;

// --- Game Functions ---
function startGame() {
    gameStarted = true;
    isPaused = false;
    gameOver = false;
    score = 0;
    updateScoreDisplay(score);
    hideAllOverlays();
    controls.lock();
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) showOverlay(document.getElementById('pause-overlay'), true);
    else hideAllOverlays();
}

function endGame(won, message) {
    gameOver = true;
    isPaused = true;
    controls.unlock();
    const overlay = document.getElementById('game-over-overlay');
    showOverlay(overlay, true, message, won ? "You Won!" : "Game Over!");
}

function resetGame() {
    // Clear previous objects
    clearEnemies(scene);
    walls.forEach(w => scene.remove(w));
    walls.length = 0;
    collectibles.forEach(c => scene.remove(c));
    collectibles.length = 0;
    if (exitDoor) scene.remove(exitDoor);

    // Rebuild maze and objects
    buildMaze(scene);

    // Reset player
    if (player) scene.remove(player);
    player = createPlayerMesh(scene, playerStart);
    setupPlayerControls(controls, playerState, walls);

    // Reset state
    score = 0;
    gameStarted = false;
    isPaused = false;
    gameOver = false;
    updateScoreDisplay(score);
    hideAllOverlays();
    showOverlay(document.getElementById('instructions-overlay'), true);
}

// --- Initialize Scene ---
initScene('game-container');

// --- Build Maze ---
buildMaze(scene);

// --- Create Player ---
player = createPlayerMesh(scene, playerStart);
setupPlayerControls(controls, playerState, walls);

// --- Setup UI ---
setupUI({ startGame, togglePause, resetGame });

// --- Animation Loop ---
animate((delta) => {
    if (!(gameStarted && !isPaused && !gameOver)) return;

    // Update player
    updatePlayer(delta, controls, playerState, walls);

    // Update enemies
    updateEnemies(delta);

    // Collision with enemies
    const playerBBox = new THREE.Box3().setFromCenterAndSize(
        player.position,
        new THREE.Vector3(playerState.radius * 2, playerState.height, playerState.radius * 2)
    );
    if (checkPlayerCollision(playerBBox)) {
        endGame(false, "You were caught by an enemy! Game Over.");
    }

    // Collectibles
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const c = collectibles[i];
        const cBBox = new THREE.Box3().setFromObject(c);
        if (playerBBox.intersectsBox(cBBox)) {
            scene.remove(c);
            collectibles.splice(i, 1);
            score += c.userData.value;
            updateScoreDisplay(score);
        }
    }

    // Exit
    if (exitDoor) {
        const exitBBox = new THREE.Box3().setFromObject(exitDoor);
        if (playerBBox.intersectsBox(exitBBox)) {
            if (collectibles.length === 0) endGame(true, "You collected all items and reached the exit!");
            else showOverlay(document.getElementById('game-over-overlay'), true,
                `You need to collect all items (${collectibles.length} remaining)!`,
                "Exit Blocked!"
            );
        }
    }
});