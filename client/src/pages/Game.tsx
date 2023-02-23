import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Voice from 'pages/Voice';
import { handleScene } from 'lib/phaserLib';
import { GAME_STATUS } from 'utils/Constants';
import Button from '@mui/material/Button';
import { styledTheme } from 'styles/theme';
import useVoice from 'hooks/useVoice';
import { VoiceProp } from 'types';
import FloatingButton from 'components/FloatingButton';

const Game = (props: VoiceProp) => {
  const dispatch = useDispatch();

  const handleMainClick = () => {
    handleScene(GAME_STATUS.START);
  };

  return (
    <BackgroundDiv>
      <Voice {...props} />
      <BtnDiv>
        {/* <Button
          type="button"
          variant="contained"
          color="secondary"
          sx={{ fontFamily: styledTheme.mainFont }}
          onClick={handleEditorClick}
        >
          에디터 키기
        </Button> */}
        <FloatingButton onClick={handleMainClick}>
          첫 화면으로 가기
        </FloatingButton>
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
  bottom: 30px;
  right: 25px;
`;
