import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openMain, openEditor, openGame, openLobby } from 'stores/modeSlice';
import game from 'codeuk';

const Game = () => {
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    dispatch(openEditor());
  };

  const handleMainClick = () => {
    dispatch(openMain());
    game.scene.sleep('MainScene');
    if (game.scene.isSleeping('Lobby')) {
      game.scene.wake('Lobby');
    } else {
      game.scene.start('Lobby');
    }
  };
  return (
    <BackgroundDiv>
      <BtnDiv>
        <button type="button" onClick={handleEditorClick}>
          에디터 키기
        </button>
        <button type="button" onClick={handleMainClick}>
          메인으로 가기
        </button>
      </BtnDiv>
    </BackgroundDiv>
  );
};

export default Game;

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border: 4px solid green;
`;
const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  right: 10px;
  bottom: 10px;
`;
