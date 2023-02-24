//@ts-nocheck
import phaserGame from 'codeuk';
import Phaser from 'phaser';
import { PlayerType } from 'types';
import Button from './Button';

export default class Player extends Phaser.Physics.Matter.Sprite {
  socketId!: string;
  touching!: MatterJS.BodyType[];
  inputKeys!: Phaser.Input.Keyboard.Key | {};
  buttonEditor!: any;
  playerTexture!: string;
  playerNameBubble!: Phaser.GameObjects.Text;
  playerName!: string;
  // playerNameObject!: any;

  constructor(data: PlayerType) {
    let { scene, x, y, texture, id, name, frame } = data;

    super(scene.matter.world, x, y, texture, frame);

    this.socketId = id;
    this.playerTexture = texture;
    this.playerName = name;
    this.touching = [];
    this.scene.add.existing(this); // 플레이어 객체가 생기는 시점.

    // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const Body = this.scene.matter.body;
    const Bodies = this.scene.matter.bodies;
    let playerCollider = Bodies.circle(this.x, this.y, 20, {
      isSensor: false,
      label: 'playerCollider',
    });
    let playerSensor = Bodies.circle(this.x, this.y, 30, {
      isSensor: true,
      label: 'playerSensor',
    });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    // this.CreateCollisions(playerSensor);
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    this.playerNameBubble = this.scene.add
      .text(this.x, this.y - this.height - 10, this.playerName, {
        fontFamily: 'Firenze',
      })
      .setStyle({
        backgroundColor: '#e06609',
        color: 'white',
        fontSize: '18px',
      })
      .setPadding(10, 3, 10, 1);

    this.playerNameObject = scene.matter.add.gameObject(this.playerNameBubble);
    this.playerNameObject.setSensor(true);
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
    // 초마다 60프레임마다(?) 호출되는 것, 매 틱마다 업데이트 되야하는 것인듯.
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
    this.playerNameBubble.setPosition(this.x, this.y - this.height / 2 - 10);

    // const { socket } = this.scene as MainScene;
    // if (!socket) {
    //   return;
    // }
    if (!phaserGame.socket) return;
    phaserGame.socket.emit('movement', {
      x: this.x,
      y: this.y,
      motion: motion,
    });
  }

  //   CreateCollisions(playerSensor: MatterJS.BodyType) {
  //     this.scene.matterCollision.addOnCollideStart({
  //       objectA: [playerSensor],
  //       callback: (other) => {
  //         // console.log("from player: ", other);
  //         if (
  //           other.gameObjectB['texture'] &&
  //           other.gameObjectB.texture.key === 'table'
  //         ) {
  //           this.touching.push(other.gameObjectB);

  //           this.buttonEditor = new Button({
  //             scene: this.scene,
  //             x: other.gameObjectB.x,
  //             y: other.gameObjectB.y - 20,
  //             text: 'E를 눌러 참여하기',
  //             style: {
  //               fontSize: '20px',
  //               backgroundColor: 'white',
  //               color: 'black',
  //               resolution: 20,
  //             },
  //           }).getBtn();
  //           this.buttonEditor.setInteractive(); // 이거 해줘야 function 들어감!!!!! 3시간 버린듯;v
  //         }
  //       },
  //       context: this.scene,
  //     });

  //     this.scene.matterCollision.addOnCollideEnd({
  //       objectA: [playerSensor],
  //       callback: (other: any) => {
  //         this.touching = this.touching.filter(
  //           (gameObject) => gameObject !== other.gameObjectB
  //         );
  //         if (this.buttonEditor) {
  //           this.buttonEditor.destroy();
  //         }
  //       },
  //       context: this.scene,
  //     });
  //   }
}
