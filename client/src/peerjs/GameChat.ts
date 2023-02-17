//메인 게임 내에서의 peer 구성

import Peer from 'peerjs';
import ChatSession from 'peerjs/ChatSession';

export default class GameChat {
  session?: ChatSession;
  sessionId!: string;
  constructor(sessionId: string) {
    const protocol = window.location.protocol.replace('http', 'ws');
    const endpoint =
      process.env.NODE_ENV === 'production'
        ? 'localhost:3000'
        : `${protocol}//${window.location.hostname}:2567`;
    this.sessionId = sessionId;
  }

  initialize() {
    this.session = new ChatSession(this.sessionId);
  }
}
