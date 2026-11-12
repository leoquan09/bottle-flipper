export default class NetworkManager {
    constructor(scene) {
        this.scene = scene;
        this.socket = io();
        this.initListeners();
    }

    initListeners() {
        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                if (players[id].playerId === this.socket.id) {
                    this.scene.addPlayer(players[id]);
                } else {
                    this.scene.addOtherPlayer(players[id]);
                }
            });
        });

        this.socket.on('newPlayer', (playerInfo) => {
            this.scene.addOtherPlayer(playerInfo);
        });

        this.socket.on('removePlayer', (playerId) => {
            this.scene.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });

        this.socket.on('playerMoved', (playerInfo) => {
            this.scene.otherPlayers.getChildren().forEach((otherPlayer) => {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        this.socket.on('enemyShot', (bulletInfo) => {
            this.scene.addEnemyBullet(bulletInfo.x, bulletInfo.y, bulletInfo.angle, bulletInfo.playerID);
        });

        this.socket.on('scoreUpdate', (data) => {
            let children = this.scene.otherPlayers.getChildren();
            children.forEach((child) => {
                if (child.playerId === data.id) {
                    child.kills = data.score;
                }
            });
            console.log(children);
        });
    }

    emitMovement(x, y) {
        this.socket.emit('playerMovement', { x, y });
    }

    emitShot(bulletData) {
        this.socket.emit('playerShot', bulletData);
    }

    emitScore(score) {
        this.socket.emit('playerScore', score);
    }
}
