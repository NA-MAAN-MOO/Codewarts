import React, { useEffect } from 'react';
import { GAME_STATUS } from 'utils/Constants';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import Game from 'pages/Game';
import Start from 'pages/Start';
import Editor from 'pages/Editor';
import Lobby from 'pages/Lobby';
import { openEditor, openGame } from 'stores/modeSlice';
import './codeuk';

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
      <HoverDiv>
        {status === START ? (
          <Start></Start>
        ) : // ) : status === LOBBY ? (
        //   <Lobby></Lobby>
        //불필요한 로비 삭제
        status === GAME ? (
          <Game></Game>
        ) : (
          <Editor></Editor>
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
  // overflow: hidden;
`;
