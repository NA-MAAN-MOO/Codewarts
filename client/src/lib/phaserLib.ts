import phaserGame from 'codeuk';
import store from 'stores';
import { openGame, openEditor, openLobby, openStart } from 'stores/modeSlice';
import { GAME_STATUS } from 'utils/Constants';
import Background from 'scenes/Background';

export const handleScene = async (statusTo: string, data: any = {}) => {
  switch (statusTo) {
    case GAME_STATUS.START:
      store.dispatch(openStart());
      for (let scene of phaserGame.scene.getScenes()) {
        const sceneKey = scene.scene.key;
        if (sceneKey !== 'background' && phaserGame.scene.isActive(sceneKey)) {
          phaserGame.scene.sleep(sceneKey);
        }
      }
      // if (phaserGame.scene.isSleeping('Start')) {
      //   phaserGame.scene.wake('Start');
      // } else {
      //   phaserGame.scene.start('Start');
      // }
      break;
    case GAME_STATUS.LOBBY:
      store.dispatch(openLobby());
      phaserGame.scene.sleep('Start');
      if (phaserGame.scene.isSleeping('Lobby')) {
        phaserGame.scene.wake('Lobby');
      } else {
        phaserGame.scene.start('Lobby', data);
      }
      break;
    case GAME_STATUS.GAME:
      store.dispatch(openGame());
      phaserGame.scene.sleep('Lobby');
      if (phaserGame.scene.isSleeping('MainScene')) {
        phaserGame.scene.wake('MainScene');
      } else {
        phaserGame.scene.start('MainScene');
      }
      break;
    case GAME_STATUS.EDITOR:
      store.dispatch(openEditor());
      break;
  }
};
