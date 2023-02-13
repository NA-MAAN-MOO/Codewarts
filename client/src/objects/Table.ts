import Phaser from 'phaser';
import Resource from './Resources';

// type tableStateType = { [index: number]: object };
const tableInfoModel = {
  username: undefined,
  roomId: undefined,
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
      this.tableInfo.set(i, tableInfoModel);
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
          this.tableObject.x - 100,
          this.tableObject.y - 150,
          200,
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
        .setStyle({ fontSize: '20px', color: '#ff6f00' });
      this.editorBtnList.push(editorButton);
      this.editorListDialog.add(
        editorButton.setPosition(
          this.tableObject.x - 80,
          this.tableObject.y - 120 + 30 * i
        )
      );
    }
    let backButton = this.scene.add
      .text(0, 0, '돌아가기')
      .setStyle({ fontSize: '20px', color: 'black', align: 'center' })
      .setPosition(this.tableObject.x - 80, this.tableObject.y + 30);
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
  removeCurrentUser(username: string) {
    if (this.usercount <= 0) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      //@ts-ignore
      if (this.tableInfo.get(i).username === username) {
        //@ts-ignore
        this.tableInfo.get(i).username = undefined;
        // 에디터에 썼던 내용은 저장해두기?
      }
      this.usercount--;
    }
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
    console.log('이거 몇번 호출됨?');
    console.log('이전', this.tableInfo);
    this.tableInfo.get(idx)['username'] = userName;
    this.tableInfo.get(idx)['roomId'] = userName;
    console.log('이후', this.tableInfo);
  }
  /* Change chair sprite texture */
}
