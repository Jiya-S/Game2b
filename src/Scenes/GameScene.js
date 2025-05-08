//Name: Jiya Sawarkar

export default class Game extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.level = 0;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.json('paths', 'assets/path.json');
        this.load.image('starfield', 'assets/Space/PNG/Space_Stars2.png');
        this.load.image('Bat', 'assets/Enemies/bat.png');
        
        this.load.image('fallenBat', 'assets/Enemies/bat_hit.png');
        this.load.image('Beatle', 'assets/Enemies/spider.png');
        this.load.image('fallenBeatle', 'assets/Enemies/spider_hit.png');

        this.load.image('batBullet', 'assets/Enemies/spinner.png');
        this.load.image('beatleBullet', 'assets/Enemies/snail_shell.png');
        this.load.setPath("./assets/AlienSprites");
        const key = this.registry.get('playerAvatar');
        switch (key) {
            case 'YellowBlob':
                this.load.image('bullet', 'alienYellow_badge1.png');
                break;
            case 'BeigeBlob':
                this.load.image('bullet', 'alienBeige_badge1.png');
                break;
            case 'BlueBlob':
                this.load.image('bullet', 'alienBlue_badge1.png');
                break;
            case 'PinkBlob':
                this.load.image('bullet', 'alienPink_badge1.png');
                break;
            case 'GreenBlob':
                this.load.image('bullet', 'alienGreen_badge1.png');
                break;
        }
        

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Game.js</h2>'
    }

    create() {

        this.level         = 0;
        this.spawnedEnemies = 0;
        this.killedEnemies  = 0;
        //starfield stuff
        this.starfield = this.add.tileSprite(0, 0, 800, 600, 'starfield').setOrigin(0, 0);
        const data = this.cache.json.get('paths'); //understand this
        this.paths = data.levels || [];
        console.log("paths" + this.paths);

        const avatarKey = this.registry.get('playerAvatar');
        this.player = this.physics.add.sprite(400, 550, avatarKey, 'alien.png');
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.A = this.input.keyboard.addKey('A');
        this.D = this.input.keyboard.addKey('D');
        this.Space = this.input.keyboard.addKey('SPACE');

        this.bullets = this.add.group();
        this.enemyBullets = this.add.group();

        this.canShoot = true;

        this.enemies = [];
        
        this.time.delayedCall(100, () => {
            this.scene.launch('UIScene');
            this.nextLevel();
            //this.events.emit('update-level', this.level + 1);
          });

        

        
    }

    nextLevel() {
        //console.log(this.level);
        
        //end if levels are complete
        this.time.delayedCall(50, () => {
            this.events.emit('update-level', this.level);
          });

        if (this.level >= this.paths.length) {
            this.scene.start('GameOverScene');
            this.events.emit('destroyBar');
            return;
        }

        this.enemies.forEach(e => e.destroy());
        this.enemies = [];

        const levelData = this.paths[this.level];
        this.maxEnemies = levelData.maxEnemies || levelData.enemies.length;
        this.spawnedEnemies = 0;
        this.killedEnemies = 0;

        //spawn loop
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.spawnedEnemies < this.maxEnemies && this.spawnedEnemies < levelData.enemies.length) {
                    const e = levelData.enemies[this.spawnedEnemies];
                    this.spawnEnemy(e);
                    this.spawnedEnemies++;
                }
            },
            loop : true
        });
        this.level++;
        
    }

    spawnEnemy(e) {
        const enemy = e.path ? this.add.follower(this.buildCurveFromArray(e.path), e.path[0], e.path[1], e.type) //if there is a path to follow
        : this.add.sprite(e.x || Phaser.Math.Between(100, 700), e.y || 100, e.type); //if enemies are still

        const bar = this.add.graphics();
        bar.fillStyle(0xff0000);
        bar.fillRect(enemy.x -15, enemy.y-30, 30, 4);
        enemy.bar = bar;

        enemy.setData('type', e.type);
        enemy.setData('hp', e.hp || (e.type == 'Beatle' ? 3 : 2)); //assign enemies health
        this.enemies.push(enemy);

        if (enemy.startFollow) {
            enemy.startFollow({duration: 4000, yoyo: true, repeat: -1}); //instead of 0 repeats, repeat indef
        }

        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000),
            callback: () => this.enemyShoot(enemy),
            callbackScope: this,
            loop: true
        });
    }

    buildCurveFromArray(arr) {
        const points = [];
        for (let i = 0; i < arr.length; i+=2) {
            points.push(new Phaser.Math.Vector2(arr[i], arr[i + 1]));
        }
        return new Phaser.Curves.Spline(points);
    }

    enemyShoot(enemy) {
        if (!enemy.active)
            return;
        const type = enemy.getData('type');
        const key = type == 'Beatle' ? 'beatleBullet' : 'batBullet';
        const bullet = this.add.sprite(enemy.x, enemy.y + 20, key);
        bullet.setScale(0.5);
        this.enemyBullets.add(bullet);
    }

    update() {
        if (this.A.isDown && this.player.x > 0){
            this.player.x -= 7;
        }
        if (this.D.isDown && this.player.x < 800) {
            this.player.x += 7;
        }

        if (this.Space.isDown && this.canShoot) {
            this.canShoot = false;
            const bullet = this.add.sprite(this.player.x, this.player.y - 20, 'bullet');
            bullet.setScale(0.5);
            this.bullets.add(bullet);
        }

        if (Phaser.Input.Keyboard.JustUp(this.Space)) {
            this.canShoot = true;
        }

        this.enemies.forEach(enemy => {
            if (enemy.bar) {
                const maxHp = enemy.getData('type') === 'Bat' ? 2 : 3;
                const hp = enemy.getData('hp');
                const x = enemy.x - 15;
                const y = enemy.y - 30;

                enemy.bar.clear();
                enemy.bar.fillStyle(0xff0000);
                enemy.bar.lineStyle(1, 0xffffff);
                enemy.bar.fillRect(x, y, 30*(hp/maxHp), 4);
                enemy.bar.lineStyle(1, 0xffffff);
                enemy.bar.strokeRect(x, y, 30, 4);

            }
        });

        this.bullets.getChildren().forEach(bullet => {
            bullet.y -= 7;
            if (bullet.y < 0){
                bullet.destroy();
            }
            this.enemies.forEach(enemy => {
                if (!enemy.active) return;
                if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), enemy.getBounds())) {
                    bullet.destroy();
                    let hp = enemy.getData('hp');
                    
                    console.log(enemy.type);
                    
                    enemy.setData('hp', hp -1);
                    if (enemy.getData('hp') <=0) {

                        //enemy.setData('hp', 0);
                        enemy.active = false;
                        enemy.bar.clear();
                        const type = enemy.getData('type');
                        const deathTexture = type === 'Beatle' ? 'fallenBeatle' : 'fallenBat';
                        enemy.setTexture(deathTexture);
                        this.time.delayedCall(100, () => {
                            enemy.bar.destroy();
                            enemy.destroy();
                        });
                        this.enemies = this.enemies.filter(e => e !== enemy);
                        this.killedEnemies++;

                        const score = type == 'Bat' ? 3 : 5;
                        this.events.emit('update-score', score);
                        
                        if (this.killedEnemies >= this.maxEnemies) {
                            this.time.delayedCall(1000, () => this.nextLevel());
                        }
                    }
                }
            });
        });

        this.enemyBullets.getChildren().forEach(bullet => {
            bullet.y += 3;
            if (bullet.y > 600){
                bullet.destroy();
            }
            if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), this.player.getBounds())) {
                bullet.destroy();
                const avatar = this.registry.get('playerAvatar');
                this.player.setTexture(avatar, 'alien_hurt.png');
                this.time.delayedCall(1000, ()=> 
                    this.player.setTexture(avatar, 'alien.png'));
            
                const type = bullet.texture.key;
                const damage = type === 'batBullet' ? 10 : 20;
                //add hurt enemy here
                this.events.emit('player-hurt', damage);
            }
        });

        this.starfield.tilePositionY -= 1;
    }

}