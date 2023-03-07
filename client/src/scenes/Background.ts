import Phaser from 'phaser';
import { openLogin } from 'stores/modeSlice';
import store from 'stores';

export enum BackgroundMode {
  DAY,
  NIGHT,
}

export default class Background extends Phaser.Scene {
  // private clouds!: any[];
  // private cloud!: Phaser.Physics.Matter.
  // private cloudKey!: string;
  private backdropKey!: string;
  backdropImage!: Phaser.GameObjects.Sprite;
  imageScale!: number;
  sceneHeight!: number;
  sceneWidth!: number;

  constructor() {
    super('background');
    // this.clouds = [];
  }

  preload() {
    /*** Loading Bar ***/
    let progressBar = this.add.graphics();
    let loadingText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3,
      'Heading to Codewarts🪄',
      {
        fontFamily: 'NeoDunggeunmoPro-Regular',
        fontSize: '48px',
        color: '#ffffff',
      }
    );
    loadingText.setOrigin(0.5, 0.5);

    let percentText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      '0%',
      {
        fontFamily: 'NeoDunggeunmoPro-Regular',
        fontSize: '48px',
        color: '#ffffff',
      }
    );
    percentText.setOrigin(0.5, 0.5);

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
    this.load.image('door', 'assets/lobby/door.png');
    this.load.image('enter', 'assets/lobby/enter.png');
    this.load.image('lobby_statue', 'assets/lobby/lobby_statue.png');

    this.load.atlas(
      'green',
      'assets/lobby/gray.png',
      'assets/lobby/green.json'
    );

    this.load.atlas(
      'yellow',
      'assets/lobby/yellow.png',
      'assets/lobby/green.json'
    );

    this.load.image('howTo', 'assets/lobby/how_to.png');

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
      'assets/room/sitting/red_fire.png',
      'assets/room/sitting/fire.json'
    );

    this.load.atlas(
      'gold',
      'assets/effect/confetti.png',
      'assets/effect/gold.json'
    );
    this.load.atlas(
      'success',
      'assets/effect/success.png',
      'assets/effect/success.json'
    );

    /* Buttons */
    this.load.image('board_button', 'assets/room/board_button.png');
    this.load.image('participate_button', 'assets/room/participate_button.png');

    const camera = this.cameras.main;
    /* ---------Load event handler -----------*/
    this.load.on('progress', function (value: number) {
      percentText.setText(`${Math.ceil(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0x8b0000, 1);
      progressBar.fillRect(
        camera.width / 4,
        camera.height / 2.5,
        (value * camera.width) / 2,
        camera.height / 20
      );
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      loadingText.destroy();
      percentText.destroy();
      console.log('Loading complete');
      // onLoadComplete();
      store.dispatch(openLogin());
      // 로그인 띄우기
    });
  }

  create(data: { backgroundMode: BackgroundMode }) {
    this.sceneHeight = this.cameras.main.height;
    this.sceneWidth = this.cameras.main.width;

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
    const resize = () => {
      this.sceneHeight = this.cameras.main.height;
      this.sceneWidth = this.cameras.main.width;
      this.backdropImage.destroy();
      this.backdropImage = this.add
        .sprite(this.sceneWidth / 2, this.sceneHeight / 2, this.backdropKey)
        .play(`${this.backdropKey}`);
      this.imageScale = Math.max(
        this.sceneWidth / this.backdropImage.width,
        this.sceneHeight / this.backdropImage.height
      );
      this.backdropImage.setScale(this.imageScale).setScrollFactor(0);
    };

    this.backdropImage = this.add
      .sprite(this.sceneWidth / 2, this.sceneHeight / 2, this.backdropKey)
      .play(`${this.backdropKey}`);
    this.imageScale = Math.max(
      this.sceneWidth / this.backdropImage.width,
      this.sceneHeight / this.backdropImage.height
    );
    this.backdropImage.setScale(this.imageScale).setScrollFactor(0);

    this.scale.on('resize', resize, this);
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode });
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background');
    this.launchBackground(backgroundMode);
  }
}
