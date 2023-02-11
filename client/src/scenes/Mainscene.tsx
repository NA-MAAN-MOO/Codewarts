import { createCharacterAnims } from '../anims/CharacterAnims';
import OtherPlayer from '../objects/OtherPlayer';
import Player from '../objects/Player';
import Resource from '../objects/Resources';
import { io, Socket } from 'socket.io-client';
import store from 'stores';
import { GAME_STATUS } from 'utils/Constants';

export default class MainScene extends Phaser.Scene {
  socket: Socket | undefined;
  x: any;
  y: any;
  socketId: any;
  player: any;
  map: any;
  otherPlayers: any;
  isKeyDisable: boolean;
  charKey!: string;

  constructor() {
    super('MainScene');
    this.isKeyDisable = false;
  }

  init() {
    // socket-io와 링크 스타~트!
    this.socket = io('http://localhost:8080');
    console.log(typeof this.socket);

    this.x = null;
    this.y = null;
    this.charKey = '';
    this.socket.on('start', (payLoad: any) => {
      this.socketId = payLoad.socketId;
      this.charKey = payLoad.charKey;
    });
  }

  preload() {
    // 미리 로드하는 메서드, 이미지 등을 미리 로드한다.
    Player.preload(this);
    Resource.preload(this);
    // OtherPlayer.preload(this);
    // this.load.image('ground', 'assets/images/ground.png');
    // this.load.tilemapTiledJSON('groundTile', 'assets/images/ground.json');
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
    const polygons = this.map.tilesets.reduce((acc, obj) => {
      let polygonArray = Object.entries(obj.tileData)[0][1].objectgroup
        .objects[0].polygon;
      let key = obj.name;
      acc[key] = polygonArray;
      return acc;
    }, {});

    /* Adding Object Layers from TiledJSON */
    this.map.objects.forEach((objLayer) => {
      objLayer.objects.forEach((objs) => {
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
      texture: this.charKey, // 이미지 이름
      id: this.socketId,
      frame: 'down-1', // atlas.json의 첫번째 filename
    });
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    let camera = this.cameras.main;
    camera.zoom = 0.8;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    // camera.setBounds(0, 0, this.game.config.width, this.game.config.height);

    createCharacterAnims(this.charKey, this.anims);

    this.otherPlayers = [];
    if (this.socket) {
      this.socket.emit('loadNewPlayer', { x: this.x, y: this.y });

      // 기존 유저 그려줘! 하고 요청하기
      this.socket.emit('currentPlayers');

      this.socket.on('currentPlayers', (payLoad: any) => {
        console.log('기존 유저들을 그려줄게');
        this.addOtherPlayers({
          x: payLoad.x,
          y: payLoad.y,
          charKey: payLoad.charKey,
          socketId: payLoad.socketId,
          state: payLoad.state,
        });
      });

      this.socket.on('newPlayer', (payLoad: any) => {
        this.addOtherPlayers({
          x: payLoad.x,
          y: payLoad.y,
          charKey: payLoad.charKey,
          socketId: payLoad.socketId,
          state: payLoad.state,
        });
      });

      this.socket.on('playerDisconnect', (socketId: any) => {
        this.removePlayer(socketId);
      });

      this.socket.on('updateLocation', (payLoad: any) => {
        this.updateLocation(payLoad);
      });
      this.game.events.on('pause', () => {
        this.socket?.emit('pauseCharacter');
      });
      this.socket.on('pauseCharacter', (socketId: any) => {
        this.otherPlayers.forEach((otherPlayer: any) => {
          if (otherPlayer.socketId === socketId) {
            otherPlayer.setStatic(true);
          }
        });
      });

      this.game.events.on('resume', () => {
        this.socket?.emit('resumeCharacter');
      });
      this.socket.on('resumeCharacter', (socketId: any) => {
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
