import React, { useEffect } from 'react';
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

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

function App() {
  const mode = process.env.REACT_APP_MODE;
  const { START, LOBBY, GAME, EDITOR, WHITEBOARD } = GAME_STATUS;
  const { userLoginId, playerId, status } = useSelector((state: RootState) => {
    return { ...state.user, ...state.mode };
  });
  const dispatch = useDispatch();

  // let loadFlag = false;

  // useEffect(() => {
  //   if (mode === EDITOR) {
  //     dispatch(openEditor());
  //   } else if (mode === GAME) {
  //     dispatch(openGame());
  //   }
  //   loadFlag = true;
  // }, []);

  // const onBeforeUnload = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${APPLICATION_DB_URL}/user/logout`,
  //       userLoginId
  //     );
  //     if (response.data.status === 200) {
  //       console.log(`${userLoginId} 잘나감`);
  //     }
  //   } catch (e) {
  //     console.log(`${userLoginId} 왜안나감?`);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', onBeforeUnload);

  //   return function cleanup() {
  //     window.removeEventListener('beforeunload', onBeforeUnload);
  //   };
  // }, []);

  return (
    <HoverDiv>
      {/* <TestVoiceButtons /> */}
      {playerId === '개발자' && <TestVoiceButtons />}
      {status === START ? (
        <Start></Start>
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
