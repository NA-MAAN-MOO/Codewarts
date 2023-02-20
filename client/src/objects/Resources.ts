import Phaser from 'phaser';
import Player from './Player';
import OtherPlayer from './OtherPlayer';
import Button from './Button';
import Table from './Table';

export default class Resource extends Phaser.Physics.Matter.Sprite {
  tableSensor!: any;
  buttonEditor!: any;
  mainScene: Phaser.Scene;
  buttonToEditor!: any;
  // macbookList!: any[];

  constructor(data: any) {
    let { scene, resource, polygon, index } = data;
    super(
      scene.matter.world,
      resource.x + resource.width / 2,
      resource.y - resource.height / 2,
      resource.name
    );

    this.mainScene = scene;

    scene.add.existing(this);

    const Body = scene.matter.body;
    const Bodies = scene.matter.bodies;

    let verticeCollider = Bodies.fromVertices(this.x + 5, this.y, polygon);

    /* Disable chair collision & Add chair resource table info */
    if (resource.name === 'chair_back' || resource.name === 'chair_front') {
      // Sensor
      verticeCollider = Bodies.fromVertices(this.x, this.y, polygon, {
        isSensor: true,
      });
      // Chair list
      if (index < 2) {
        scene.chairList[0].push(this);
      } else if (index < 4) {
        scene.chairList[1].push(this);
      } else if (index < 6) {
        scene.chairList[2].push(this);
      } else if (index < 8) {
        scene.chairList[3].push(this);
      } else if (index < 10) {
        scene.chairList[4].push(this);
      } else if (index < 12) {
        scene.chairList[5].push(this);
      }
    }
    this.setExistingBody(verticeCollider);

    /* Add table interaction */
    if (resource.name === 'table') {
      // @ts-ignore
      let tableCollider = Bodies.circle(this.x - 10, this.y + 10, 115, {
        isSensor: true,
        label: 'tableSensor',
      });
      // console.log();

      const compoundBody = Body.create({
        parts: [verticeCollider, tableCollider],
        frictionAir: 0.35,
      });

      scene.tableMap.set(
        compoundBody.id,
        new Table(this.mainScene, this, compoundBody.id)
      );

      this.CreateCollisions(tableCollider);
      this.setExistingBody(compoundBody);
    }

    /* Add laptop resource to table info */
    if (
      resource.name == 'macbook_front_closed' ||
      resource.name == 'macbook_back_closed'
    ) {
      if (index < 2) {
        scene.macbookList[0].push(this);
      } else if (index < 4) {
        scene.macbookList[1].push(this);
      } else if (index < 6) {
        scene.macbookList[2].push(this);
      } else if (index < 8) {
        scene.macbookList[3].push(this);
      } else if (index < 10) {
        scene.macbookList[4].push(this);
      } else if (index < 12) {
        scene.macbookList[5].push(this);
      }
    }

    this.setStatic(true);
    this.setOrigin(0.5, 0.5);
  }

  static preload(scene: any) {
    /* Props */
    scene.load.image('book', 'assets/room/book.png');
    scene.load.image('bookshelf_corner', 'assets/room/bookshelf_corner.png');
    scene.load.image('bookshelf_left', 'assets/room/bookshelf_left.png');
    scene.load.image('bookshelf_right', 'assets/room/bookshelf_right.png');
    scene.load.image('chair_back', 'assets/room/chair_back.png');
    scene.load.image('chair_front', 'assets/room/chair_front.png');
    scene.load.image('whiteboard', 'assets/room/whiteboard.png');
    scene.load.image('chalkboard', 'assets/room/chalkboard.png');
    scene.load.image('cupboard', 'assets/room/cupboard.png');
    scene.load.image('flower', 'assets/room/flower.png');
    scene.load.image(
      'macbook_back_closed',
      'assets/room/macbook_back_closed.png'
    );
    scene.load.image('macbook_back_open', 'assets/room/macbook_back_open.png');
    scene.load.image(
      'macbook_front_closed',
      'assets/room/macbook_front_closed.png'
    );
    scene.load.image(
      'macbook_front_open',
      'assets/room/macbook_front_open.png'
    );
    scene.load.image('mug', 'assets/room/mug.png');
    scene.load.image('plant_short', 'assets/room/plant_short.png');
    scene.load.image('teapot', 'assets/room/teapot.png');
    scene.load.image('wall_candle', 'assets/room/wall_candle.png');
    scene.load.image('table', 'assets/room/table.png');
    /* Chairs where characters sit */
    for (let i = 0; i < 28; i++) {
      scene.load.image(
        `char${i}_chair_back`,
        `assets/room/sitting/char${i}_chair_back.png`
      );
      scene.load.image(
        `char${i}_chair_front`,
        `assets/room/sitting/char${i}_chair_front.png`
      );
    }
  }

  CreateCollisions(tableSensor: any) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [tableSensor],
      callback: (other: any) => {
        // console.log(this.body.id);
        // console.log("from player: ", other);

        if (
          other.bodyB.isSensor &&
          other.bodyB.gameObject instanceof Player &&
          !(other.bodyB.gameObject instanceof OtherPlayer)
        ) {
          this.buttonEditor = new Button({
            scene: this.scene,
            x: this.x,
            y: this.y - 20,
            text: 'E를 눌러 참여하기',
            style: {
              fontSize: '20px',
              backgroundColor: 'white',
              color: 'black',
              resolution: 20,
            },
          }).getBtn();
          this.buttonEditor.setInteractive(); // 이거 해줘야 function 들어감!!!!! 3시간 버린듯;

          // 딱 하나만 볼 수 있게하기
          // @ts-ignore
          const table = this.mainScene.tableMap.get(this.body.id);
          this.mainScene.input.keyboard.on('keydown-E', () =>
            console.log(table.tableId)
          );

          //TODO: 여기에서 사용자가 키보드 누르면 상호작용 하도록 만듦
          //@ts-ignore
          this.scene.player.touching.push(this);
          // redux로 상태 바꿔서 component 보이게? Table 클래스 내의 정보 이용해서 자리별 사용 여부, user count 등 띄우기
        }
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [tableSensor],
      callback: (other: any) => {
        if (this.buttonEditor) {
          //@ts-ignore
          this.scene.player.touching = this.scene.player.touching.filter(
            (button: any) => button !== this
          );
          this.buttonEditor.destroy();
        }
      },
      context: this.scene,
    });
  }
}
