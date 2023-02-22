import { CharInfoType } from '../types/Game';

class CharInfo {
  private static instance: CharInfo;
  private data: CharInfoType = {};

  private constructor() {}

  static getInstance() {
    if (!CharInfo.instance) {
      CharInfo.instance = new CharInfo();
    }
    return CharInfo.instance;
  }

  set(key: string, value: string) {
    this.data[key] = value;
  }

  get(key: string) {
    return this.data[key];
  }
}

export default CharInfo.getInstance();
