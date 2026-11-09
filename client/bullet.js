export default class Bullet extends Phaser.GameObjects.Arc {
    constructor(scene, x, y, fillColor) {
        super(scene, x, y, 5, 0, 360, false, fillColor, 1);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(5);
        this.active = false;
        this.width = scene.sys.game.config.width;
        this.height = scene.sys.game.config.width;
    }

    resetPosition(x, y) {
        this.setPosition(x, y);
        this.body.reset(x, y);
    }

    shoot(x, y) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
        this.scene.physics.velocityFromRotation(angle, 2500, this.body.velocity);
        while (this.x < this.width && this.x > 0 && this.y < this.height && this.x > 0) {
            this.active = true;
        }
        this.active = false;
    }
}
