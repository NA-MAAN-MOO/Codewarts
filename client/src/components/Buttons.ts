import Phaser from "phaser";

export default class Button {
  public button!: Phaser.GameObjects.Text;

  constructor(
    x: number,
    y: number,
    label: string,
    scene: Phaser.Scene,
    callback: (arg: void) => void
  ) {
    this.button = scene.add
      .text(x, y, label)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({
        backgroundColor: "#fff",
        color: "#111",
        fontSize: "30px",
        borderRadius: "10px",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback())
      .on("pointerover", () =>
        this.button.setStyle({ backgroundColor: "#f39c12" })
      )
      .on("pointerout", () => this.button.setStyle({ backgroundColor: "#fff" }))
      .setVisible(false);
  }

  get getBtn(): Phaser.GameObjects.Text {
    return this.button;
  }
}
