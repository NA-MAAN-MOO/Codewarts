import { MuteInfoType } from '../types/Voice';

//값이 true면 뮤트 상태임
class MicMuteInfo {
  private static instance: MicMuteInfo;
  private data: MuteInfoType = {};

  private constructor() {}

  static getInstance() {
    if (!MicMuteInfo.instance) {
      MicMuteInfo.instance = new MicMuteInfo();
    }
    return MicMuteInfo.instance;
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

export default MicMuteInfo.getInstance();
