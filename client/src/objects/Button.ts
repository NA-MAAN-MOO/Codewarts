import Phaser from 'phaser';

type ButtonProp = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  style: object;
};
export default class Button {
  button!: Phaser.GameObjects.Text;

  constructor(data: ButtonProp) {
    let { scene, x, y, text, style } = data;
    this.button = scene.add
      .text(x, y, text, { fontFamily: 'Prentendard' })
      .setOrigin(0.5)
      .setPadding(3)
      .setStyle(style)
      .setDepth(60)
      //   .setInteractive({ useHandCursor: true })
      //   .on('pointerdown', () => callback())
      .setVisible(true);
  }

  getBtn() {
    return this.button;
  }
}
