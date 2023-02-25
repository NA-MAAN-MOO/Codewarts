//@ts-nocheck

import { createCharacterAnims } from '../anims/CharacterAnims';
import OtherPlayer from '../objects/OtherPlayer';
import Player from '../objects/Player';
import Table from 'objects/Table';
import Resource from '../objects/Resources';
import { io, Socket } from 'socket.io-client';
import store from 'stores';
import { openEditor, openGame } from 'stores/modeSlice';
import { setRoomId, setUserName } from 'stores/editorSlice';
// import { addUser, removeUser } from 'stores/chatSlice';
import { GAME_STATUS } from 'utils/Constants';
import phaserGame from 'codeuk';
import { NONE } from 'phaser';
import { MotionType, PlayerType, ServerPlayerType } from 'types';
import { soundToggles } from '../App';
import SoundPlayer from 'hooks/useSoundPlayer';
//@ts-ignore
import friendSoundFile from '../assets/sound_effect/friend_sound.mp3';
import Button from 'objects/Button';

export default class MainScene extends Phaser.Scene {
  // class 속성 명시는 constructor 이전에 명시하면 되는듯
  socket?: Socket;
  x?: number;
  y?: number;
  socketId?: string;
  player?: Player;
  map?: Phaser.Tilemaps.Tilemap;
  otherPlayers: OtherPlayer[];
  isKeyDisable: boolean;
  charKey!: string;
  tableMap: Map<string, Table>;
  watchTable!: boolean;
  editorIdx!: number;
  openMyEditor!: boolean;
  // getOut!: boolean;
  editorOwner!: string; // 현재 내가 보고 있는 에디터의 주인
  macbookList!: Array<[]>;
  chairList!: Array<[]>;
  idxDown?: Phaser.Input.Keyboard.Key;
  idxEnter?: Phaser.Input.Keyboard.Key;
  idxUp?: Phaser.Input.Keyboard.Key;
  whiteboard: Resource;
  whiteboardButton!: Button;

  constructor() {
    // Scene의 key값은 MainScene
    super('MainScene');
    this.isKeyDisable = false;
    this.macbookList = [[], [], [], [], [], []];
    this.chairList = [[], [], [], [], [], []];
    this.otherPlayers = [];
    this.tableMap = new Map<string, Table>();
  }

  create() {
    /* Transition */
    this.cameras.main.fadeFrom(1200, 0, 0, 0);
    const newFriendSoundToggle = SoundPlayer(friendSoundFile);
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
        let resource = new Resource({
          scene: this,
          resource: objs,
          polygon: polygons[objs.name],
          index: i,
        });
        if (objs.name === 'whiteboard') {
          this.whiteboard = resource;
        }
      });
    });

    /* Register laptops and chairs to Tables */
    let tableKeys = Array.from(this.tableMap.keys());
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        let targetTable = this.tableMap.get(tableKeys[i]);
        targetTable?.registerLaptop(j, this.macbookList[i][j]);
        targetTable.registerChair(j, this.chairList[i][j]);
        // this.tableMap
        //   .get(tableKeys[i])
        //   ?.registerLaptop(j, this.macbookList[i][j]);
      }
    }

    this.x = this.map.widthInPixels / 2;
    this.y = this.map.heightInPixels / 2;

    if (!phaserGame.charKey || !phaserGame.socketId || !phaserGame.userName)
      return;

    const playerInfo = {
      scene: this,
      x: this.x,
      y: this.y,
      /*----Lobby에서 받은 값으로 유저 생성----*/
      texture: phaserGame.charKey, // 이미지 이름
      id: phaserGame.socketId,
      name: phaserGame.userName,
      frame: 'down-1', // atlas.json의 첫번째 filename
    };

    this.player = new Player(playerInfo);

    // store.dispatch(addUser(phaserGame.userName));

    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      open: Phaser.Input.Keyboard.KeyCodes.E,
    });
    this.watchTable = false;

    let camera = this.cameras.main;
    camera.zoom = 1.2;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);

    if (!!phaserGame.charKey) {
      createCharacterAnims(phaserGame.charKey, phaserGame.anims);
    }

    if (!phaserGame.socket) return;
    /*----서버에 내 캐릭터 좌표 통보----*/
    phaserGame.socket.emit('loadNewPlayer', { x: this.x, y: this.y });
    /*----기존 유저 데이터 서버에 요청----*/
    phaserGame.socket.emit('currentPlayers');
    /*----기존 유저 생성----*/
    phaserGame.socket.on('currentPlayers', (payLoad: ServerPlayerType) => {
      this.addOtherPlayers({
        x: payLoad.x,
        y: payLoad.y,
        charKey: payLoad.charKey,
        socketId: payLoad.socketId,
        state: payLoad.state,
        userName: payLoad.userName,
        playerCollider: payLoad.playerCollider,
      });
    });

    /*----새 플레이어 접속----*/
    phaserGame.socket.on('newPlayer', (payLoad: ServerPlayerType) => {
      newFriendSoundToggle();
      const otherPlayerInfo = {
        x: payLoad.x,
        y: payLoad.y,
        charKey: payLoad.charKey,
        socketId: payLoad.socketId,
        state: payLoad.state,
        userName: payLoad.userName,
        playerCollider: payLoad.playerCollider,
      };
      this.addOtherPlayers(otherPlayerInfo);
      // store.dispatch(addUser(payLoad.userName));
    });
    /*----접속 해제된 유저 삭제----*/
    phaserGame.socket.on('playerDisconnect', (socketId) => {
      this.removePlayer(socketId);
    });
    /*----유저 움직임 동기화----*/
    phaserGame.socket.on('updateLocation', (payLoad) => {
      this.updateLocation(payLoad);
    });
    /*----pause상태 동기화----*/
    this.game.events.on('pause', () => {
      phaserGame.socket?.emit('pauseCharacter');
    });
    /*----pause된 유저 동기화----*/
    phaserGame.socket.on('pauseCharacter', (socketId: string) => {
      this.otherPlayers.forEach((otherPlayer: OtherPlayer) => {
        if (otherPlayer.socketId === socketId) {
          otherPlayer.setStatic(true);
        }
      });
    });
    /*---resume상태 동기화----*/
    this.game.events.on('resume', () => {
      phaserGame.socket?.emit('resumeCharacter');
    });
    /*----resume된 유저 동기화----*/
    phaserGame.socket.on('resumeCharacter', (socketId) => {
      this.otherPlayers.forEach((otherPlayer) => {
        if (otherPlayer.socketId === socketId) {
          otherPlayer.setStatic(false);
        }
      });
    });
    /*----유저 객체 충돌 상태 동기화----*/
    phaserGame.socket.on(
      'changePlayerCollider',
      (payLoad: ServerPlayerType) => {
        this.otherPlayers.forEach((otherPlayer) => {
          if (otherPlayer.socketId === payLoad.socketId) {
            otherPlayer.playerCollider.isSensor = payLoad.playerCollider;
          }
        });
      }
    );
    /*----현재 에디터 현황 서버에 요청----*/
    phaserGame.socket.emit('currentEditors');
    /*----에디터 활성화 동기화----*/
    phaserGame.socket.on(
      'updateEditor',
      (payLoad: {
        id: string;
        idx: number;
        userName: string;
        socketId: string;
      }) => {
        console.log('updateEditor');
        const table = this.tableMap.get(payLoad.id);
        if (table) {
          if (phaserGame.socketId === payLoad.socketId) {
            table.updateTable(payLoad.idx, payLoad.userName, this.player);
          } else {
            this.otherPlayers.forEach((otherPlayer: OtherPlayer) => {
              if (otherPlayer.socketId === payLoad.socketId) {
                table.updateTable(payLoad.idx, payLoad.userName, otherPlayer);
              }
            });
          }
        }
      }
    );
    /*----에디터 비활성화 동기화----*/
    phaserGame.socket.on('removeEditor', (payLoad: any) => {
      if (
        this.editorOwner === payLoad[2] &&
        phaserGame.userName !== payLoad[2]
      ) {
        store.dispatch(openGame());
      }
      // removeCurrentUser하려면 updateTable(idx, '')하면 됨
      const table = this.tableMap.get(payLoad[0]);
      if (table) {
        if (phaserGame.socketId === payLoad[3]) {
          table.updateTable(payLoad[1], '', this.player);
        } else {
          this.otherPlayers.forEach((otherPlayer: OtherPlayer) => {
            if (otherPlayer.socketId === payLoad[3]) {
              table.updateTable(payLoad[1], '', otherPlayer);
            }
          });
        }
      }
    });
    this.whiteboardButton = new Button({
      scene: this,
      x: this.whiteboard.x,
      y: this.whiteboard.y,
      text: 'E를 눌러 화이트보드 보기',
      style: {
        fontSize: '20px',
        backgroundColor: 'white',
        color: 'black',
        resolution: 20,
      },
    }).getBtn();
    this.whiteboardButton.setVisible(false);

    /* If player solve a problem, turn the solved effect on */
    // this.player.problemSolvedEffect();
  }

  update() {
    /*---- Whiteboard Interaction ----*/
    let boundWhiteboard = this.whiteboard.getBounds();
    boundWhiteboard.setSize(
      this.whiteboard.width * 1.2,
      this.whiteboard.height * 1.2
    );
    let boundPlayer = this.player?.getBounds();
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(boundWhiteboard, boundPlayer)
    ) {
      this.whiteboardButton.setVisible(true);
      if (this.player.inputKeys.open.isDown) {
        console.log('화이트보드에서 E 누름');
      }
    } else {
      this.whiteboardButton.setVisible(false);
    }

    /*--------------------에디터 열었을 때----------------------------*/
    if (store.getState().mode.status !== GAME_STATUS.GAME) {
      if (this.openMyEditor) {
        /*----내 에디터 열었을 때----*/
      }
      this.input.keyboard.disableGlobalCapture();
      this.isKeyDisable = true;
      return;
    }
    /*----------------------에디터 닫았을 때--------------------------*/
    if (this.isKeyDisable) {
      if (phaserGame.userName === this.editorOwner) {
        /*----내 에디터 닫았을 때----*/
        if (phaserGame.socket) {
          phaserGame.socket.emit('removeEditor');
        }
      }
      this.player.playerCollider.isSensor = false;
      phaserGame.socket.emit('changePlayerCollider', false);
      this.editorOwner = '';
      this.openMyEditor = false;
      this.input.keyboard.enableGlobalCapture();
      this.isKeyDisable = false;
    }
    /*-----------테이블에서 E 누르고, 리스트 보고 있는 상태--------------*/
    if (this.watchTable) {
      if (
        this.idxDown &&
        Phaser.Input.Keyboard.JustDown(this.idxDown) &&
        this.editorIdx < 4
      ) {
        this.editorIdx += 1;
      }
      if (
        this.idxUp &&
        Phaser.Input.Keyboard.JustDown(this.idxUp) &&
        this.editorIdx > 0
      ) {
        this.editorIdx -= 1;
      }
      /*------------IDE 들어가기 or 돌아가기 버튼을 누른다면-------------*/
      if (this.idxEnter && Phaser.Input.Keyboard.JustDown(this.idxEnter)) {
        if (!this.player) {
          return;
        }
        switch (this.editorIdx) {
          /*----돌아가기----*/
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
            // 돌아갈때는 내 충돌 설정을 변경시킨다.
            this.player.playerCollider.isSensor = false;
            phaserGame.socket.emit('changePlayerCollider', false);
            this.tableMap
              .get(this.player.touching[0].body.id)
              ?.clearEditorList();
            break;
          /*----에디터 들어가기----*/
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

      /*--------------에디터 리스트 보여주는 부분--------------- */
      // FIXME: body 못 읽는 부분, 일단은 touching에 무언가가 있을 때만 그려주도록 함
      if (this.player.touching.length !== 0) {
        for (let i = 0; i < 5; i++) {
          if (i === this.editorIdx) {
            this.tableMap
              .get(this.player.touching[0].body.id)
              ?.editorBtnList[i].setStyle({
                backgroundColor: 'white',
                // color: 'white',
              });
          } else {
            this.tableMap
              .get(this.player.touching[0].body.id)
              ?.editorBtnList[i].setStyle({
                backgroundColor: 'transparent',
                // color: '#ff6f00',
              });
          }
        }
      }
      return;
    }
    /*----------키보드 E키를 눌렀을 때 (테이블 상호작용 시작)---------------*/
    if (Phaser.Input.Keyboard.JustDown(this.player.inputKeys.open)) {
      if (this.player.touching.length !== 0) {
        this.editorIdx = 0;

        this.watchTable = true;
        this.player.playerCollider.isSensor = true;
        phaserGame.socket.emit('changePlayerCollider', true);

        let tableId = this.player.touching[0].body.id;
        let tableInstance = this.tableMap.get(tableId);
        tableInstance?.openEditorList();
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
      }
    }
    this.player.setStatic(false);
    this.player.move();
  }

  addOtherPlayers(playerInfo: ServerPlayerType) {
    const otherPlayer = new OtherPlayer({
      scene: this,
      x: playerInfo.x,
      y: playerInfo.y,
      texture: playerInfo.charKey,
      id: playerInfo.socketId,
      /*----atlas.json의 첫번째 filename----*/
      frame: 'down-1',
      name: playerInfo.userName,
    });
    otherPlayer.playerCollider.isSensor = playerInfo.playerCollider;
    if (playerInfo.state === 'paused') {
      otherPlayer.setStatic(true);
    }
    otherPlayer.socketId = playerInfo.socketId;
    this.otherPlayers.push(otherPlayer);
  }

  removePlayer(res: string) {
    let removingName = '';
    this.otherPlayers.forEach((player) => {
      if (player.socketId === res) {
        removingName = player.name;
        player.destroy();
        player.playerNameBubble.destroy();
      }
    });
    // store.dispatch(removeUser(removingName));
    this.otherPlayers.filter((player) => player.socketId !== res);
  }

  updateLocation(payLoad: MotionType) {
    this.otherPlayers.forEach((otherPlayer) => {
      if (otherPlayer.socketId === payLoad.socketId) {
        switch (payLoad.motion) {
          case 'left':
            otherPlayer.play(`${otherPlayer.playerTexture}-walk-left`, true);
            break;
          case 'right':
            otherPlayer.play(`${otherPlayer.playerTexture}-walk-right`, true);
            break;
          case 'up':
            otherPlayer.play(`${otherPlayer.playerTexture}-walk-up`, true);
            break;
          case 'down':
            otherPlayer.play(`${otherPlayer.playerTexture}-walk-down`, true);
            break;
          case 'idle':
            otherPlayer.play(`${otherPlayer.playerTexture}-idle-down`, true);
            break;
        }
        otherPlayer.setPosition(payLoad.x, payLoad.y);
        otherPlayer.playerNameBubble.setPosition(
          payLoad.x,
          payLoad.y - otherPlayer.height / 2 - 10
        );
      }
    });
  }

  enterEditor(tableId: any, idx: number) {
    /*----내 에디터에 들어가면----*/
    let targetTable = this.tableMap.get(tableId);
    if (!targetTable.tableInfo.get(idx).username) {
      // 실제로 에디터 창 열어주는 부분
      // this.tableMap.get(tableId).tableInfo[idx].username = phaserGame.userName;

      targetTable.updateTable(idx, phaserGame.userName, this.player);
      // targetTable?.sitOnChair(idx, this.player);

      let payLoad = {
        id: tableId,
        idx: idx,
        // FIXME: 페이로드에 sprite, socketId 추가함
        sprite: this.player,
        socketId: phaserGame.socketId,
      };

      this.openMyEditor = true;
      this.editorOwner = phaserGame.userName;

      phaserGame.socket.emit('addEditor', payLoad);
      store.dispatch(setRoomId(phaserGame.userName));
      store.dispatch(setUserName(phaserGame.userName));
      // 에디터 창 열기
      store.dispatch(openEditor());
      /*----다른 사람 에디터에 들어가면----*/
    } else {
      this.editorOwner = targetTable.tableInfo.get(idx).username;
      store.dispatch(setRoomId(this.editorOwner));
      store.dispatch(setUserName(phaserGame.userName));
      // 에디터 창 열기
      store.dispatch(openEditor());
    }
  }
}
