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
  tableObject: Resource;
  tableId: number;
  usercount: number;
  //   tableInfo: tableStateType;
  tableInfo: any = new Map();
  buttonToEditor: any;

  constructor(tableObject: Resource, tableId: number) {
    this.usercount = 0;
    for (let i = 0; i < 4; i++) {
      this.tableInfo.set(i, tableInfoModel);
    }
    this.tableObject = tableObject;
    this.tableId = tableId;
  }

  /* Add current user to a table (Open my Editor room) */
  addCurrentUser(username: string, roomId: any) {
    if (this.usercount >= 4) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      // Add user if there's no user using laptop
      //@ts-ignore
      if (!this.tableState[i].username) {
        this.tableInfo[i] = {
          ...this.tableInfo[i],
          username: username,
          roomId: roomId,
        };
        this.usercount++;
        // 맥북 texture 바꾸기
        // this.updateLaptopImage(i);
        break;
      }
    }
  }

  /* Remove current user from a table (Delete my info from a table) */
  removeCurrentUser(username: string) {
    if (this.usercount <= 0) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      //@ts-ignore
      if (this.tableState[i].username === username) {
        //@ts-ignore
        this.tableState[i].username = undefined;
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
      this.tableInfo[i].laptop = laptops[i];
    }
  }

  registerChairs(chairs: any) {
    for (let i = 0; i < 4; i++) {
      this.tableInfo[i].chair = chairs[i];
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
      this.tableInfo[index].laptop.setTexture(`${texture}open.png`);
    } else {
      this.tableInfo[index].laptop.setTexture(`${texture}closed.png`);
    }
  }

  /* Change chair sprite texture */
}
