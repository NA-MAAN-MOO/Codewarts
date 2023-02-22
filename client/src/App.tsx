import React, { useEffect } from 'react';
import { GAME_STATUS } from 'utils/Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import Start from 'pages/Start';
import Lobby from 'pages/Lobby';
import { openEditor, openGame } from 'stores/modeSlice';
import './codeuk';
import VoiceRoom from 'pages/VoiceRoom';

function App() {
  const mode = process.env.REACT_APP_MODE;
  const { START, LOBBY, GAME, EDITOR } = GAME_STATUS;
  const { status } = useSelector((state: RootState) => {
    return state.mode;
  });
  const dispatch = useDispatch();
  let loadFlag = false;

  useEffect(() => {
    if (mode === EDITOR) {
      dispatch(openEditor());
    } else if (mode === GAME) {
      dispatch(openGame());
    }
    loadFlag = true;
  }, []);

  return (
    loadFlag || (
      <HoverDiv id="codeuk">
        {status === START ? (
          <Start></Start>
        ) : status === LOBBY ? (
          <Lobby></Lobby>
        ) : (
          <VoiceRoom />
        )}
      </HoverDiv>
    )
  );
}

export default App;

const HoverDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;
