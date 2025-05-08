// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

import MenuScene    from './Scenes/MenuScene.js';
import GameScene    from './Scenes/GameScene.js';
import UIScene      from './Scenes/UIScene.js';
import GameOverScene from './Scenes/GameOverScene.js';

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [MenuScene, GameScene, UIScene, GameOverScene],
    physics: { default: 'arcade', arcade: { debug: false } }
}

const game = new Phaser.Game(config);