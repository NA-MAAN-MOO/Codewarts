import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../stores';
import { VoiceProp } from 'types';
import EditorWrapper from 'pages/editor/EditorWrapper';
import Button from '@mui/material/Button';

const Editor = (props: VoiceProp) => {
  const { roomId } = useSelector((state: RootState) => {
    return { ...state.editor, ...state.chat };
  });
  const dispatch = useDispatch();
  // const { disconnectSession, handleDisconnect } = useVoice();

  return (
    <EditorDiv>
      {roomId ? (
        <>
          <EditorWrapper {...props} />
        </>
      ) : (
        <div>{/* <UserForm /> */}</div>
      )}
    </EditorDiv>
  );
};

export default Editor;

const EditorDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  // background-color: #272822; // 에디터 검정
  background-color: rgba(0, 0, 0, 0.8); // 검정 투명
  // background-color: rgba(256, 256, 256, 0.7); // 흰색 투명
  // background-size: cover;
  // background-attachment: fixed;
  position: absolute;
  top: 0;
  left: 0;
`;
