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
    super('background');
    // this.clouds = [];
  }

  preload() {
    /*** Characters ***/
    for (let i = 0; i <= 27; i++) {
      this.load.atlas(
        `char${i}`,
        `assets/characters/char${i}.png`,
        `assets/characters/char${i}.json`
      );
    }
    /* Characters sitting on chair */
    for (let i = 0; i < 28; i++) {
      this.load.image(
        `char${i}_chair_back`,
        `assets/room/sitting/char${i}_chair_back.png`
      );
      this.load.image(
        `char${i}_chair_front`,
        `assets/room/sitting/char${i}_chair_front.png`
      );
    }

    /*** Background Scene ***/
    this.load.atlas(
      'castle_night',
      'assets/background/castle_night.png',
      'assets/background/castle_night.json'
    );

    /*** Lobby Scene ***/
    this.load.image('lobby', 'assets/lobby/lobby_scene.png');

    this.load.atlas(
      'green',
      'assets/lobby/green.png',
      'assets/lobby/green.json'
    );

    this.load.atlas(
      'plasma',
      'assets/lobby/plasma.png',
      'assets/lobby/plasma.json'
    );
    /*** Main Scene(classroom) ***/
    /* Map */
    this.load.image('room_map', 'assets/room/room_map.png');
    this.load.tilemapTiledJSON('room_map_tile', 'assets/room/room_map.json');
    /* Props */
    this.load.image('book', 'assets/room/book.png');
    this.load.image('bookshelf_corner', 'assets/room/bookshelf_corner.png');
    this.load.image('bookshelf_left', 'assets/room/bookshelf_left.png');
    this.load.image('bookshelf_right', 'assets/room/bookshelf_right.png');
    this.load.image('chair_back', 'assets/room/chair_back.png');
    this.load.image('chair_front', 'assets/room/chair_front.png');
    this.load.image('whiteboard', 'assets/room/whiteboard.png');
    this.load.image('chalkboard', 'assets/room/chalkboard.png');
    this.load.image('cupboard', 'assets/room/cupboard.png');
    this.load.image('flower', 'assets/room/flower.png');
    this.load.image(
      'macbook_back_closed',
      'assets/room/macbook_back_closed.png'
    );
    this.load.image('macbook_back_open', 'assets/room/macbook_back_open.png');
    this.load.image(
      'macbook_front_closed',
      'assets/room/macbook_front_closed.png'
    );
    this.load.image('macbook_front_open', 'assets/room/macbook_front_open.png');
    this.load.image('mug', 'assets/room/mug.png');
    this.load.image('plant_short', 'assets/room/plant_short.png');
    this.load.image('teapot', 'assets/room/teapot.png');
    this.load.image('wall_candle', 'assets/room/wall_candle.png');
    this.load.image('table', 'assets/room/table.png');
    this.load.image('crate_table_flower', 'assets/room/crate_table_flower.png');
    this.load.image('crate_table', 'assets/room/crate_table.png');
    this.load.image('floor_candle', 'assets/room/floor_candle.png');
    this.load.image('painting1', 'assets/room/painting1.png');
    this.load.image('painting2', 'assets/room/painting2.png');
    this.load.image('painting3', 'assets/room/painting3.png');
    this.load.image('plant_long', 'assets/room/plant_long.png');
    this.load.image('statue', 'assets/room/statue.png');
    this.load.image('table_candle', 'assets/room/table_candle.png');
    this.load.image('bench', 'assets/room/bench.png');
    /* Effects */
    this.load.atlas(
      'fire',
      'assets/room/sitting/blue_fire.png',
      'assets/room/sitting/blue_fire.json'
    );
  }

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

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode });
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background');
    this.launchBackground(backgroundMode);
  }
}
