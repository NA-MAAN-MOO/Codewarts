import Phaser from 'phaser';
import Player from './Player';

export default class Resource extends Phaser.Physics.Matter.Sprite {
  macBookSensor!: any;
  buttonEditor!: any;
  constructor(data: any) {
    let { scene, resource, polygon } = data;
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
    if (
      resource.name === 'macbook_back_closed' ||
      resource.name === 'macbook_front_closed'
    ) {
      let macBookSensorAdd = Bodies.circle(this.x, this.y, 70, {
        isSensor: true,
        label: 'macBookSensor',
      });

      const compoundBody = Body.create({
        parts: [verticeCollider, macBookSensorAdd],
        frictionAir: 0.35,
      });
      this.CreateCollisions(macBookSensorAdd);
      this.setExistingBody(compoundBody);
    } else {
      this.setExistingBody(verticeCollider);
    }

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
    scene.load.image('table_left', 'assets/room/table_left.png');
    scene.load.image('table_right', 'assets/room/table_right.png');
    scene.load.atlas(
      'table',
      'assets/room/tables.png',
      'assets/room/tables.json'
    );
  }

  CreateCollisions(macBookSensor: any) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [macBookSensor],
      callback: (other: any) => {
        // console.log("from player: ", other);
        if (other.bodyB.isSensor && other.bodyB.gameObject instanceof Player) {
          this.buttonEditor = new Phaser.GameObjects.Sprite(
            this.scene,
            this.x,
            this.y,
            'book',
            0
          );
          this.buttonEditor.setScale(0.8);
          this.buttonEditor.setOrigin(0.5, 0.8);
          this.buttonEditor.setInteractive(); // 이거 해줘야 function 들어감!!!!! 3시간 버린듯;
          this.scene.add.existing(this.buttonEditor);
          this.buttonEditor.on('pointerdown', () => console.log('ok'));
          this.buttonEditor.setDepth(6000);
        }
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [macBookSensor],
      callback: (other: any) => {
        if (this.buttonEditor) {
          this.buttonEditor.destroy();
        }
      },
      context: this.scene,
    });
  }
}
