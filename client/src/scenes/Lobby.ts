import Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import store from 'stores';
import Player from 'objects/Player';
import Button from 'objects/Button';
import { createCharacterAnims } from '../anims/CharacterAnims';
import phaserGame from 'codeuk';

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

export default class Lobby extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Matter.Sprite;
  private buttonForList!: Phaser.GameObjects.Text;
  private houseForList!: Phaser.Physics.Matter.Sprite;
  private charKey!: string; // character sprite texture
  inputKeys!: any;
  socketId: any;

  socket: Socket | undefined;

  // const {nickName, characterModel} = useSelector((state:RootState)=> state.charactor);

  constructor() {
    super('Lobby');
  }

  init() {
    // socket-io와 링크 스타~트!
    //@ts-ignore
    phaserGame.socket = io('http://localhost:8080');
    //@ts-ignore
    phaserGame.charKey = ''; // 이후 캐릭터 값이 들어간다
    //@ts-ignore
    phaserGame.socket.on('start', (payLoad: any) => {
      // Server에서 보내주는 고유 값을 받는다.
      //@ts-ignore
      phaserGame.socketId = payLoad.socketId;
      //@ts-ignore
      phaserGame.charKey = payLoad.charKey;
      phaserGame.userName = payLoad.userName;
    });
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
      createAligned(this, 3, `lobby${i}`, i % 5);
    }

    /* Add a house used as a room list */
    this.houseForList = this.matter.add
      .sprite(this.scale.width / 3, this.scale.height * 0.78, 'house')
      .setScale(0.3);

    this.houseForList.setSensor(true);
    this.houseForList.setScrollFactor(0);

    /* Add my player */
    this.player = new Player({
      scene: this,
      x: this.scale.width / 10,
      y: this.scale.height * 0.85,
      //@ts-ignore
      texture: phaserGame.charKey,
      //@ts-ignore
      id: phaserGame.socketId,
      frame: 'down-1',
    });

    /* Add Keyboard keys to enable character animation */
    this.inputKeys = this.input.keyboard.addKeys({
      //   up: Phaser.Input.Keyboard.KeyCodes.W,
      //   down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      enter: Phaser.Input.Keyboard.KeyCodes.E,
    });
    //@ts-ignore
    createCharacterAnims(phaserGame.charKey, phaserGame.anims);

    /* Add button for houseForList */
    this.buttonForList = new Button({
      scene: this,
      x: this.houseForList.x,
      y: this.houseForList.y / 1.3,
      text: 'E를 누르면 강의실에 들어갈 수 있어요!',
      style: {
        backgroundColor: '#fff',
        color: '#111',
        fontSize: '20px',
        borderRadius: '10px',
      },
    }).getBtn();
    this.buttonForList.setScrollFactor(0);

    this.matter.world.setBounds(
      0,
      0,
      this.scale.width * 1.5,
      this.scale.height
    );
  }

  update() {
    /* Control Player Movement */
    const speed = 5;
    const playerId = store.getState().user.playerId;
    if (playerId === '') {
      this.input.keyboard.disableGlobalCapture();
    }

    let playerVelocity = new Phaser.Math.Vector2(); //  2D 벡터
    let motion = 'idle';
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
      //@ts-ignore
      this.player.play(`${phaserGame.charKey}-walk-left`, true);
      motion = 'left';
      // parallax scrolling
      // this.cameras.main.scrollX -= 0.5;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
      //@ts-ignore
      this.player.play(`${phaserGame.charKey}-walk-right`, true);
      motion = 'right';
      // parallax scrolling
      // this.cameras.main.scrollX += 0.5;
    }
    // this.y += speed;
    if (motion === 'idle') {
      //@ts-ignore
      this.anims.play(`${phaserGame.charKey}-idle-down`, this.player);
      // this.houseForList.setVelocity(0, 0);
    }

    playerVelocity.scale(speed);
    this.player.setVelocity(playerVelocity.x, playerVelocity.y); // 실제로 player오브젝트를 움직인다.

    /* Control Overlapping between player and house */
    let boundPlayer = this.player.getBounds();
    let boundHouseForList = this.houseForList.getBounds();

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        boundPlayer,
        boundHouseForList
      )
    ) {
      this.buttonForList.setVisible(true);
      // console.log('맞닿음');
      // Press E to Enter Classroom
      if (this.inputKeys.enter.isDown) {
        // this.scene.stop();
        this.scene.start('MainScene');
      }
    } else {
      this.buttonForList.setVisible(false);
    }
  }
}
