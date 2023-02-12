import Phaser from 'phaser';
import { createCharacterAnims } from '../anims/CharacterAnims';
import Player from 'objects/Player';
import Button from 'objects/Button';

const createAligned = (
  scene: Phaser.Scene,
  count: number,
  texture: string,
  scrollFactor: number
) => {
  let x = 0;
  for (let i = 0; i < count; i++) {
    const image = scene.add
      .image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor);
    x += image.width;
  }
};

export default class extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Matter.Sprite;
  private buttonForList!: Phaser.GameObjects.Text;
  private houseForList!: Phaser.Physics.Matter.Sprite;
  private charKey!: string; // character sprite texture
  inputKeys!: any;
  socketId: any;

  constructor() {
    super('Lobby');
  }

  preload() {
    Player.preload(this);
    /* Lobby Background image load */
    for (let i = 0; i < 12; i++) {
      this.load.image(`lobby${i}`, `assets/lobby/lobby${i}.png`);
    }
    this.load.image('house', 'assets/lobby/house.png');
  }

  create() {
    /* Add Lobby background */
    for (let i = 11; i >= 0; i--) {
      createAligned(this, 3, `layer${i}`, i % 5);
    }

    /* Add my player */
    this.player = new Player({
      scene: this,
      x: this.scale.width / 10,
      y: this.scale.height - 80,
      texture: this.charKey,
      id: this.socketId,
      frame: 'down-1',
    });

    /* Add Keyboard keys to enable character animation */
    this.inputKeys = this.input.keyboard.addKeys({
      //   up: Phaser.Input.Keyboard.KeyCodes.W,
      //   down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      enter: Phaser.Input.Keyboard.KeyCodes.E,
    });

    createCharacterAnims(this.charKey, this.anims);

    /* Add a house used as a room list */
    this.houseForList = this.matter.add
      .sprite(this.scale.width / 3, this.scale.height - 150, 'house')
      .setScale(0.3);

    this.houseForList.setSensor(true);

    /* Add button for houseForList */
    this.buttonForList = new Button({
      scene: this,
      x: this.scale.width / 3,
      y: this.scale.height / 2 + 50,
      text: 'E를 누르면 강의실에 들어갈 수 있어요!',
      style: { fontSize: '30px' },
      //   callback: () => {
      //     this.scene.stop();
      //     this.scene.start('room');
      //   },
    });
  }

  update() {
    this.player.update();
    let boundPlayer = this.player.getBounds();
    let boundHouseForList = this.houseForList.getBounds();

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        boundPlayer,
        boundHouseForList
      )
    ) {
      this.buttonForList.setVisible(true);
      console.log('맞닿음');
      // Press E to Enter Classroom
      if (this.inputKeys.enter.isDown) {
        this.scene.stop();
        this.scene.start('MainScene');
      }
    } else {
      this.buttonForList.setVisible(false);
      console.log('떨어짐');
    }
  }
}
