export class Leaderboard extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.rowWidth = 240;
        this.rowHeight = 40;
        this.padding = 4;

        this.setScrollFactor(0);
        this.setDepth(100);
        this.setVisible(false);

        this.setupTabToggle();
        scene.add.existing(this);
    }

    setupTabToggle() {
        this.scene.input.keyboard.on('keydown-TAB', (event) => {
            event.preventDefault();
            this.refresh();
            this.setVisible(true);
        });

        this.scene.input.keyboard.on('keyup-TAB', () => {
            this.setVisible(false);
        });
    }

    destroy(fromScene) {
        if (this.scene && this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.off('keydown-TAB');
            this.scene.input.keyboard.off('keyup-TAB');
        }
        super.destroy(fromScene);
    }

    refresh() {
        this.removeAll(true);

        const allPlayers = [];

        // 1. Add local player
        const local = this.scene.player;
        if (local && local.active) {
            allPlayers.push({
                name: `${local.playerName || 'Player'} (You)`,
                kills: local.kills || 0,
                isLocal: true
            });
        }

        // 2. Add all remote players
        if (this.scene.otherPlayers) {
            this.scene.otherPlayers.getChildren().forEach((other) => {
                if (other.active) {
                    allPlayers.push({
                        name: other.playerName || 'Player',
                        kills: other.kills || 0,
                        isLocal: false
                    });
                }
            });
        }

        // 3. Sort highest kills to lowest
        allPlayers.sort((a, b) => b.kills - a.kills);

        // 4. Render rows
        allPlayers.forEach((p, index) => {
            const yPos = index * (this.rowHeight + this.padding);
            const bgColor = p.isLocal ? 0x0088ff : 0x004488;

            const bg = this.scene.add.rectangle(0, yPos, this.rowWidth, this.rowHeight, bgColor)
                .setOrigin(0, 0);

            const nameText = this.scene.add.text(10, yPos + this.rowHeight / 2, `${index + 1}. ${p.name}`, {
                fontSize: '16px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0, 0.5);

            const scoreText = this.scene.add.text(this.rowWidth - 10, yPos + this.rowHeight / 2, `${p.kills}`, {
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#ffdd00',
                fontFamily: 'Arial'
            }).setOrigin(1, 0.5);

            this.add([bg, nameText, scoreText]);
        });

        const totalHeight = allPlayers.length * (this.rowHeight + this.padding);
        this.setSize(this.rowWidth, totalHeight);
    }
}
