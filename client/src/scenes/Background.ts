import { ColumnWidthOutlined } from '@ant-design/icons';
import Phaser from 'phaser';
// import { BackgroundMode } from '../../../server/types/BackgroundMode';
// import { BackgroundMode } from '../../../server/types/BackgroundMode';

export enum BackgroundMode {
  DAY,
  NIGHT,
}

export default class Background extends Phaser.Scene {
  // private clouds!: any[];
  // private cloud!: Phaser.Physics.Matter.
  // private cloudKey!: string;
  private backdropKey!: string;

  constructor() {
    super('Background');
    // this.clouds = [];
  }

  // preload() {
  //   this.load.atlas(
  //     'castle_night',
  //     'assets/background/castle_night.png',
  //     'assets/background/castle_night.json'
  //   );
  // }

  create(data: { backgroundMode: BackgroundMode }) {
    const sceneHeight = this.cameras.main.height;
    const sceneWidth = this.cameras.main.width;

    /* Set texture of images based on the background mode */
    if (data.backgroundMode === BackgroundMode.DAY) {
      this.backdropKey = 'backdrop_day';
      // this.cloudKey = 'cloud_day';
      // this.cameras.main.setBackgroundColor('#c6eefc');
    } else {
      this.backdropKey = 'castle_night';
      // this.cloudKey = 'cloud_night';
      // this.cameras.main.setBackgroundColor('#2c4464');
    }

    /* Add backdrop image */
    this.anims.create({
      key: 'castle_night',
      frames: this.anims.generateFrameNames('castle_night', {
        start: 0,
        end: 5,
        prefix: 'bg-',
      }),
      frameRate: 15,
      repeat: -1,
    });
    const backdropImage = this.add
      .sprite(sceneWidth / 2, sceneHeight / 2, this.backdropKey)
      .play(`${this.backdropKey}`);
    const scale = Math.max(
      sceneWidth / backdropImage.width,
      sceneHeight / backdropImage.height
    );
    backdropImage.setScale(scale).setScrollFactor(0);
  }

  update(t: number, dt: number) {}

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode });
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background');
    this.launchBackground(backgroundMode);
  }
}
