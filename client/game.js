import MainScene from './MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,  
    height: 800, 
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#222222',
    pixelArt: true,
    roundPixels: true,
    scene: [MainScene]
};

const game = new Phaser.Game(config);
