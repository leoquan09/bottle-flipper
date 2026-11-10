import Bullet from './bullet.js';

export default class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, color, playerId) {
        super(scene, x, y, 32, 32, color);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.playerId = playerId;
        this.speed = 4;
        this.pointer = scene.input.activePointer;
        
        this.bullet = new Bullet(scene, x, y, 0xB6B5B8); 
    }

    shoot(cursors) {
        if (this.bullet.active) {
            return false;
        };
        
        if (cursors.space.isDown) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.pointer.worldX, this.pointer.worldY);
            this.bullet.shoot(this.x, this.y, this.pointer.worldX, this.pointer.worldY);
            return {
                x: this.x,
                y: this.y,
                angle: angle
            };
        };

        return false;
    };

    move(cursors, wasd, sceneWidth, sceneHeight) {
        let moved = false;

        if (cursors.left.isDown || wasd.left.isDown) {
            this.x -= this.speed;
            moved = true;
        } else if (cursors.right.isDown || wasd.right.isDown) {
            this.x += this.speed;
            moved = true;
        }

        if (cursors.up.isDown || wasd.up.isDown) {
            this.y -= this.speed;
            moved = true;
        } else if (cursors.down.isDown || wasd.down.isDown) {
            this.y += this.speed;
            moved = true;
        }

        const halfSize = 16;
        this.x = Phaser.Math.Clamp(this.x, halfSize, sceneWidth - halfSize);
        this.y = Phaser.Math.Clamp(this.y, halfSize, sceneHeight - halfSize);

        return moved;
    }
}

