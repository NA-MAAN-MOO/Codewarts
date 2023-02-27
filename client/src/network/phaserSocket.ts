import Lobby from 'scenes/Lobby';
import phaserGame from 'codeuk';
import { io, Socket } from 'socket.io-client';

const APPLICATION_SERVER_URL =
  process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const initSocket = (data: any, scene: Lobby) => {
  phaserGame.socket = io(`${APPLICATION_SERVER_URL}`);
  phaserGame.socket.on('start', (payLoad: { socketId: string }) => {
    // Server에서 보내주는 고유 값을 받는다.
    phaserGame.socketId = payLoad.socketId;
    phaserGame.charKey = data.playerTexture;
    phaserGame.userName = data.playerId;

    phaserGame.socket?.emit('savePlayer', {
      charKey: phaserGame.charKey,
      userName: phaserGame.userName,
    });

    scene.network = true;
  });
};

const getPhaserSocket = () => {
  return phaserGame.socket;
};

export { initSocket, getPhaserSocket };
