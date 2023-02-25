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
      // Lobby에서 받은 값으로 유저 생성
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

    phaserGame.socket.emit('loadNewPlayer', { x: this.x, y: this.y });

    // 기존 유저 그려줘! 하고 요청하기
    phaserGame.socket.emit('currentPlayers');
    phaserGame.socket.on('currentPlayers', (payLoad: ServerPlayerType) => {
      console.log('currentPlayers');
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

    phaserGame.socket.on('newPlayer', (payLoad: ServerPlayerType) => {
      //새 플레이어가 들어옴
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
    phaserGame.socket.on('playerDisconnect', (socketId) => {
      this.removePlayer(socketId);
    });
    phaserGame.socket.on('updateLocation', (payLoad) => {
      this.updateLocation(payLoad);
    });
    this.game.events.on('pause', () => {
      phaserGame.socket?.emit('pauseCharacter');
    });
    phaserGame.socket.on('pauseCharacter', (socketId: string) => {
      this.otherPlayers.forEach((otherPlayer: OtherPlayer) => {
        if (otherPlayer.socketId === socketId) {
          otherPlayer.setStatic(true);
        }
      });
    });

    this.game.events.on('resume', () => {
      phaserGame.socket?.emit('resumeCharacter');
    });
    phaserGame.socket.on('resumeCharacter', (socketId) => {
      this.otherPlayers.forEach((otherPlayer) => {
        if (otherPlayer.socketId === socketId) {
          otherPlayer.setStatic(false);
        }
      });
    });

    // playerCollider가 변경되면 데이터를 받아서 변경시켜준다.
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

    phaserGame.socket.emit('currentEditors');
    // TODO: 강제로 해당 tableMap.get(id)를 새로 그리라고 해야한다. 02.14
    phaserGame.socket.on(
      'updateEditor',
      (payLoad: {
        id: string;
        idx: number;
        userName: string;
        //FIXME:
        socketId: string;
      }) => {
        console.log('updateEditor');
        const table = this.tableMap.get(payLoad.id);
        if (table) {
          //FIXME: 내 에디터 업데이트
          if (phaserGame.socketId === payLoad.socketId) {
            table.updateTable(payLoad.idx, payLoad.userName, this.player);
          }
          //FIXME: socketId가 일치하는 other player를 앉힘
          else {
            this.otherPlayers.forEach((otherPlayer: OtherPlayer) => {
              if (otherPlayer.socketId === payLoad.socketId) {
                table.updateTable(payLoad.idx, payLoad.userName, otherPlayer);
              }
            });
          }
        }
      }
    );

    /* 내가 에디터를 종료할 때 */
    // TODO: 강제로 보고있는 다른 유저들 강퇴 (상태값 바꿔야함 - 게임모드로)
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
        //FIXME: 일어나게 하기
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
    /*-------------------------------*/

    /*--------------------내 에디터 열었을 때----------------------------*/
    if (store.getState().mode.status !== GAME_STATUS.GAME) {
      if (this.openMyEditor) {
        // console.log('1차관문, 여기 왔으면 내 에디터 열었다는 뜻');
      }
      console.log('1111111여기서 삭제된다');
      this.input.keyboard.disableGlobalCapture();
      this.isKeyDisable = true;
      return;
    }
    /*----------------------내 에디터 닫았을 때--------------------------*/
    if (this.isKeyDisable) {
      if (phaserGame.userName === this.editorOwner) {
        // console.log('2차관문, 여기오면 내 에디터 닫았다는 뜻');
        if (phaserGame.socket) {
          phaserGame.socket.emit('removeEditor');
        }
      }
      this.player.playerCollider.isSensor = false;
      console.log('에디터 닫았을 때');
      phaserGame.socket.emit('changePlayerCollider', false);
      this.editorOwner = '';
      this.openMyEditor = false;
      this.input.keyboard.enableGlobalCapture();
      this.isKeyDisable = false;
    }
    /*-----------테이블에서 E 누르고, 리스트 보고 있는 상태--------------*/
    if (this.watchTable) {
      // this.player.setStatic(true);
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
          //돌아가기 버튼 누르면
          case 4:
            console.log('2222222여기서 삭제된다');
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
            // TODO: 이 시점에 다른 유저들에게 내 상태변경 통보
            phaserGame.socket.emit('changePlayerCollider', false);
            this.tableMap
              .get(this.player.touching[0].body.id)
              ?.clearEditorList();
            break;
          // 에디터 들어가기 버튼 누르면
          default:
            console.log('3333333여기서 삭제된다');
            this.input.keyboard.disableGlobalCapture();
            this.player.inputKeys = this.input.keyboard.addKeys({
              up: Phaser.Input.Keyboard.KeyCodes.UP,
              down: Phaser.Input.Keyboard.KeyCodes.DOWN,
              left: Phaser.Input.Keyboard.KeyCodes.LEFT,
              right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
              open: Phaser.Input.Keyboard.KeyCodes.E,
            });
            this.watchTable = false;
            // 비록 테이블 에디터 리스트는 꺼지지만, 내 충돌 설정을 변경되지 않는다.
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
        // 에디터 키면 유령되자.
        this.player.playerCollider.isSensor = true;
        // TODO: 이 시점에 다른 유저들에게 내 상태변경 통보
        phaserGame.socket.emit('changePlayerCollider', true);
        console.log('플레이어 멈춤');

        let tableId = this.player.touching[0].body.id;
        let tableInstance = this.tableMap.get(tableId);
        tableInstance?.openEditorList();
        console.log('4444444여기서 삭제된다');
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
      // playerInfo를 바탕으로 새로운 플레이어 객체를 그려준다.
      // 해당 플레이어 객체를 움직이려면 어쩔까?
      scene: this,
      x: playerInfo.x,
      y: playerInfo.y,
      texture: playerInfo.charKey, // 이미지 이름
      id: playerInfo.socketId,
      frame: 'down-1', // atlas.json의 첫번째 filename
      name: playerInfo.userName,
    });
    // collisionState가 true면 유령, false면 충돌
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
    // *** 내 에디터에 들어가면 ***
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
      // *** 다른 사람 에디터에 들어가면 ***
    } else {
      this.editorOwner = targetTable.tableInfo.get(idx).username;
      // console.log(this.editorOwner);
      store.dispatch(setRoomId(this.editorOwner));
      store.dispatch(setUserName(phaserGame.userName));
      // 에디터 창 열기
      store.dispatch(openEditor());
    }
  }
}
