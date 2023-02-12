import Phaser from 'phaser';
import Player from './Player';
import Button from './Button';
import Table from './Table';

export default class Resource extends Phaser.Physics.Matter.Sprite {
  tableSensor!: any;
  buttonEditor!: any;

  constructor(data: any) {
    let { scene, resource, polygon, index } = data;
    super(
      scene.matter.world,
      resource.x + resource.width / 2,
      resource.y - resource.height / 2,
      resource.name
    );

    scene.add.existing(this);
    // let yOrigin = resource.properties.find(
    //     (p) => p.name == "yOrigin"
    // ).value; // #1 오브젝트 collider를 원형으로 적용할 시 사용

    // this.y = this.y + this.height * (yOrigin - 0.5); // #1 오브젝트 collider를 원형으로 적용할 시 사용
    // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const Body = this.scene.matter.body;
    const Bodies = this.scene.matter.bodies;

    let verticeCollider = Bodies.fromVertices(this.x, this.y, polygon);

    /* Disable chair collision */
    if (resource.name === 'chair_back' || resource.name === 'chair_front') {
      verticeCollider = Bodies.fromVertices(this.x, this.y, polygon, {
        isSensor: true,
      });
    }
    this.setExistingBody(verticeCollider);

    /* Add table interaction */
    if (resource.name === 'table') {
      // @ts-ignore
      let tableCollider = Bodies.circle(this.x - 10, this.y + 10, 100, {
        isSensor: true,
        label: 'tableSensor',
      });
      // console.log();

      const compoundBody = Body.create({
        parts: [verticeCollider, tableCollider],
        frictionAir: 0.35,
      });

      scene.tableMap.set(index, new Table(this, compoundBody.id));
      console.log(scene.tableMap);
      // console.log(compoundBody.id);
      this.CreateCollisions(tableCollider);
      this.setExistingBody(compoundBody);
      // let macBookSensorAdd = Bodies.circle(this.x, this.y, 70, {
      // isSensor: true,
      // label: 'macBookSensor',
    }

    // const compoundBody = Body.create({
    // parts: [verticeCollider, macBookSensorAdd],
    // frictionAir: 0.35,
    // });
    // this.CreateCollisions(macBookSensorAdd);
    // this.setExistingBody(compoundBody);
    // } else {

    // }

    // if (
    // resource.name !== 'chair_front' &&
    // resource.name !== 'chair_back' &&
    // resource.name !== 'wall_candle'
    // ) {
    // this.setExistingBody(verticeCollider);
    // }

    this.setStatic(true);
    this.setOrigin(0.53, 0.5);
    // this.setSensor(true);
    // let circleCollider = Bodies.circle(this.x, this.y, 12, {
    // isSensor: false,
    // label: 'collider',
    // });
    // this.setExistingBody(circleCollider); // #1 오브젝트 collider를 원형으로 적용할 시 사용
    // this.setStatic(true);
    // this.setOrigin(0.5, yOrigin); // #1 오브젝트 collider를 원형으로 적용할 시 사용
  }

  static preload(scene: any) {
    // scene.load.atlas(
    //   'resources',
    //   'assets/images/furniture.png',
    //   'assets/images/furniture_atlas.json'
    // );
    /* Props */
    scene.load.image('book', 'assets/room/book.png');
    scene.load.image('bookshelf_corner', 'assets/room/bookshelf_corner.png');
    scene.load.image('bookshelf_left', 'assets/room/bookshelf_left.png');
    scene.load.image('bookshelf_right', 'assets/room/bookshelf_right.png');
    scene.load.image('chair_back', 'assets/room/chair_back.png');
    scene.load.image('chair_front', 'assets/room/chair_front.png');
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
  }

  CreateCollisions(tableSensor: any) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [tableSensor],
      callback: (other: any) => {
        console.log(this.body);
        // console.log("from player: ", other);

        if (other.bodyB.isSensor && other.bodyB.gameObject instanceof Player) {
          this.buttonEditor = new Button({
            scene: this.scene,
            x: this.x,
            y: this.y - 20,
            text: 'E를 눌러 참여하기',
            style: {
              fontSize: '20px',
              backgroundColor: 'white',
              color: 'black',
            },
          }).getBtn();
          // this.buttonEditor = new Phaser.GameObjects.Sprite(
          //   this.scene,
          //   this.x,
          //   this.y,
          //   'book',
          //   0

          // this.buttonEditor.setScale(0.8);
          // this.buttonEditor.setOrigin(0.5, 0.8);
          this.buttonEditor.setInteractive(); // 이거 해줘야 function 들어감!!!!! 3시간 버린듯;
          // this.scene.add.existing(this.buttonEditor);
          this.buttonEditor.on('pointerdown', () => console.log('ok'));
          // this.buttonEditor.setDepth(6000);

          //TODO: 여기에서 사용자가 키보드 누르면 상호작용 하도록 만듦
          // redux로 상태 바꿔서 component 보이게? Table 클래스 내의 정보 이용해서 자리별 사용 여부, user count 등 띄우기
        }
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [tableSensor],
      callback: (other: any) => {
        if (this.buttonEditor) {
          this.buttonEditor.destroy();
        }
      },
      context: this.scene,
    });
  }
}
