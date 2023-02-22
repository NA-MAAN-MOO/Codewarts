import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
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
  }

  create() {
    this.scene.launch('Background');
  }
}
