import * as THREE from 'three';

export const playerState = {
    radius: 0.5,
    height: 1.8,
    velocity: new THREE.Vector3(),
    canJump: true,
};

// Create an invisible player mesh for collision detection
export function createPlayerMesh(scene, startPos) {
    const geometry = new THREE.SphereGeometry(playerState.radius, 16, 16);
    const material = new THREE.MeshBasicMaterial({ visible: false });
    const player = new THREE.Mesh(geometry, material);
    player.position.copy(startPos);
    player.position.y = playerState.height;
    scene.add(player);
    return player;
}

// Setup movement controls
export function setupPlayerControls(controls, state, walls) {
    const move = { forward: false, backward: false, left: false, right: false };
    const speed = 5;
    const jumpStrength = 10;
    const gravity = -20;

    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': move.forward = true; break;
            case 'ArrowDown': case 'KeyS': move.backward = true; break;
            case 'ArrowLeft': case 'KeyA': move.left = true; break;
            case 'ArrowRight': case 'KeyD': move.right = true; break;
            case 'Space':
                if (state.canJump) {
                    state.velocity.y = jumpStrength;
                    state.canJump = false;
                }
                break;
        }
    });
    document.addEventListener('keyup', (e) => {
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': move.forward = false; break;
            case 'ArrowDown': case 'KeyS': move.backward = false; break;
            case 'ArrowLeft': case 'KeyA': move.left = false; break;
            case 'ArrowRight': case 'KeyD': move.right = false; break;
        }
    });

    state.update = (delta) => {
        state.velocity.y += gravity * delta;

        if (move.forward) controls.moveForward(speed * delta);
        if (move.backward) controls.moveForward(-speed * delta);
        if (move.left) controls.moveRight(-speed * delta);
        if (move.right) controls.moveRight(speed * delta);

        controls.getObject().position.y += state.velocity.y * delta;

        // Ground collision
        if (controls.getObject().position.y < state.height) {
            state.velocity.y = 0;
            controls.getObject().position.y = state.height;
            state.canJump = true;
        }
    };
}

// Called every frame
export function updatePlayer(delta, controls, state, walls) {
    if (state.update) state.update(delta);
    // Could add collision with obstacles here if needed
}
