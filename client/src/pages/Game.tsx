import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Voice from 'pages/Voice';
import { handleScene } from 'lib/phaserLib';
import { GAME_STATUS } from 'utils/Constants';
import { VoiceProp } from 'types';
import FloatingButton from 'components/FloatingButton';
import {
  notifySuccess,
  notifyFail,
  ToastContainer,
} from '../components/editor/toast'; /* toast for event alarm */
import { getPhaserSocket } from 'network/phaserSocket';
import Whiteboard from './Whiteboard';
import { RootState } from 'stores';
import { getbojInfos } from 'stores/rankSlice';

const showSuccessToast = (editorName: string, problemId: number) => {
  notifySuccess(editorName, problemId);
};

// const emojies = ['π€£', 'π€ͺ',"π", 'π‘', 'π€―', 'πͺ', 'π', 'π­', 'π©', 'π',"π―",];

const Game = (props: VoiceProp) => {
  const mySocket = getPhaserSocket();
  const { START, WHITEBOARD, GAME, EDITOR } = GAME_STATUS;
  const { status, editorName, volMuteInfo, micMuteInfo } = useSelector(
    (state: RootState) => {
      return { ...state.mode, ...state.editor, ...state.chat };
    }
  );

  const handleMainClick = () => {
    window.location.reload();
    // handleScene(GAME_STATUS.START);
  };

  return (
    <BackgroundDiv>
      {status === WHITEBOARD && <Whiteboard />}
      <Voice {...props} />
      <BtnDiv>
        {/* <Button
          type="button"
          variant="contained"
          color="secondary"
          sx={{ fontFamily: styledTheme.mainFont }}
          onClick={handleEditorClick}
        >
          μλν° ν€κΈ°
        </Button> */}
        {status === GAME && (
          <FloatingButton onClick={handleMainClick}>
            μ²« νλ©΄μΌλ‘ κ°κΈ°
          </FloatingButton>
        )}
      </BtnDiv>
    </BackgroundDiv>
  );
};

export { Game, showSuccessToast };

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;
const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  top: 2%;
  right: 2%;
`;
