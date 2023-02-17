import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openStart, openEditor, openGame, openLobby } from 'stores/modeSlice';
import Voice from 'pages/Voice';
import { handleScene } from 'lib/phaserLib';
import { GAME_STATUS } from 'utils/Constants';
import Button from '@mui/material/Button';
import { styledTheme } from 'styles/theme';

const Game = () => {
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    dispatch(openEditor());
  };

  const handleMainClick = () => {
    handleScene(GAME_STATUS.START);
  };
  return (
    <BackgroundDiv>
      <Voice roomKey="MAIN" userName="김철수" />
      <BtnDiv>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          sx={{ fontFamily: styledTheme.mainFont }}
          onClick={handleEditorClick}
        >
          에디터 키기
        </Button>
        <Button
          variant="contained"
          color="secondary"
          type="button"
          sx={{ fontFamily: styledTheme.mainFont }}
          onClick={handleMainClick}
        >
          첫 화면으로 가기
        </Button>
      </BtnDiv>
    </BackgroundDiv>
  );
};

export default Game;

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  right: 20px;
  bottom: 20px;
`;
