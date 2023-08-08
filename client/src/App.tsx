import React, { useEffect, useState } from 'react';
import VoiceRoom from 'pages/VoiceRoom';
import { GAME_STATUS } from 'utils/Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import Start from 'pages/Start';
// import './codeuk';
import TestVoiceButtons from 'components/TestVoiceButtons';
import Whiteboard from 'pages/Whiteboard';
import axios from 'axios';
import BgmPlayer from 'components/musicplayer/BgmPlayer';

function App() {
  const mode = process.env.REACT_APP_MODE;
  const { START, LOBBY, GAME, EDITOR, WHITEBOARD, LOGIN } = GAME_STATUS;
  const { userLoginId, playerId, status } = useSelector((state: RootState) => {
    return { ...state.user, ...state.mode };
  });
  const dispatch = useDispatch();

  const [logined, setLogined] = useState(false);
  useEffect(() => {
    if (status !== START && status !== LOGIN) {
      if (logined) return;
      setLogined(true);
    }
  }, [status]);

  return (
    <HoverDiv>
      <BgmPlayer />
      {/* <TestVoiceButtons /> */}
      {playerId === '개발자' && <TestVoiceButtons />}
      {status === START || status === LOGIN ? (
        !logined && <Start />
      ) : //불필요한 로비 삭제
      status === GAME || status === EDITOR || status === WHITEBOARD ? (
        <VoiceRoom />
      ) : (
        <></>
      )}
    </HoverDiv>
  );
}

export default App;

const HoverDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  // overflow: hidden;
`;
