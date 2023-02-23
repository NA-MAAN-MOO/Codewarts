import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from '../stores/modeSlice';
import { resetRoomId } from 'stores/editorSlice';
import YjsCodeMirror from './editor/YjsCodeMirror';
import UserForm from './editor/UserForm';
import { RootState } from '../stores';
import Voice from 'pages/Voice';
import { VoiceProp } from 'types';

const Editor = (props: VoiceProp) => {
  const { roomId } = useSelector((state: RootState) => {
    return { ...state.editor, ...state.chat };
  });
  const dispatch = useDispatch();
  // const { disconnectSession, handleDisconnect } = useVoice();

  const handleExit = () => {
    dispatch(openGame());
    dispatch(resetRoomId());
  };

  // useEffect(() => {
  //   (async () => {
  //     await handleDisconnect();
  //   })();
  // }, []);

  return (
    <EditorDiv>
      {roomId ? (
        <div>
          <Voice {...props} />
          <YjsCodeMirror />
        </div>
      ) : (
        <div>
          <UserForm />
        </div>
      )}
      <BtnDiv>
        <button type="button" onClick={handleExit}>
          돌아가기
        </button>
      </BtnDiv>
    </EditorDiv>
  );
};

export default Editor;

const EditorDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  // background-color: #272822; // 에디터 검정
  // background-color: rgba(0, 0, 0, 0.5); // 검정 투명
  background-color: rgba(256, 256, 256, 0.7); // 흰색 투명
  // background-size: cover;
  // background-attachment: fixed;
  position: absolute;
  top: 0;
  left: 0;
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
