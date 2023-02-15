import Phaser from 'phaser';

/* Parallax Scrolling */
const createAligned = (
  scene: Phaser.Scene,
  count: number,
  texture: string,
  scrollFactor: number
) => {
  let x = -100;
  for (let i = 0; i < count; i++) {
    const image = scene.add
      .image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor);
    x += image.width;
  }
};

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  preload() {
    /* Lobby Background image load */
    for (let i = 0; i < 12; i++) {
      this.load.image(`lobby${i}`, `assets/lobby/lobby${i}.png`);
    }
  }

  create() {
    /* Add Lobby background */
    for (let i = 11; i >= 0; i--) {
      createAligned(this, 3, `lobby${i}`, i % 5);
    }

    this.matter.world.setBounds(
      0,
      0,
      this.scale.width * 1.5,
      this.scale.height
    );
  }
}
