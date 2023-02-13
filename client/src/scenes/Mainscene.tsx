import { createCharacterAnims } from '../anims/CharacterAnims';
import OtherPlayer from '../objects/OtherPlayer';
import Player from '../objects/Player';
import Resource from '../objects/Resources';
import { io, Socket } from 'socket.io-client';
import store from 'stores';
import { GAME_STATUS } from 'utils/Constants';
import Table from 'objects/Table';
import phaserGame from 'codeuk';
import { NONE } from 'phaser';

export default class MainScene extends Phaser.Scene {
  // class 속성 명시는 constructor 이전에 명시하면 되는듯
  socket: Socket | undefined;
  x: any;
  y: any;
  socketId: any;
  player: any;
  map: any;
  otherPlayers: any;
  isKeyDisable: boolean;
  charKey!: string;
  tableMap = new Map<number, Table>();
  watchTable!: boolean;
  editorIdx!: number;

  constructor() {
    // Scene의 key값은 MainScene
    super('MainScene');
    this.isKeyDisable = false;
  }

  preload() {
    // 미리 로드하는 메서드, 이미지 등을 미리 로드한다.
    Player.preload(this);
    Resource.preload(this);
    this.load.image('room_map', 'assets/room/room_map.png');
    this.load.tilemapTiledJSON('room_map_tile', 'assets/room/room_map.json');
  }
  create() {
    // 생성해야 하는 것, 게임 오브젝트 등
    /* Setting room map ground */
    this.map = this.make.tilemap({ key: 'room_map_tile' }); //Json file key (1st parameter in tilemapTiledJSON)
    const room_map_tileset = this.map.addTilesetImage('room_map', 'room_map'); // 1st param: tilesets.name in Json file
    const bglayer = this.map.createLayer('bg', room_map_tileset, 0, 0);
    bglayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(bglayer);

    /* Extracting objects' polygons from TiledJson */
    const polygons = this.map.tilesets.reduce((acc: any, obj: any) => {
      //@ts-ignore
      let polygonArray = Object.entries(obj.tileData)[0][1].objectgroup
        .objects[0].polygon;
      let key = obj.name;
      acc[key] = polygonArray;
      return acc;
    }, {});

    /* Adding Object Layers from TiledJSON */
    //@ts-ignore
    this.map.objects.forEach((objLayer) => {
      //@ts-ignore
      objLayer.objects.forEach((objs, i) => {
        new Resource({
          scene: this,
          resource: objs,
          polygon: polygons[objs.name],
        });
      });
    });

    this.x = this.map.widthInPixels / 2;
    this.y = this.map.heightInPixels / 2;
    this.player = new Player({
      scene: this,
      x: this.x,
      y: this.y,
      // Lobby에서 받은 값으로 유저 생성
      //@ts-ignore
      texture: phaserGame.charKey, // 이미지 이름
      //@ts-ignore
      id: phaserGame.socketId,
      frame: 'down-1', // atlas.json의 첫번째 filename
    });
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      open: Phaser.Input.Keyboard.KeyCodes.E,
    });
    this.watchTable = false;
    this.editorIdx = 4;

    // this.input.keyboard.on('keydown-E', () => {

    // });
    let camera = this.cameras.main;
    camera.zoom = 0.8;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    // camera.setBounds(0, 0, this.game.config.width, this.game.config.height);
    //@ts-ignore
    createCharacterAnims(phaserGame.charKey, phaserGame.anims);

    this.otherPlayers = [];
    //@ts-ignore
    if (phaserGame.socket) {
      //@ts-ignore
      phaserGame.socket.emit('loadNewPlayer', { x: this.x, y: this.y });

      // 기존 유저 그려줘! 하고 요청하기
      //@ts-ignore
      phaserGame.socket.emit('currentPlayers');
      //@ts-ignore
      phaserGame.socket.on('currentPlayers', (payLoad: any) => {
        console.log('기존 유저들을 그려줄게');
        this.addOtherPlayers({
          x: payLoad.x,
          y: payLoad.y,
          charKey: payLoad.charKey,
          socketId: payLoad.socketId,
          state: payLoad.state,
        });
      });
      //@ts-ignore
      phaserGame.socket.on('newPlayer', (payLoad: any) => {
        this.addOtherPlayers({
          x: payLoad.x,
          y: payLoad.y,
          charKey: payLoad.charKey,
          socketId: payLoad.socketId,
          state: payLoad.state,
        });
      });
      //@ts-ignore
      phaserGame.socket.on('playerDisconnect', (socketId: any) => {
        this.removePlayer(socketId);
      });
      //@ts-ignore
      phaserGame.socket.on('updateLocation', (payLoad: any) => {
        this.updateLocation(payLoad);
      });
      //@ts-ignore
      this.game.events.on('pause', () => {
        //@ts-ignore
        phaserGame.socket?.emit('pauseCharacter');
      });
      //@ts-ignore
      phaserGame.socket.on('pauseCharacter', (socketId: any) => {
        this.otherPlayers.forEach((otherPlayer: any) => {
          if (otherPlayer.socketId === socketId) {
            otherPlayer.setStatic(true);
          }
        });
      });

      this.game.events.on('resume', () => {
        //@ts-ignore
        phaserGame.socket?.emit('resumeCharacter');
      });
      //@ts-ignore
      phaserGame.socket.on('resumeCharacter', (socketId: any) => {
        this.otherPlayers.forEach((otherPlayer: any) => {
          if (otherPlayer.socketId === socketId) {
            otherPlayer.setStatic(false);
          }
        });
      });
    }
  }

  update() {
    if (store.getState().mode.status !== GAME_STATUS.GAME) {
      this.input.keyboard.disableGlobalCapture();
      this.isKeyDisable = true;
      return;
    }
    if (this.isKeyDisable) {
      this.input.keyboard.enableGlobalCapture();
      this.isKeyDisable = false;
    }
    if (this.watchTable) {
      if (Phaser.Input.Keyboard.JustDown(this.idxDown) && this.editorIdx > 0) {
        this.editorIdx -= 1;
      }
      if (Phaser.Input.Keyboard.JustDown(this.idxUp) && this.editorIdx < 4) {
        this.editorIdx += 1;
      }
      if (Phaser.Input.Keyboard.JustDown(this.idxEnter)) {
        console.log(this.editorIdx);
        switch (this.editorIdx) {
          case 0:
            this.input.keyboard.disableGlobalCapture();
            this.player.inputKeys = this.input.keyboard.addKeys({
              up: Phaser.Input.Keyboard.KeyCodes.UP,
              down: Phaser.Input.Keyboard.KeyCodes.DOWN,
              left: Phaser.Input.Keyboard.KeyCodes.LEFT,
              right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
              open: Phaser.Input.Keyboard.KeyCodes.E,
            });
            this.watchTable = false;
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (i === this.editorIdx) {
          this.player.touching[0].macbookList[i].setStyle({
            backgroundColor: 'white',
          });
        } else {
          this.player.touching[0].macbookList[i].setStyle({
            backgroundColor: 'transparent',
          });
        }
      }
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.player.inputKeys.open)) {
      console.log('하이');

      if (this.player.touching.length !== 0) {
        this.editorIdx = 4;
        console.log(this.player.touching[0]);
        this.watchTable = true;
        this.player.touching[0].macbookList.forEach((mac: any) => {
          mac.setVisible(true);
          this.input.keyboard.disableGlobalCapture();
          this.idxDown = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.DOWN
          );
          this.idxUp = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.UP
          );
          this.idxEnter = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
          );
        });
      }
    }
    this.player.update();
  }

  addOtherPlayers(playerInfo: any) {
    const otherPlayer = new OtherPlayer({
      // playerInfo를 바탕으로 새로운 플레이어 객체를 그려준다.
      // 해당 플레이어 객체를 움직이려면 어쩔까?
      scene: this,
      x: playerInfo.x,
      y: playerInfo.y,
      texture: playerInfo.charKey, // 이미지 이름
      id: playerInfo.socketId,
      frame: 'down-1', // atlas.json의 첫번째 filename
    });
    if (playerInfo.state === 'paused') {
      otherPlayer.setStatic(true);
    }
    otherPlayer.socketId = playerInfo.socketId;
    this.otherPlayers.push(otherPlayer);
  }

  removePlayer(res: any) {
    this.otherPlayers.forEach((player: any) => {
      if (player.socketId === res) {
        player.destroy();
      }
    });
    this.otherPlayers.filter((player: any) => player.socketId !== res);
  }

  updateLocation(payLoad: any) {
    this.otherPlayers.forEach((player: any) => {
      if (player.socketId === payLoad.socketId) {
        switch (payLoad.motion) {
          case 'left':
            player.play(`${player.playerTexture}-walk-left`, true);
            player.setPosition(payLoad.x, payLoad.y);
            break;
          case 'right':
            player.play(`${player.playerTexture}-walk-right`, true);
            player.setPosition(payLoad.x, payLoad.y);
            break;
          case 'up':
            player.play(`${player.playerTexture}-walk-up`, true);
            player.setPosition(payLoad.x, payLoad.y);
            break;
          case 'down':
            player.play(`${player.playerTexture}-walk-down`, true);
            player.setPosition(payLoad.x, payLoad.y);
            break;
          case 'idle':
            player.play(`${player.playerTexture}-idle-down`, true);
            player.setPosition(payLoad.x, payLoad.y);
            break;
        }
      }
    });
  }
}
