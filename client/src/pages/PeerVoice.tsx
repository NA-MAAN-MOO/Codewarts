import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'stores';
// import ChatSession from 'peerjs/ChatSession';
import { GAME_STATUS } from 'utils/Constants';

//Voice 방 컴포넌트
const PeerVoice = () => {
  const userName = useSelector((state: RootState) => state.user.playerId);
  const editorName = useSelector((state: RootState) => state.editor.editorName);
  const modeStatus = useSelector((state: RootState) => state.mode.status);

  return modeStatus === GAME_STATUS.GAME ? (
    // <ChatSession />
    <></>
  ) : (
    <div>에디터화면</div>
  );
};

export default PeerVoice;
