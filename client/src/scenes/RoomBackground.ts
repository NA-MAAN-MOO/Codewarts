import Phaser from 'phaser';

export default class RoomBackground extends Phaser.Scene {
  bgImage!: Phaser.GameObjects.Sprite;
  imageScale!: number;
  sceneWidth!: number;
  sceneHeight!: number;

  constructor() {
    super('RoomBackground');
  }

  addBg() {
    this.sceneWidth = this.cameras.main.width;
    this.sceneHeight = this.cameras.main.height;

    if (this.bgImage) {
      this.bgImage.destroy();
    }

    /* Add background Image */
    this.bgImage = this.add
      .sprite(this.sceneWidth / 2, this.sceneHeight / 2, 'room_bg')
      .play('space');

    const imageScale = Math.max(
      this.sceneWidth / this.bgImage.width,
      this.sceneHeight / this.bgImage.height
    );

    this.bgImage.setScale(imageScale).setScrollFactor(0);
  }

  create() {
    this.anims.create({
      key: 'space',
      frames: this.anims.generateFrameNames('room_bg', {
        start: 0,
        end: 35,
        prefix: `space-`,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.addBg();
    this.scale.on('resize', this.addBg, this);
  }
}
