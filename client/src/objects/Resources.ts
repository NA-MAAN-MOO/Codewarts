import Phaser from 'phaser';
import Player from './Player';
import OtherPlayer from './OtherPlayer';
import Button from './Button';
import Table from './Table';

export default class Resource extends Phaser.Physics.Matter.Sprite {
  tableSensor!: any;

  buttonEditor!: Phaser.GameObjects.Image | undefined;
  buttonArray!: Phaser.GameObjects.Image[];
  mainScene: Phaser.Scene;
  buttonToEditor!: any;
  whiteboardButton!: any;

  object!: any;

  constructor(data: any) {
    let { scene, resource, polygon, index } = data;
    super(
      scene.matter.world,
      resource.x + resource.width / 2,
      resource.y - resource.height / 2,
      resource.name
    );

    this.buttonArray = [];
    this.mainScene = scene;

    this.object = scene.add.existing(this);

    const Body = scene.matter.body;
    const Bodies = scene.matter.bodies;

    let verticeCollider = Bodies.fromVertices(this.x + 5, this.y, polygon);

    if (
      resource.name === 'table_candle' ||
      resource.name === 'painting3' ||
      resource.name === 'floor_candle'
    ) {
      if (resource.name === 'table_candle') {
        this.object.setDepth(55);
      } else if (resource.name === 'floor_candle') {
        this.object.setDepth(55);
      }
      verticeCollider = Bodies.fromVertices(this.x, this.y, polygon, {
        isSensor: true,
      });
    }
    /* Disable chair collision & Add chair resource table info */
    if (resource.name === 'chair_back' || resource.name === 'chair_front') {
      if (resource.name === 'chair_back') {
        this.object.setDepth(35);
      } else {
        this.object.setDepth(20);
      }
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
      this.object.setDepth(30);
      // @ts-ignore
      let tableCollider = Bodies.circle(this.x - 10, this.y + 10, 115, {
        isSensor: true,
        label: 'tableSensor',
      });

      const compoundBody = Body.create({
        parts: [verticeCollider, tableCollider],
        frictionAir: 0.35,
      });

      scene.tableMap.set(
        compoundBody.id,
        new Table(this.mainScene, this, compoundBody.id)
      );

      this.createTableInteraction(tableCollider);
      this.setExistingBody(compoundBody);
    }

    /* Add laptop resource to table info */
    if (
      resource.name == 'macbook_front_closed' ||
      resource.name == 'macbook_back_closed'
    ) {
      this.object.setDepth(40);
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

  createTableInteraction(sensor: any) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [sensor],
      callback: (other: any) => {
        if (
          other.bodyB.isSensor &&
          other.bodyB.gameObject instanceof Player &&
          !(other.bodyB.gameObject instanceof OtherPlayer)
        ) {
          this.buttonEditor = this.scene.add
            .image(this.x, this.y - 20, 'participate_button')
            .setDepth(60);
          this.buttonEditor.scale *= 0.9;
          this.buttonArray.push(this.buttonEditor);
          this.buttonEditor.setInteractive();
          //@ts-ignore
          this.scene.player.touching.push(this);
        }
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [sensor],
      callback: (other: any) => {
        if (
          this.buttonEditor &&
          other.bodyB.isSensor &&
          other.bodyB.gameObject instanceof Player &&
          !(other.bodyB.gameObject instanceof OtherPlayer)
        ) {
          //@ts-ignore
          this.scene.player.touching = this.scene.player.touching.filter(
            (button: any) => button !== this
          );

          this.buttonArray.forEach((button: Phaser.GameObjects.Image) => {
            button.destroy();
          });
          this.buttonArray = [];
        }
      },
      context: this.scene,
    });
  }
}
