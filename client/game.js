class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        const self = this;
        
        this.socket = io();
        this.otherPlayers = this.add.group();

        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                if (players[id].playerId === self.socket.id) {
                    self.addPlayer(self, players[id]);
                } else {
                    self.addOtherPlayers(self, players[id]);
                }
            });
        });

        this.socket.on('newPlayer', (playerInfo) => {
            self.addOtherPlayers(self, playerInfo);
        });

        this.socket.on('removePlayer', (playerId) => {
            self.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });

        this.socket.on('playerMoved', (playerInfo) => {
            self.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    };

    addPlayer(self, playerInfo) {
        self.square = self.add.rectangle(playerInfo.x, playerInfo.y, 32, 32, 0x00ff00);
        self.square.playerId = playerInfo.playerId;
    };

    addOtherPlayers(self, playerInfo) {
        const otherPlayer = self.add.rectangle(playerInfo.x, playerInfo.y, 32, 32, 0xff0000);
        otherPlayer.playerId = playerInfo.playerId;
        self.otherPlayers.add(otherPlayer);
    };

    update() {
        if (this.square) {
            const speed = 4;
            let moved = false;

            if (this.cursors.left.isDown || this.wasd.left.isDown) {
                this.square.x -= speed;
                moved = true;
            } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
                this.square.x += speed;
                moved = true;
            }

            if (this.cursors.up.isDown || this.wasd.up.isDown) {
                this.square.y -= speed;
                moved = true;
            } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
                this.square.y += speed;
                moved = true;
            }

            // Screen boundaries clamping (accounting for half the 32x32 square size)
            const halfSize = 16; 
            this.square.x = Phaser.Math.Clamp(this.square.x, halfSize, this.scale.width - halfSize);
            this.square.y = Phaser.Math.Clamp(this.scale.height - halfSize, halfSize, this.scale.height - halfSize); // fixed bounds clamp reference

            if (moved) {
                this.socket.emit('playerMovement', { x: this.square.x, y: this.square.y });
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        debug: true
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#222222',
    roundPixels: true, // Crucial for snapping coordinates to whole pixels
    scene: [MainScene]
};

const game = new Phaser.Game(config);
