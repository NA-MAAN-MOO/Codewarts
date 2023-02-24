import React, { useEffect } from 'react';
import VoiceRoom from 'pages/VoiceRoom';
import { GAME_STATUS } from 'utils/Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import Start from 'pages/Start';
// import './codeuk';
import TestVoiceButtons from 'components/TestVoiceButtons';

function App() {
  const mode = process.env.REACT_APP_MODE;
  const { START, LOBBY, GAME, EDITOR } = GAME_STATUS;
  const { playerId, status } = useSelector((state: RootState) => {
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

  return (
    <HoverDiv>
      {/* <TestVoiceButtons /> */}
      {status === START ? (
        <Start></Start>
      ) : //불필요한 로비 삭제
      status === GAME || status === EDITOR ? (
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
