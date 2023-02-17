import MainScene from 'scenes/Mainscene';
import Lobby from 'scenes/Lobby';
import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import StartScene from 'scenes/StartScene';
import { GameType } from 'types';
import Background from './scenes/Background';

const pluginConfig = {
  // The plugin class:
  plugin: PhaserMatterCollisionPlugin,
  // Where to store in Scene.Systems, e.g. scene.sys.matterCollision:
  key: 'matterCollision' as 'matterCollision',
  // Where to store in the Scene, e.g. scene.matterCollision:
  mapping: 'matterCollision' as 'matterCollision',
};

declare module 'phaser' {
  interface Scene {
    [pluginConfig.mapping]: PhaserMatterCollisionPlugin;
  }
  namespace Scenes {
    interface Systems {
      [pluginConfig.key]: PhaserMatterCollisionPlugin;
    }
  }
}

// declare module '*.png';

const config = {
  // width: "100%", //  scene이 그려지는 canvas의 width 값
  // height: "100%", //  scene이 그려지는 canvas의 height 값
  backgroundColor: '#EEEEEE', //  scene이 그려지는 canvas의 backgroundColor 값
  type: Phaser.AUTO,
  parent: 'codeuk',
  scene: [Background, StartScene, Lobby, MainScene],
  scale: {
    // mode: Phaser.Scale.FIT,
    mode: Phaser.Scale.ScaleModes.RESIZE,
    // width: window.innerWidth,
    // height: window.innerHeight,
    width: '100wh',
    height: '100vh',
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true, // 이 설정때문에 오브젝트에 이미지를 추가하지 않아도 대체되는 도형이 그려진다.
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [pluginConfig],
  },
};

let phaserGame: GameType = new Phaser.Game(config);

export default phaserGame;
