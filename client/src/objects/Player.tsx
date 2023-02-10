import Phaser from 'phaser';
import MainScene from '../scenes/Mainscene';
export default class Player extends Phaser.Physics.Matter.Sprite {
  socketId!: string;
  playerTexture!: string;
  touching!: any[];
  inputKeys!: any;
  showingIcon!: any;
  spriteIcon!: any;

  constructor(data: any) {
    let { scene, x, y, texture, id, frame } = data;

    super(scene.matter.world, x, y, texture, id, frame);

    this.socketId = id;
    this.playerTexture = texture;
    this.touching = [];
    console.log('1');
    this.scene.add.existing(this); // 플레이어 객체가 생기는 시점.
    console.log('2');

    // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const Body = this.scene.matter.body;
    const Bodies = this.scene.matter.bodies;
    let playerCollider = Bodies.circle(this.x, this.y, 24, {
      isSensor: false,
      label: 'playerCollider',
    });
    let playerSensor = Bodies.circle(this.x, this.y, 24, {
      isSensor: true,
      label: 'playerSensor',
    });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
  }

  static preload(scene: any) {
    /* Characters */
    scene.load.atlas(
      'male1',
      'assets/images/villager-males.png',
      'assets/images/male1.json'
    );
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
      // this.x -= speed;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
      this.anims.play(`${this.playerTexture}-walk-right`, true);
      motion = 'right';
      // this.x += speed;
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
      if (motion === 'idle') {
        this.anims.play(`${this.playerTexture}-walk-up`, true);
        motion = 'up';
      }

      // this.y -= speed;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
      if (motion === 'idle') {
        this.anims.play(`${this.playerTexture}-walk-down`, true);
        motion = 'down';
      }
      // this.y += speed;
    }
    if (motion === 'idle') {
      this.anims.play(`${this.playerTexture}-idle-down`, true);
    }

    playerVelocity.normalize(); // 대각선인 경우 1.4의 속도이기 때문에 정규화(normalize)를 통해 속도를 1로 만든다. 이 주석에서 속도란, speed가 아니라 좌표 변화량을 뜻한다.
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y); // 실제로 player오브젝트를 움직인다.
    // if (
    //     Math.abs(this.velocity.x) > 0.1 ||
    //     Math.abs(this.velocity.y) > 0.1
    // ) {
    //     this.anims.play("walk", true); // anim.json 에 설정된 key 값
    //     motion = "walk";
    // } else {
    //     this.anims.play("idle", true); // anim.json 에 설정된 key 값
    //     motion = "idle";
    // }

    const { socket } = this.scene as MainScene;
    if (!socket) {
      return;
    }
    socket.emit('movement', {
      x: this.x,
      y: this.y,
      motion: motion,
    });
    // this.spriteIcon.setPosition(this.x, this.y);
    // this.showIcon();
  }

  showIcon() {
    let pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      this.showingIcon += 6;
    } else {
      this.showingIcon = 0;
    }
    if (this.showingIcon > 100) {
      this.showingIcon = 0;
    }
    if (this.flipX) {
      this.spriteIcon.setAngle(-this.showingIcon);
    } else {
      this.spriteIcon.setAngle(this.showingIcon);
    }
  }

  CreateMiningCollisions(playerSensor: any) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [playerSensor],
      callback: (other: any) => {
        // console.log("from player: ", other);
        if (other.bodyB.isSensor) return;
        this.touching.push(other.gameObjectB);
        // console.log(this.touching.length, other.gameObjectB.name);
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [playerSensor],
      callback: (other: any) => {
        this.touching = this.touching.filter(
          (gameObject) => gameObject !== other.gameObjectB
        );
        // console.log(this.touching.length);
      },
      context: this.scene,
    });
  }
}
