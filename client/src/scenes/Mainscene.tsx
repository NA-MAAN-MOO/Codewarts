//@ts-nocheck

import { createCharacterAnims } from '../anims/CharacterAnims';
import OtherPlayer from '../objects/OtherPlayer';
import Player from '../objects/Player';
import Resource from '../objects/Resources';
import { io, Socket } from 'socket.io-client';
import store from 'stores';
import { openEditor, openGame } from 'stores/modeSlice';
import { setRoomId, setUserName } from 'stores/editorSlice';
import { GAME_STATUS } from 'utils/Constants';
import Table from 'objects/Table';
import phaserGame from 'codeuk';
import { NONE } from 'phaser';

export default class MainScene extends Phaser.Scene {
  // class 속성 명시는 constructor 이전에 명시하면 되는듯
  socket: Socket | undefined;
  x?: number;
  y?: number;
  socketId?: string;
  player?: Player;
  map?: Phaser.Tilemaps.Tilemap;
  otherPlayers: OtherPlayer[];
  isKeyDisable: boolean;
  charKey!: string;
  tableMap = new Map<number, Table>();
  watchTable!: boolean;
  editorIdx!: number;
  openMyEditor!: boolean;
  // getOut!: boolean;
  editorOwner!: string;
  macbookList!: Array<[]>;

  constructor() {
    // Scene의 key값은 MainScene
    super('MainScene');
    this.isKeyDisable = false;
    this.macbookList = [[], [], [], [], [], []];
    this.otherPlayers = [];
  }

  preload() {
    // 미리 로드하는 메서드, 이미지 등을 미리 로드한다.
    Player.preload(this);
    Resource.preload(this);
    this.load.image('room_map', 'assets/room/room_map.png');
    this.load.tilemapTiledJSON('room_map_tile', 'assets/room/room_map.json');
  }
  create() {
    // this.getOut = false;
    this.openMyEditor = false;
    this.editorOwner = '';
    // 생성해야 하는 것, 게임 오브젝트 등
    /* Setting room map ground */
    this.map = this.make.tilemap({ key: 'room_map_tile' }); //Json file key (1st parameter in tilemapTiledJSON)
    const room_map_tileset = this.map.addTilesetImage('room_map', 'room_map'); // 1st param: tilesets.name in Json file
    const bglayer = this.map.createLayer('bg', room_map_tileset, 0, 0);
    bglayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(bglayer);

    /* Extracting objects' polygons from TiledJson */
    const polygons = this.map.tilesets.reduce(
      (acc: Record<string, any[]>, obj: Phaser.Tilemaps.Tileset) => {
        let polygonArray = Object.entries(obj.tileData)[0][1].objectgroup
          .objects[0].polygon;
        let key = obj.name;
        acc[key] = polygonArray;
        return acc;
      },
      {}
    );

    /* Adding Object Layers from TiledJSON */
    this.map.objects.forEach((objLayer) => {
      objLayer.objects.forEach((objs, i) => {
        new Resource({
          scene: this,
          resource: objs,
          polygon: polygons[objs.name],
          index: i,
        });
      });
    });

    /* Register laptops to Tables */
    let tableKeys = Array.from(this.tableMap.keys());
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        this.tableMap
          .get(tableKeys[i])
          ?.registerLaptop(j, this.macbookList[i][j]);
      }
    }

    this.x = this.map.widthInPixels / 2;
    this.y = this.map.heightInPixels / 2;
    this.player = new Player({
      scene: this,
      x: this.x,
      y: this.y,
      // Lobby에서 받은 값으로 유저 생성
      texture: phaserGame.charKey, // 이미지 이름
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
    if (!!phaserGame.charKey) {
      createCharacterAnims(phaserGame.charKey, phaserGame.anims);
    }

    if (phaserGame.socket) {
      phaserGame.socket.emit('loadNewPlayer', { x: this.x, y: this.y });

      // 기존 유저 그려줘! 하고 요청하기
      phaserGame.socket.emit('currentPlayers');
      phaserGame.socket.on('currentPlayers', (payLoad: any) => {
        console.log('currentPlayers');
        this.addOtherPlayers({
          x: payLoad.x,
          y: payLoad.y,
          charKey: payLoad.charKey,
          socketId: payLoad.socketId,
          state: payLoad.state,
        });
      });
      phaserGame.socket.on('newPlayer', (payLoad: any) => {
        this.addOtherPlayers({
          x: payLoad.x,
          y: payLoad.y,
          charKey: payLoad.charKey,
          socketId: payLoad.socketId,
          state: payLoad.state,
        });
      });
      phaserGame.socket.on('playerDisconnect', (socketId: any) => {
        this.removePlayer(socketId);
      });
      phaserGame.socket.on('updateLocation', (payLoad: any) => {
        this.updateLocation(payLoad);
      });
      this.game.events.on('pause', () => {
        phaserGame.socket?.emit('pauseCharacter');
      });
      phaserGame.socket.on('pauseCharacter', (socketId: any) => {
        this.otherPlayers.forEach((otherPlayer: any) => {
          if (otherPlayer.socketId === socketId) {
            otherPlayer.setStatic(true);
          }
        });
      });

      this.game.events.on('resume', () => {
        phaserGame.socket?.emit('resumeCharacter');
      });
      phaserGame.socket.on('resumeCharacter', (socketId: any) => {
        this.otherPlayers.forEach((otherPlayer: any) => {
          if (otherPlayer.socketId === socketId) {
            otherPlayer.setStatic(false);
          }
        });
      });

      phaserGame.socket.emit('currentEditors');
      // TODO: 강제로 해당 tableMap.get(id)를 새로 그리라고 해야한다. 02.14
      phaserGame.socket.on(
        'updateEditor',
        (payLoad: { id: string; idx: number; userName: string }) => {
          console.log('updateEditor');
          this.tableMap
            .get(payLoad.id)
            .updateTable(payLoad.idx, payLoad.userName);
        }
      );

      // TODO: 강제로 보고있는 다른 유저들 강퇴 (상태값 바꿔야함 - 게임모드로)
      phaserGame.socket.on('removeEditor', (payLoad: any) => {
        console.log('방 빼요');
        if (
          this.editorOwner === payLoad[2] &&
          phaserGame.userName !== payLoad[2]
        ) {
          console.log('방 빼요');
          store.dispatch(openGame());
        }
        // removeCurrentUser하려면 updateTable(idx, '')하면 됨
        this.tableMap.get(payLoad[0]).updateTable(payLoad[1], '');
        // this.tableMap.get(payLoad[0]).removeCurrentUser(payLoad[1]);
      });
    }
  }

  update() {
    if (store.getState().mode.status !== GAME_STATUS.GAME) {
      if (this.openMyEditor) {
        console.log('1차관문, 여기 왔으면 내 에디터 열었다는 뜻');
      }
      this.input.keyboard.disableGlobalCapture();
      this.isKeyDisable = true;
      return;
    }
    if (this.isKeyDisable) {
      if (phaserGame.userName === this.editorOwner) {
        console.log('2차관문, 여기오면 내 에디터 닫았다는 뜻');
        phaserGame.socket.emit('removeEditor');
      }
      this.editorOwner = '';
      this.openMyEditor = false;
      this.input.keyboard.enableGlobalCapture();
      this.isKeyDisable = false;
    }
    if (this.watchTable) {
      // this.player.setStatic(true);
      if (Phaser.Input.Keyboard.JustDown(this.idxDown) && this.editorIdx < 4) {
        this.editorIdx += 1;
      }
      if (Phaser.Input.Keyboard.JustDown(this.idxUp) && this.editorIdx > 0) {
        this.editorIdx -= 1;
      }
      if (Phaser.Input.Keyboard.JustDown(this.idxEnter)) {
        switch (this.editorIdx) {
          case 4:
            this.input.keyboard.disableGlobalCapture();
            this.player.inputKeys = this.input.keyboard.addKeys({
              up: Phaser.Input.Keyboard.KeyCodes.UP,
              down: Phaser.Input.Keyboard.KeyCodes.DOWN,
              left: Phaser.Input.Keyboard.KeyCodes.LEFT,
              right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
              open: Phaser.Input.Keyboard.KeyCodes.E,
            });
            this.watchTable = false;
            this.tableMap
              .get(this.player.touching[0].body.id)
              ?.clearEditorList();
            break;
          default:
            this.input.keyboard.disableGlobalCapture();
            this.player.inputKeys = this.input.keyboard.addKeys({
              up: Phaser.Input.Keyboard.KeyCodes.UP,
              down: Phaser.Input.Keyboard.KeyCodes.DOWN,
              left: Phaser.Input.Keyboard.KeyCodes.LEFT,
              right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
              open: Phaser.Input.Keyboard.KeyCodes.E,
            });
            this.watchTable = false;
            this.enterEditor(this.player.touching[0].body.id, this.editorIdx);
            this.tableMap
              .get(this.player.touching[0].body.id)
              ?.clearEditorList();
            break;
        }
      }
      // 돌아가기 눌러서 table의 editorList 없어졌을 때 버그 안 생기도록 추가한 라인
      if (!this.watchTable) return;

      for (let i = 0; i < 5; i++) {
        if (i === this.editorIdx) {
          this.tableMap
            .get(this.player.touching[0].body.id)
            ?.editorBtnList[i].setStyle({
              backgroundColor: '#ff6f00',
              color: 'white',
            });
        } else {
          this.tableMap
            .get(this.player.touching[0].body.id)
            ?.editorBtnList[i].setStyle({
              backgroundColor: 'transparent',
              color: '#ff6f00',
            });
        }
      }

      return;
    }
    // 키보드 E키를 눌렀을 때
    if (Phaser.Input.Keyboard.JustDown(this.player.inputKeys.open)) {
      if (this.player.touching.length !== 0) {
        this.editorIdx = 0;
        // console.log(this.player.touching[0].body.id);
        this.watchTable = true;
        this.player.setStatic(true);

        let tableId = this.player.touching[0].body.id;
        let tableInstance = this.tableMap.get(tableId);
        tableInstance?.openEditorList();

        // this.player.touching[0].macbookList.forEach((mac: any) => {
        //   mac.setVisible(true);
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
        // });
      }
    }
    this.player.setStatic(false);
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

  enterEditor(tableId: any, idx: number) {
    if (!this.tableMap.get(tableId).tableInfo.get(idx).username) {
      // 실제로 에디터 창 열어주는 부분
      // this.tableMap.get(tableId).tableInfo[idx].username = phaserGame.userName;
      this.tableMap.get(tableId).updateTable(idx, phaserGame.userName);

      let payLoad = {
        id: tableId,
        idx: idx,
      };
      this.openMyEditor = true;
      this.editorOwner = phaserGame.userName;
      // console.log(this.openMyEditor);
      phaserGame.socket.emit('addEditor', payLoad);
      store.dispatch(setRoomId(phaserGame.userName));
      store.dispatch(setUserName(phaserGame.userName));
      // 에디터 창 열기
      store.dispatch(openEditor());
      // console.log(this.tableMap.get(tableId).tableInfo.get(idx).username);
    } else {
      this.editorOwner = this.tableMap.get(tableId).tableInfo.get(idx).username;
      console.log(this.editorOwner);
      store.dispatch(setRoomId(this.editorOwner));
      store.dispatch(setUserName(phaserGame.userName));
      // 에디터 창 열기
      store.dispatch(openEditor());
    }
  }
}
