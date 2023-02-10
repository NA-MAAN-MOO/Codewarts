import Phaser from 'phaser';

export default class Resource extends Phaser.Physics.Matter.Sprite {
  static preload(scene: any) {
    scene.load.atlas(
      'resources',
      'assets/images/furniture.png',
      'assets/images/furniture_atlas.json'
    );
    scene.load.atlas(
      'male1',
      'assets/images/villager-males.png',
      'assets/images/male1.json'
    );
    for (let i = 0; i <= 27; i++) {
      scene.load.atlas(
        `char${i}`,
        `assets/characters/char${i}.png`,
        `assets/characters/char${i}.json`
      );
    }
  }

  constructor(data: any) {
    let { scene, resource } = data;
    super(
      scene.matter.world,
      resource.x,
      resource.y,
      'resources',
      resource.properties.find((p: any) => p.name === 'type').value
    );
    this.scene.add.existing(this);
    // let yOrigin = resource.properties.find(
    //     (p) => p.name == "yOrigin"
    // ).value; // #1 오브젝트 collider를 원형으로 적용할 시 사용
    this.name = resource.properties.find((p: any) => p.name === 'type').value;
    this.x += this.width / 2;
    this.y -= this.height / 2;
    // this.y = this.y + this.height * (yOrigin - 0.5); // #1 오브젝트 collider를 원형으로 적용할 시 사용
    // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const Body = this.scene.matter.body;
    const Bodies = this.scene.matter.bodies;
    let circleCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: 'collider',
    });
    // this.setExistingBody(circleCollider); // #1 오브젝트 collider를 원형으로 적용할 시 사용
    this.setStatic(true);
    // this.setOrigin(0.5, yOrigin); // #1 오브젝트 collider를 원형으로 적용할 시 사용
  }
}
