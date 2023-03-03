//@ts-nocheck
import phaserGame from 'codeuk';
import Phaser from 'phaser';
import { PlayerType } from 'types';
import Resource from './Resources';
import Lobby from 'pages/Lobby';

export default class Player extends Phaser.Physics.Matter.Sprite {
  object!: any;
  socketId!: string;
  touching!: MatterJS.BodyType[];
  inputKeys!: Phaser.Input.Keyboard.Key | {};
  buttonEditor!: any;
  playerTexture!: string;
  playerNameBubble!: Phaser.GameObjects.Text;
  playerName!: string;
  successEffect!: Phaser.GameObjects.Sprite;
  fire!: Phaser.GameObjects.Sprite;
  playerDialogBubble: Phaser.GameObjects.Container;
  private timeoutID?: number;

  constructor(data: PlayerType) {
    let { scene, x, y, texture, id, name, frame } = data;

    super(scene.matter.world, x, y, texture, frame);

    this.socketId = id;
    this.playerTexture = texture;
    this.playerName = name;
    this.touching = [];

    this.object = this.scene.add.existing(this); // 플레이어 객체가 생기는 시점.
    this.object.setDepth(50);
    console.log(scene);

    if (scene.scene.key === 'Lobby') {
      this.scale *= 2.3;
    } else {
      this.scale *= 1.3;
    }

    /* Add player sensor & collision body */
    const Body = this.scene.matter.body;
    const Bodies = this.scene.matter.bodies;
    this.playerCollider = Bodies.circle(this.x, this.y, 20, {
      isSensor: false,
      label: 'playerCollider',
    });
    this.playerSensor = Bodies.circle(this.x, this.y, 30, {
      isSensor: true,
      label: 'playerSensor',
    });
    const compoundBody = Body.create({
      parts: [this.playerCollider, this.playerSensor],
      frictionAir: 0.35,
    });
    // this.CreateCollisions(playerSensor);
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    /* Add player name bubble */
    this.playerNameBubble = this.scene.add
      .text(this.x, this.y - this.height * 0.8, this.playerName, {
        fontFamily: 'NeoDunggeunmoPro-Regular',
      })
      .setStyle({
        backgroundColor: '#e06609',
        color: 'white',
        fontSize: '24px',
      })
      .setPadding(10, 3, 10, 3)
      .setDepth(50);

    if (scene.scene.key === 'Lobby') {
      this.playerNameBubble.setPosition(this.x, this.y - this.height - 20);
    }
    this.playerNameObject = scene.matter.add.gameObject(this.playerNameBubble);
    this.playerNameObject.setSensor(true);

    // add dialogBubble to playerContainer
    // this.playerDialogBubble = this.scene.add
    //   .container(this.x, this.y - this.height - 100)
    //   .setDepth(5000);
  }

  get velocity() {
    return this.body.velocity;
  }

  move() {
    const speed = 5;
    let playerVelocity = new Phaser.Math.Vector2(); //  2D 벡터
    let motion = 'idle';

    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
      this.anims.play(`${this.playerTexture}-walk-left`, true);
      motion = 'left';
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
      this.anims.play(`${this.playerTexture}-walk-right`, true);
      motion = 'right';
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
      if (motion === 'idle') {
        this.anims.play(`${this.playerTexture}-walk-up`, true);
        motion = 'up';
      }
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
      if (motion === 'idle') {
        this.anims.play(`${this.playerTexture}-walk-down`, true);
        motion = 'down';
      }
    }
    if (motion === 'idle') {
      this.anims.play(`${this.playerTexture}-idle-down`, true);
    }

    playerVelocity.normalize(); // 대각선인 경우 1.4의 속도이기 때문에 정규화(normalize)를 통해 속도를 1로 만든다. 이 주석에서 속도란, speed가 아니라 좌표 변화량을 뜻한다.
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y); // 실제로 player오브젝트를 움직인다.
    if (this.scene.scene.key === 'Lobby') {
      this.playerNameBubble.setPosition(this.x, this.y - this.height - 20);
    } else {
      this.playerNameBubble.setPosition(this.x, this.y - this.height * 0.8);
    }

    if (this.successEffect) {
      this.successEffect.setPosition(this.x, this.y - 10);
    }
    if (this.playerDialogBubble) {
      this.playerDialogBubble.setPosition(
        this.x - this.width,
        this.y - this.height - 80
      );
    }
    if (!phaserGame.socket) return;
    phaserGame.socket.emit('movement', {
      x: this.x,
      y: this.y,
      motion: motion,
    });
  }

  addFireEffect(chair: Resource) {
    /* Add fire effect */
    this.fire = this.scene.add.sprite(
      chair.x,
      chair.y - this.height * 1.4,
      'fire',
      0
    );
    this.fire.setDisplaySize(this.playerNameBubble.width + 9, this.fire.height);
    this.fire.setDepth(57);
    this.fire.anims.create({
      key: 'fire',
      frames: this.fire.anims.generateFrameNames('fire', {
        start: 0,
        end: 5,
        prefix: 'fire-',
      }),
      frameRate: 40,
      repeat: -1,
    });
    this.fire.play('fire');
  }

  removeFireEffect() {
    this.fire.destroy();
  }

  /* Called whenever player solve a problem  */
  problemSolvedEffect() {
    /* TODO: Add solved state */
    // if (solved)
    this.scene.anims.create({
      key: 'gold',
      frames: this.scene.anims.generateFrameNames('gold', {
        start: 0,
        end: 59,
        prefix: 'gold-',
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.successEffect = this.scene.add
      .sprite(this.x, this.y - 10, 'gold', 0)
      .play('gold');

    setTimeout(() => {
      this.successEffect.destroy();
    }, 10000);
  }

  //emoji

  updateDialogBubble(content: string) {
    this.clearDialogBubble();

    this.playerDialogBubble = this.scene.add
      .text(this.x - this.width / 1.5, this.y - this.height - 80, content)
      .setStyle({ fontSize: '60px', color: 'white' })
      .setDepth(150)
      .setPadding(5, 15, 5, 5);

    // // After 6 seconds, clear the dialog bubble
    this.timeoutID = window.setTimeout(() => {
      this.clearDialogBubble();
    }, 3000);
  }
  private clearDialogBubble() {
    clearTimeout(this.timeoutID);
    if (this.playerDialogBubble) {
      this.playerDialogBubble.destroy();
    }
  }
}
