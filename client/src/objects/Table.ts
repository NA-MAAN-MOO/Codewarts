import Phaser from 'phaser';
import Resource from './Resources';
import Player from './Player';

const tableInfoModel = {
  username: '',
  editorName: 0,
  laptop: undefined,
  chair: undefined,
};

export default class Table {
  scene: Phaser.Scene;
  tableObject: Resource;
  tableId: number;
  usercount: number;
  tableInfo: any = new Map();
  buttonToEditor: any;
  editorListDialog!: Phaser.GameObjects.Container;
  editorBtnList!: any;
  fires!: Phaser.GameObjects.Sprite[];

  constructor(scene: Phaser.Scene, tableObject: Resource, tableId: number) {
    this.usercount = 0;
    for (let i = 0; i < 4; i++) {
      this.tableInfo.set(i, { ...tableInfoModel });
    }
    this.tableObject = tableObject;
    this.tableId = tableId;
    this.scene = scene;
    this.editorBtnList = [];
  }

  openEditorList() {
    this.editorListDialog = this.scene.add.container().setDepth(20);
    this.editorListDialog.add(
      this.scene.add
        .graphics()
        .fillStyle(0xeeeeee, 0.9)
        .fillRoundedRect(
          this.tableObject.x - 135,
          this.tableObject.y - 150,
          270,
          220
        )
    );

    for (let i = 0; i < 4; i++) {
      let str: string = ``;
      let fontStyle: any;
      let username = this.tableInfo.get(i).username;
      if (username) {
        str = `🧙🏻‍♂️${this.tableInfo.get(i).username}의 에디터 열기`;
        fontStyle = { fontSize: '20px', color: '#e06609' };
      } else {
        str = `🔥${i + 1}번 에디터 들어가기`;
        fontStyle = { fontSize: '20px', color: '#c21723' };
      }

      let editorButton = this.scene.add
        .text(0, 0, str, {
          fontFamily: 'NeoDunggeunmoPro-Regular',
        })
        .setStyle(fontStyle)
        .setOrigin(0.5, 0.5)
        .setPadding(15, 5, 15, 5);
      this.editorBtnList.push(editorButton);
      this.editorListDialog.add(
        editorButton.setPosition(
          this.tableObject.x,
          this.tableObject.y - 120 + 35 * i
        )
      );
    }
    let backButton = this.scene.add
      .text(0, 0, '돌아가기', {
        fontFamily: 'NeoDunggeunmoPro-Regular',
      })
      .setStyle({ fontSize: '18px', color: '#333333', align: 'center' })
      .setPosition(this.tableObject.x, this.tableObject.y + 40)
      .setOrigin(0.5, 0.5)
      .setPadding(15, 5, 15, 5);
    this.editorBtnList.push(backButton);
    this.editorListDialog.add(backButton).setDepth(60);
  }

  clearEditorList() {
    this.editorBtnList = [];
    this.editorListDialog.removeAll(true);
  }

  /* Add current user to a table (Open my Editor room) */
  addCurrentUser(editorIdx: number, username: string, editorName: any) {
    if (this.usercount >= 4) {
      return;
    }
    //@ts-ignore
    if (!this.tableInfo.get(editorIdx).username) {
      let targetPlace = this.tableInfo.get(editorIdx);
      targetPlace[username] = username;
      targetPlace[editorName] = editorName;
      this.usercount++;
    }
  }

  registerLaptop(index: number, laptop: any) {
    this.tableInfo.get(index)['laptop'] = laptop;
  }

  registerChair(index: number, chair: any) {
    this.tableInfo.get(index)['chair'] = chair;
  }

  /* Change laptop sprite texture */
  updateLaptopImage(index: number) {
    let texture: string;
    if (index < 2) {
      texture = 'macbook_back_';
    } else {
      texture = 'macbook_front_';
    }

    if (!this.tableInfo.get(index)['username']) {
      this.tableInfo.get(index)['laptop'].setTexture(`${texture}open`);
    } else {
      this.tableInfo.get(index)['laptop'].setTexture(`${texture}closed`);
    }
  }

  sitOnChair(index: number, player: Player) {
    /* Change chair texture */
    let chair: Resource = this.tableInfo.get(index)['chair'];
    chair.setTexture(`${player.playerTexture}_${chair.texture.key}`);

    /* Make player not visible */
    player.setVisible(false);
    player.setPosition(chair.x, chair.y);
    player.playerNameBubble.setPosition(
      chair.x,
      chair.y - player.height / 2 - 25
    );
    player.playerNameBubble.setDepth(60);
    player.addFireEffect(chair);
  }

  standUpFromChair(index: number, player: Player) {
    let chair: Resource = this.tableInfo.get(index)['chair'];
    if (index < 2) {
      chair.setTexture(`chair_front`);
    } else {
      chair.setTexture(`chair_back`);
    }
    player.playerNameBubble.setDepth(50);

    player.setVisible(true);
    player.removeFireEffect();
  }

  updateTable(idx: number, userName: string, player: Player) {
    this.updateLaptopImage(idx);

    this.tableInfo.get(idx)['username'] = userName;
    this.tableInfo.get(idx)['editorName'] = userName;

    if (!(userName === '')) {
      this.sitOnChair(idx, player);
    } else {
      this.standUpFromChair(idx, player);
    }
  }
}
