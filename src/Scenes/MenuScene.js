export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: "MenuScene"});
        
    }

    preload() {
        this.load.setPath("./assets/Spritesheets");
        this.load.atlasXML("BeigeBlob", "alienBeige.png", "alienBeige.xml");
        this.load.atlasXML("BlueBlob", "alienBlue.png", "alienBlue.xml");
        this.load.atlasXML("GreenBlob", "alienGreen.png", "alienGreen.xml");
        this.load.atlasXML("PinkBlob", "alienPink.png", "alienPink.xml");
        this.load.atlasXML("YellowBlob", "alienYellow.png", "alienYellow.xml");

        document.getElementById('description').innerHTML = '<h2>MenuScene.js</h2>'

    }

    create() {
        this.add.text(400, 80, 'Choose Your Blob', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        const blobKeys = ['BeigeBlob','BlueBlob','GreenBlob','PinkBlob','YellowBlob'];
        this.selected = null;

        blobKeys.forEach((key, i) => {
            const x = 120 + i * 130;
            const sprite = this.add.sprite(x, 300, key, "alien.png")
            .setInteractive({useHandCursor:true});

            sprite.on('pointerover', () => sprite.setScale(1.1));
            sprite.on('pointerout', () => sprite.setScale(1));

            sprite.on('pointerdown', () => {
                this.registry.set('playerAvatar', key);
                console.log(key);
                this.load.setPath("./assets/AlienSprites");

                this.scene.start('GameScene');
            });
        });
    }
}