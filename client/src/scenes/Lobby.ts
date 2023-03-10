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
import { initSocket } from 'network/phaserSocket';

export default class Lobby extends Phaser.Scene {
  private player!: Phaser.Physics.Matter.Sprite;
  private buttonForList!: Phaser.GameObjects.Text;
  private portal!: Phaser.Physics.Matter.Sprite;
  private portalZone!: any;
  socketId: any;
  private playerId: string;
  private playerTexture: string;
  network: boolean;
  private sceneChange!: any = false;
  socket: Socket | undefined;
  howTo: Phaser.GameObjects.Image;
  private sceneWidth!: number;
  private sceneHeight!: number;
  private bgImage: Phaser.GameObjects.Image;
  private door: Phaser.GameObjects.Image;
  private yellowPortal!: Phaser.Physics.Matter.Sprite;
  private statue!: Phaser.GameObjects.Image;
  private portalAnim!: any;
  private yellowPortalAnim!: any;
  // const {nickName, characterModel} = useSelector((state:RootState)=> state.charactor);

  constructor() {
    super('Lobby');
  }

  init(data: any) {
    /* Open socket */
    initSocket(data, this);

    this.playerId = data.playerId;
    this.playerTexture = data.playerTexture;
  }

  create() {
    /* Add portal animation*/

    /* Set game world bounds */
    this.matter.world.setBounds(
      0,
      0,
      this.scale.width * 1.5,
      this.scale.height
    );

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

    this.player.inputKeys['up'].enabled = false;
    this.player.inputKeys['down'].enabled = false;

    /* Lock specific key (up, down) */
    this.game.events.on('resume', () => {
      this.player.inputKeys['up'].enabled = false;
      this.player.inputKeys['down'].enabled = false;
    });

    this.game.events.on('focus', () => {
      this.player.inputKeys['up'].enabled = false;
      this.player.inputKeys['down'].enabled = false;
    });

    createCharacterAnims(this.playerTexture, this.player.anims);

    this.drawLobby();
    this.scale.on('resize', this.drawLobby, this);
  }

  update() {
    // const maxHeight = this.scale.y / 2 - 30;
    // const minHeight = this.scale.y / 2 + 30;
    // if (this.howTo.y > maxHeight) {
    //   this.howTo.y--;
    // } else if (this.howTo.y < minHeight) {
    //   this.howTo.y++;
    // }
    if (this.player && this.network) {
      /* Control Player Movement */
      const playerId = store.getState().user.playerId;
      if (playerId === '') {
        this.input.keyboard.disableGlobalCapture();
      }

      this.player.move();

      /* Add overlap between portal and player */
      let boundPortal = this.portal.getBounds();
      boundPortal.setSize(this.portal.displayWidth - 200, window.innerHeight);
      boundPortal.setPosition(boundPortal.x + 100);
      let boundPlayer = this.player.getBounds();

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(boundPortal, boundPlayer)
      ) {
        this.buttonForList.setVisible(true);

        /* If player press key E when overlapping, scene changes */
        if (Phaser.Input.Keyboard.JustDown(this.player.inputKeys.open)) {
          this.sceneChange = true;
          this.player.inputKeys['open'].enabled = false;

          setTimeout(() => handleScene(GAME_STATUS.GAME), 1000);
        }
      } else {
        this.buttonForList.setVisible(false);
      }

      /* Transition animation */
      if (this.sceneChange) {
        this.player.angle -= 5;
        this.player.y -= window.innerHeight / 800;
        this.player.displayWidth -= this.player.width / 150;
        this.player.displayHeight -= this.player.height / 150;
        this.cameras.main.alpha -= 0.005;
        this.cameras.main.shake(undefined, 0.005);
        this.buttonForList.setVisible(false);
      }
    }
  }

  drawLobby = () => {
    this.sceneWidth = this.cameras.main.width;
    this.sceneHeight = this.cameras.main.height;

    this.addBg(this.sceneWidth, this.sceneHeight);
    this.addStatue(this.sceneWidth, this.sceneHeight);
    this.addPortals(this.sceneWidth, this.sceneHeight);
    this.addDoor(this.sceneWidth, this.sceneHeight);
    this.addDialog(this.sceneWidth, this.sceneHeight);

    this.matter.world.setBounds(0, 0, this.sceneWidth * 1.5, this.sceneHeight);

    this.player.y = this.sceneHeight * 0.7;
  };

  addBg = (sceneWidth: number, sceneHeight: number) => {
    if (this.bgImage) {
      this.bgImage.destroy();
    }

    /* Add background Image */
    this.bgImage = this.add.sprite(sceneWidth / 2, sceneHeight / 2, 'lobby');

    const imageScale = Math.max(
      sceneWidth / this.bgImage.width,
      sceneHeight / this.bgImage.height
    );

    this.bgImage.setScale(imageScale).setScrollFactor(0);
  };

  addDoor = (sceneWidth: number, sceneHeight: number) => {
    if (this.door) {
      this.door.destroy();
    }
    this.door = this.add.sprite(sceneWidth / 5, sceneHeight / 1.85, 'door');

    // const imageScale = Math.max(
    //   sceneWidth / this.door.width,
    //   sceneHeight / this.door.height
    // );

    // this.door.setScale(imageScale).setScrollFactor(0);
  };

  addStatue = (sceneWidth: number, sceneHeight: number) => {
    if (this.statue) {
      this.statue.destroy();
    }

    this.statue = this.add.sprite(
      sceneWidth / 2,
      sceneHeight / 1.9,
      'lobby_statue'
    );
  };

  addPortals = (sceneWidth: number, sceneHeight: number) => {
    if (this.portal) {
      this.portal.destroy();
    }
    if (this.yellowPortal) {
      this.yellowPortal.destroy();
    }

    if (this.howTo) {
      this.howTo.destroy();
    }

    if (this.portalAnim) {
      this.portalAnim.destroy();
    }

    if (this.yellowPortalAnim) {
      this.yellowPortalAnim.destroy();
    }

    this.portalAnim = this.anims.create({
      key: 'green',
      frames: this.anims.generateFrameNames('green', {
        start: 0,
        end: 90,
        prefix: `thing-`,
      }),
      frameRate: 60,
      repeat: -1,
    });

    this.yellowPortalAnim = this.anims.create({
      key: 'yellow',
      frames: this.anims.generateFrameNames('yellow', {
        start: 0,
        end: 90,
        prefix: `thing-`,
      }),
      frameRate: 60,
      repeat: -1,
    });

    this.portal = this.matter.add
      .sprite(sceneWidth / 5, sceneHeight / 2, 'green', 0)
      .play('green');

    /* Set portal overlap range */
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

    this.yellowPortal = this.add
      .sprite(sceneWidth / 1.25, sceneHeight * 0.5, 'yellow', 0)
      .play('yellow');

    this.howTo = this.add.image(sceneWidth / 1.25, sceneHeight / 2, 'howTo');

    const imageScale = Math.max(
      sceneWidth / this.portal.width,
      sceneHeight / this.portal.height
    );
    // this.portal.setScale(imageScale);
    // this.yellowPortal.setScale(imageScale);
  };

  addDialog = (sceneWidth: number, sceneHeight: number) => {
    if (this.buttonForList) {
      this.buttonForList.destroy();
    }
    /* Show guide dialog to enter classroom */
    this.buttonForList = this.add.image(this.portal.x, this.portal.y, 'enter');
    this.buttonForList.setVisible(false);
    this.buttonForList.setScrollFactor(0);
  };
}
