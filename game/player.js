import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export class Player {
    constructor(camera, bounds = null, defaultBaseDamage = 4) {
        this.camera = camera; // store the camera reference for first-person usage

        // Player mesh
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.speed = 0.2;
        this.bounds = bounds;

         // Sword mesh (grouped: blade + hilt) parented to camera
         this.sword = new THREE.Group();
         // Blade: a thin long box
         const bladeGeo = new THREE.BoxGeometry(0.06, 0.02, 1.1);
         const bladeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeff, metalness: 0.9, roughness: 0.05, emissive: 0x111111 });
         bladeMat.depthTest = false; // render on top to avoid near-plane clipping issues
         bladeMat.side = THREE.DoubleSide;
         const blade = new THREE.Mesh(bladeGeo, bladeMat);
         blade.position.set(0, 0, -0.55); // blade extends forward from hilt
         // Hilt: small cylinder
         const hiltGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8);
         const hiltMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.4, roughness: 0.6 });
         hiltMat.depthTest = false;
         const hilt = new THREE.Mesh(hiltGeo, hiltMat);
         hilt.rotation.x = Math.PI / 2;
         hilt.position.set(0, -0.02, 0.05);
         this.sword.add(blade);
         this.sword.add(hilt);
         this.camera.add(this.sword);
         // position the whole sword relative to the camera (first-person hold)
         // move slightly more forward so it's comfortably visible in most FOVs
         this.swordRestPosition = new THREE.Vector3(0.35, -0.55, -0.6);
         this.sword.position.copy(this.swordRestPosition);
         this.sword.visible = true;
         this.sword.position.copy(this.swordRestPosition);
         this.sword.rotation.set(0, 0, 0);

        // Swing properties
        this.swordCooldown = 0.5; // seconds
        this.lastSwingTime = 0;
        this.swingDuration = 0.2; 
        this.swordRange = 5;
    // Canonical melee damage value (single source of truth). Initialised from caller.
    this.baseDamage = defaultBaseDamage;

        // Swing state
        this.swinging = false;
        this.swingElapsed = 0;

        // Enemies reference (set in main)
        this.enemies = [];

    }

    move(direction) {
        switch(direction) {
            case 'up': this.mesh.position.z -= this.speed; break;
            case 'down': this.mesh.position.z += this.speed; break;
            case 'left': this.mesh.position.x -= this.speed; break;
            case 'right': this.mesh.position.x += this.speed; break;
        }
        this.clampPosition();
    }

    clampPosition() {
        if (!this.bounds) return;
        const b = this.bounds;
        if (this.mesh.position.x < b.minX) this.mesh.position.x = b.minX;
        if (this.mesh.position.x > b.maxX) this.mesh.position.x = b.maxX;
        if (this.mesh.position.z < b.minZ) this.mesh.position.z = b.minZ;
        if (this.mesh.position.z > b.maxZ) this.mesh.position.z = b.maxZ;
    }

    startSwing() {
        const currentTime = performance.now() / 1000;
        if (currentTime - this.lastSwingTime < this.swordCooldown) return;

        this.lastSwingTime = currentTime;
        this.swinging = true;
        this.swingElapsed = 0;

    // Damage enemies immediately. Read the canonical `baseDamage` value.
    const dmg = Number.isFinite(this.baseDamage) ? this.baseDamage : 4;
        this.enemies.forEach(e => {
            const dx = e.mesh.position.x - this.mesh.position.x;
            const dz = e.mesh.position.z - this.mesh.position.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            if (dist <= this.swordRange) {
                e.takeDamage(dmg);
            }
        });
    }

    update(delta) {
        if (this.swinging) {
            this.swingElapsed += delta;
            const t = this.swingElapsed / this.swingDuration;
            if (t >= 1) {
                this.sword.rotation.y = 0;
                // restore to resting position
                this.sword.position.copy(this.swordRestPosition);
                this.swinging = false;
            } else {
                const startRot = -Math.PI / 4;
                const endRot = Math.PI / 4;
                this.sword.rotation.y = startRot + Math.sin(t * Math.PI) * (endRot - startRot);
                // animate a small forward/back offset relative to resting position
                const dz = Math.sin(t * Math.PI) * 0.5;
                const pos = this.swordRestPosition.clone();
                pos.z += dz;
                this.sword.position.copy(pos);
            }
        }
    }
}
