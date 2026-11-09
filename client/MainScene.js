import NetworkManager from './NetworkManager.js';
import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.network = new NetworkManager(this);
        this.otherPlayers = this.physics.add.group();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    

    addPlayer(playerInfo) {
        this.player = new Player(this, playerInfo.x, playerInfo.y, 0x00ff00, playerInfo.playerId);
        this.physics.add.overlap(this.player, this.otherPlayers, () => {
            this.player.x = playerInfo.x;
            this.player.y = playerInfo.y;
        });
    };

    addOtherPlayer(playerInfo) {
        const otherPlayer = new Player(this, playerInfo.x, playerInfo.y, 0xff0000, playerInfo.playerId);
        this.otherPlayers.add(otherPlayer);
    };

    update() {
        if (this.player) {
            const moved = this.player.move(this.cursors, this.wasd, this.scale.width, this.scale.height);

            if (moved) {
                this.network.emitMovement(this.player.x, this.player.y);
            }
        }
        
    }
}
