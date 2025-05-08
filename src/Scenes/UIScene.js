export default class UIScene extends Phaser.Scene {
    constructor() {
        super( {key:'UIScene'});
    }

    create() {
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.gameScene = this.scene.get('GameScene');
        this.score = 0;
        this.health = 100;

        this.level = 1;
        
        
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '18px', color: '#ffffff'});
        this.levelText = this.add.text(16, 40, 'Level: 1', {fontSize: '18px', color: '#ffffff'});
        this.bar = this.add.graphics();
        
        if (this.gameScene) {
            this.gameScene.events.on('update-level', this.updateLevel, this);
            this.gameScene.events.on('update-score', this.updateScore, this);
            this.gameScene.events.on('player-hurt', this.updateHealth, this);
            this.gameScene.events.on('destroyBar', this.destroyBar, this);
        }

        this.drawHealthBar();
        
    }

    updateLevel(level) {
        console.log("gotcha");
        if (this.levelText && this.levelText.setText) this.levelText.setText('Level: ' + level);
        
    }

    destroyBar() {
        this.bar.destroy();
    }

    updateScore(points) {
        this.score += points;
        if (this.scoreText) this.scoreText.setText('Score: ' + this.score);
        this.gameScene.registry.set('lastScore', this.score);
       
        const hs = localStorage.getItem('highscore') || 0;
        if (this.score > hs){
            localStorage.setItem('highscore', this.score);
        }
    }

    updateHealth(damage){
        this.health -= damage;
        if (this.health <= 0) {
            this.gameScene.registry.set('lastScore', this.score);
            this.scene.stop('GameScene');
            this.scene.stop('UIScene');
            this.scene.start('GameOverScene');
        } else {
            this.drawHealthBar();
        }
    }
    drawHealthBar() {
        if (!this.gameScene || !this.gameScene.player) return;
        this.bar.clear();
        const w = 100;
        const h = 10;
        const x = this.gameScene.player.x - w / 2;
        const y = this.gameScene.player.y + 30;
        this.bar.fillStyle(0x00ff00);
        this.bar.fillRect(x, y, w * (this.health / 100), h);
        this.bar.lineStyle(2, 0xffffff);
        this.bar.strokeRect(x, y, w, h);
    }

    update(){
        if (this.health > 0) this.drawHealthBar();
    }
}