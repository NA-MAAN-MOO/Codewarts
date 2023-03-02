import { MuteInfoType } from '../types/Voice';

//값이 true면 뮤트 상태임
class VolMuteInfo {
  private static instance: VolMuteInfo;
  private data: MuteInfoType = {};

  private constructor() {}

  static getInstance() {
    if (!VolMuteInfo.instance) {
      VolMuteInfo.instance = new VolMuteInfo();
    }
    return VolMuteInfo.instance;
  }

  set(key: string, value: boolean) {
    this.data[key] = value;
  }

  switch(key: string) {
    this.data[key] = !this.data[key];
  }

  get(key: string) {
    return this.data[key];
  }

  getAll() {
    return this.data;
  }

  remove(key: string) {
    delete this.data[key];
  }
}

export default VolMuteInfo.getInstance();
