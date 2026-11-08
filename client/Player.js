export default class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, color, playerId) {
        super(scene, x, y, 32, 32, color);
        scene.add.existing(this);
        this.playerId = playerId;
        this.speed = 10;
    }

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
