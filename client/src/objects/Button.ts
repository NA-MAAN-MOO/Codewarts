import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Text {
  constructor(data: any) {
    let { scene, x, y, text, style } = data;
    super(scene, x, y, text, style);
    scene.add
      .text(x, y, text)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle(style)
      //   .setInteractive({ useHandCursor: true })
      //   .on('pointerdown', () => callback())
      .setVisible(false);
  }
}
