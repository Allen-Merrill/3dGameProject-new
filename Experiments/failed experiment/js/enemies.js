import * as THREE from 'three';

export let enemies = [];

// Create an enemy at a position
export function createEnemy(scene, x, z) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);

    enemy.position.set(x, 1, z);
    enemy.userData = {
        initialX: x,
        moveRange: 5,
        moveDirection: Math.random() < 0.5 ? 1 : -1,
    };

    enemies.push(enemy);
    scene.add(enemy);
    return enemy;
}

// Update enemy positions (simple horizontal patrolling)
export function updateEnemies(delta) {
    const speed = 2;
    enemies.forEach(enemy => {
        enemy.position.x += enemy.userData.moveDirection * speed * delta;
        if (Math.abs(enemy.position.x - enemy.userData.initialX) > enemy.userData.moveRange) {
            enemy.userData.moveDirection *= -1;
        }
    });
}

// Check collision with player bounding box
export function checkPlayerCollision(playerBBox) {
    return enemies.some(enemy => {
        const enemyBBox = new THREE.Box3().setFromObject(enemy);
        return playerBBox.intersectsBox(enemyBBox);
    });
}

// Remove all enemies from the scene
export function clearEnemies(scene) {
    enemies.forEach(e => scene.remove(e));
    enemies.length = 0;
}
