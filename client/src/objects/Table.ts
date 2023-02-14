import Phaser from 'phaser';
import Resource from './Resources';

// type tableStateType = { [index: number]: object };
const tableInfoModel = {
  username: '',
  roomId: 0,
  laptop: undefined,
  chair: undefined,
};

export default class Table {
  scene: Phaser.Scene;
  tableObject: Resource;
  tableId: number;
  usercount: number;
  //   tableInfo: tableStateType;
  tableInfo: any = new Map();
  buttonToEditor: any;
  editorListDialog!: Phaser.GameObjects.Container;
  editorBtnList!: any;

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
        .fillStyle(0xeeeeee, 1)
        .fillRoundedRect(
          this.tableObject.x - 135,
          this.tableObject.y - 150,
          270,
          220
        )
    );

    for (let i = 0; i < 4; i++) {
      let str: string = ``;
      if (this.tableInfo.get(i).username) {
        console.log(this.tableInfo.get(i));
        str = `${this.tableInfo.get(i).username} IDE 열기`;
      } else {
        str = `${i + 1}번 방 들어가기`;
      }
      let editorButton = this.scene.add
        .text(0, 0, str)
        .setStyle({ fontSize: '20px', color: '#ff6f00' })
        .setOrigin(0.5, 0.5);
      this.editorBtnList.push(editorButton);
      this.editorListDialog.add(
        editorButton.setPosition(
          this.tableObject.x,
          this.tableObject.y - 120 + 30 * i
        )
      );
    }
    let backButton = this.scene.add
      .text(0, 0, '돌아가기')
      .setStyle({ fontSize: '20px', color: 'black', align: 'center' })
      .setPosition(this.tableObject.x, this.tableObject.y + 30)
      .setOrigin(0.5, 0.5);
    this.editorBtnList.push(backButton);
    this.editorListDialog.add(backButton);
  }

  clearEditorList() {
    this.editorBtnList = [];
    this.editorListDialog.removeAll(true);
  }

  /* Add current user to a table (Open my Editor room) */
  addCurrentUser(editorIdx: number, username: string, roomId: any) {
    if (this.usercount >= 4) {
      return;
    }
    //@ts-ignore
    if (!this.tableInfo.get(editorIdx).username) {
      let targetPlace = this.tableInfo.get(editorIdx);
      targetPlace[username] = username;
      targetPlace[roomId] = roomId;
      this.usercount++;
      // 맥북 texture 바꾸기
      // this.updateLaptopImage(i);
    }
  }

  /* Remove current user from a table (Delete my info from a table) */
  removeCurrentUser(idx: number) {
    this.tableInfo.get(idx).username = undefined;
    this.tableInfo.get(idx).roomId = undefined;
  }

  /* Join an Editor room in a Table (other user's Editor room) */
  join(currentUser: any, roomId: any) {}

  /* Leave an Editor room in a Table (other user's Editor room) */
  leave(currentUser: any, roomId: any) {}

  registerLaptops(laptops: any) {
    for (let i = 0; i < 4; i++) {
      this.tableInfo.get(i)['laptop'] = laptops[i];
    }
  }

  registerChairs(chairs: any) {
    for (let i = 0; i < 4; i++) {
      this.tableInfo.get(i)['chair'] = chairs[i];
    }
  }

  /* Change laptop sprite texture */
  updateLaptopImage(index: number) {
    let texture: string;
    if (index < 2) {
      texture = 'assets/room/macbook_back_';
    } else {
      texture = 'assets/room/macbook_front_';
    }

    if (!this.tableInfo[index].username) {
      this.tableInfo.get(index)['laptop'].setTexture(`${texture}open.png`);
    } else {
      this.tableInfo.get(index)['laptop'].setTexture(`${texture}closed.png`);
    }
  }

  updateTable(idx: number, userName: string) {
    this.tableInfo.get(idx)['username'] = userName;
    this.tableInfo.get(idx)['roomId'] = userName;
  }
  /* Change chair sprite texture */
}
