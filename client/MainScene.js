import NetworkManager from './NetworkManager.js';
import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.network = new NetworkManager(this);
        this.otherPlayers = this.physics.add.group();

        this.enemyBullets = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
        });
    }

    

    addPlayer(playerInfo) {
        this.player = new Player(this, playerInfo.x, playerInfo.y, 0x00ff00, playerInfo.playerId);
        this.player.bullet.setFillStyle(0x00ff00);
        this.physics.add.overlap(this.player, this.otherPlayers, () => {
            this.player.x = playerInfo.x;
            this.player.y = playerInfo.y;
        });
    };

    addOtherPlayer(playerInfo) {
        const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, 0xff0000, playerInfo.playerId);
        otherPlayer.bullet.setFillStyle(0xff0000);

        this.otherPlayers.add(otherPlayer);
    };

    addEnemyBullet(x, y, angle, shooterId) {
        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            if (otherPlayer.playerId === shooterId) {
                if (otherPlayer.bullet.active) {
                    return
                }

                otherPlayer.bullet.resetPosition(x, y);
                otherPlayer.bullet.body.enable = true;
                otherPlayer.bullet.visible = true;
                otherPlayer.bullet.active = true;

                this.physics.velocityFromRotation(angle, 2500, otherPlayer.bullet.body.velocity);
            }
        });
    }


    update() {
        if (this.player) {
            const moved = this.player.move(this.cursors, this.wasd, this.scale.width, this.scale.height);
            const shot = this.player.shoot(this.cursors);

            if (moved) {
                this.network.emitMovement(this.player.x, this.player.y);
            }
            
            if (shot) {
                this.network.emitShot(shot);
            }
        }
        
    }
}
