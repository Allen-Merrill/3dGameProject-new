//tower.js
const GRID_SIZE = 50;
const TILE_SIZE = 1;


import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export class Tower {
  constructor(x, y, scene) {
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.level = 1;
    this.mesh = null;
  }

  update(playerOrEnemies) {
    // overridden by subclasses
  }
}

export class HealerTower extends Tower {
  constructor(x, y, scene) {
    super(x, y, scene);
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set((x - GRID_SIZE/2) + 0.5, 0.5, (y - GRID_SIZE/2) + 0.5);
    scene.add(this.mesh);
  }

  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    if (Math.sqrt(dx*dx + dy*dy) <= 3) {
      player.health = Math.min(player.health + 0.05, player.maxHealth);
    }
  }
}

export class MageTower extends Tower {
  constructor(x, y, scene) {
    super(x, y, scene);
    const geometry = new THREE.ConeGeometry(0.5, 1, 12);
    const material = new THREE.MeshStandardMaterial({ color: 0x8000ff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set((x - GRID_SIZE/2) + 0.5, 0.5, (y - GRID_SIZE/2) + 0.5);
    scene.add(this.mesh);
  }

  update(enemies) {
    enemies.forEach(e => {
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      if (Math.sqrt(dx*dx + dy*dy) <= 3) {
        e.health -= 0.1;
      }
    });
  }
}

export class ArcherTower extends Tower {
  constructor(x, y, scene) {
    super(x, y, scene);
    const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set((x - GRID_SIZE/2) + 0.5, 0.5, (y - GRID_SIZE/2) + 0.5);
    scene.add(this.mesh);
  }

  update(enemies) {
    if (enemies.length === 0) return;
    let closest = enemies[0];
    let dist = Math.hypot(closest.x - this.x, closest.y - this.y);
    for (const e of enemies) {
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if (d < dist) {
        dist = d;
        closest = e;
      }
    }
    if (dist <= 4) closest.health -= 0.2;
  }
}
