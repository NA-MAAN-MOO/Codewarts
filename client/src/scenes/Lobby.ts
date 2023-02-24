//@ts-nocheck
import Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import store from 'stores';
import Player from 'objects/Player';
import Button from 'objects/Button';
import { createCharacterAnims } from '../anims/CharacterAnims';
import phaserGame from 'codeuk';
import { handleScene } from 'lib/phaserLib';
import { GAME_STATUS } from 'utils/Constants';
import { styledTheme } from 'styles/theme';

export default class Lobby extends Phaser.Scene {
  private player!: Phaser.Physics.Matter.Sprite;
  private buttonForList!: Phaser.GameObjects.Text;
  private portal!: Phaser.Physics.Matter.Sprite;
  private portalZone!: any;
  socketId: any;
  private playerId: string;
  private playerTexture: string;
  private network: boolean;

  socket: Socket | undefined;
  // const {nickName, characterModel} = useSelector((state:RootState)=> state.charactor);

  constructor() {
    super('Lobby');
  }

  init(data: any) {
    /* Open socket */
    phaserGame.socket = io('http://localhost:8080');
    phaserGame.socket.on('start', (payLoad: { socketId: string }) => {
      // Server에서 보내주는 고유 값을 받는다.
      phaserGame.socketId = payLoad.socketId;
      phaserGame.charKey = data.playerTexture;
      phaserGame.userName = data.playerId;

      phaserGame.socket?.emit('savePlayer', {
        charKey: phaserGame.charKey,
        userName: phaserGame.userName,
      });

      this.network = true;
    });

    this.playerId = data.playerId;
    this.playerTexture = data.playerTexture;
  }

  create() {
    /* Add Lobby background */
    const bg = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      'lobby'
    );
    bg.setDisplaySize(window.innerWidth, window.innerHeight);

    /* Add portal */
    this.anims.create({
      key: 'green',
      frames: this.anims.generateFrameNames('green', {
        start: 0,
        end: 90,
        prefix: `thing-`,
      }),
      frameRate: 60,
      repeat: -1,
    });

    this.anims.create({
      key: 'plasma',
      frames: this.anims.generateFrameNames('plasma', {
        start: 0,
        end: 191,
        prefix: 'plasma-',
      }),
      frameRate: 60,
      repeat: -1,
    });

    this.add
      .sprite(this.scale.width / 1.2, this.scale.height * 0.5, 'green', 0)
      .play('green');

    this.portal = this.matter.add
      .sprite(this.scale.width / 4.5, this.scale.height * 0.5, 'plasma', 0)
      .play('plasma');

    /* Guide to enter classroom */
    this.buttonForList = new Button({
      scene: this,
      x: this.portal.x,
      y: this.portal.y / 1.6,
      text: 'E를 누르면 강의실에 들어갈 수 있어요!',
      style: {
        //https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle
        backgroundColor: '#fff',
        color: '#111',
        fontSize: '20px',
        resolution: 20,
      },
    }).getBtn();

    this.buttonForList.setVisible(false);
    this.buttonForList.setScrollFactor(0);

    this.matter.world.setBounds(
      0,
      0,
      this.scale.width * 1.5,
      this.scale.height
    );

    const Bodies = this.matter.bodies;
    this.portalZone = Bodies.rectangle(
      this.portal.x,
      this.portal.y,
      this.portal.width,
      this.portal.height,
      {
        isSensor: true,
        label: 'portalSensor',
      }
    );

    this.portal.setExistingBody(this.portalZone);

    /* Add my player */
    this.player = new Player({
      scene: this,
      x: 40,
      y: this.scale.height * 0.7,
      texture: this.playerTexture,
      id: phaserGame.socketId,
      name: this.playerId,
      frame: 'down-1',
    });

    /* Add Keyboard keys to enable character animation */
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      open: Phaser.Input.Keyboard.KeyCodes.E,
    });

    /* Lock specific key (up, down) */
    this.player.inputKeys['up'].enabled = false;
    this.player.inputKeys['down'].enabled = false;

    createCharacterAnims(this.playerTexture, this.player.anims);
  }

  update() {
    if (this.player && this.network) {
      /* Control Player Movement */
      const playerId = store.getState().user.playerId;
      if (playerId === '') {
        this.input.keyboard.disableGlobalCapture();
      }

      this.player.update();

      /* Add overlap between portal and player */
      let boundPortal = this.portal.getBounds();
      boundPortal.setSize(this.portal.displayWidth - 90, window.innerHeight);
      let boundPlayer = this.player.getBounds();

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(boundPortal, boundPlayer)
      ) {
        this.buttonForList.setVisible(true);

        /* If player press key E when overlapping, scene changes */
        if (this.player.inputKeys.open.isDown) {
          handleScene(GAME_STATUS.GAME);
        }
      } else {
        this.buttonForList.setVisible(false);
      }
    }
  }
}
