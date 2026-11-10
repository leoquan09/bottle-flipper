export default class Bullet extends Phaser.GameObjects.Arc {
    constructor(scene, x, y, fillColor) {
        super(scene, x, y, 5, 0, 360, false, fillColor, 1);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(5);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        this.deactivateBullet();

        scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this) {
                this.deactivateBullet(); 
            }
        });
    }

    deactivateBullet() {
        this.active = false;
        this.visible = false;
        this.body.enable = false;
        this.body.setVelocity(0, 0);
    }

    resetPosition(x, y) {
        this.setPosition(x, y);
        this.body.reset(x, y);
    }

    shoot(startX, startY, targetX, targetY) {
        this.resetPosition(startX, startY);
        this.body.enable = true;
        this.visible = true;
        this.active = true;

        const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
        
        this.scene.physics.velocityFromRotation(angle, 2500, this.body.velocity);
    }
}
