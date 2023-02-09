import MainScene from './scenes/Mainscene';
import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

const config = {
  // width: "100%", //  scene이 그려지는 canvas의 width 값
  // height: "100%", //  scene이 그려지는 canvas의 height 값
  backgroundColor: '#EEEEEE', //  scene이 그려지는 canvas의 backgroundColor 값
  type: Phaser.AUTO,
  parent: 'codeuk',
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: 'matter',
    matter: {
      debug: true, // 이 설정때문에 오브젝트에 이미지를 추가하지 않아도 대체되는 도형이 그려진다.
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
};

new Phaser.Game(config);
