import Phaser from 'phaser';
import { createCharacterAnims } from 'anims/CharacterAnims';
export default class OtherPlayer extends Phaser.Physics.Matter.Sprite {
  socketId!: string;
  playerTexture!: string;
  touching!: [];

  constructor(data: any) {
    let { scene, x, y, texture, id, frame } = data;
    super(scene.matter.world, x, y, texture, id, frame);

    this.socketId = id;
    this.playerTexture = texture;
    this.touching = [];
    this.scene.add.existing(this); // 플레이어 객체가 생기는 시점.

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

    createCharacterAnims(this.playerTexture, this.anims);
  }

  static preload(scene: any) {
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

  get velocity() {
    return this.body.velocity;
  }
}
