export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        const finalScore = this.registry.get('lastScore') || 0;
        const highScore = localStorage.getItem('highscore') || 0;

        this.add.text(400, 200, 'Game Over', {fontSize: '50px', color: '#ff0000'}).setOrigin(0.5);
        this.add.text(400, 280, `Score: ${finalScore}`, {fontSize: '24px', color: '#ffffff'}).setOrigin(0.5);
        this.add.text(400, 320, `High Score: ${highScore}`, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

        const button = this.add.text(400, 420, 'Play Again', {
            fontSize: '32px',
            color: '#000',
            backgroundColor: '#fff',
            padding: { x: 10, y: 5}
        }).setOrigin(0.5).setInteractive({useHandCursor: true});

        button.on('pointerdown', () => {
            this.scene.stop('UIScene');     
            this.scene.stop('GameScene');
              
            this.scene.start('MenuScene');
          });
    }
}