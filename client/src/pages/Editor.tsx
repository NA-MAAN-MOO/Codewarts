import { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from '../stores/modeSlice';
import YjsCodeMirror from './editor/YjsCodeMirror';
import UserForm from './editor/UserForm';
import { RootState } from '../stores';
import Voice from 'pages/Voice';
import useVoice from 'hooks/useVoice';
import Button from '@mui/material/Button';
import Board from './Board';
import { toggleWhiteboard } from 'stores/whiteboardSlice';
import { Socket } from 'socket.io-client';
import Background from 'scenes/Background';

const Editor = () => {
  const { roomId, session, isChecked } = useSelector((state: RootState) => {
    return { ...state.editor, ...state.chat, isChecked: state.board.isChecked };
  });
  const dispatch = useDispatch();
  const { disconnectSession } = useVoice();
  const [socket, setSocket] = useState<Socket>();

  const handleExit = () => {
    disconnectSession(session);
    dispatch(openGame());
    if (isChecked) dispatch(toggleWhiteboard());
    if (socket) socket.disconnect();
  };
  const handleBoard = () => {
    dispatch(toggleWhiteboard());
  };

  const handleSocket = (soc: Socket) => {
    setSocket(soc);
  };
  return (
    <>
      {roomId && (
        <>
          <BackgroundDiv />
          <EditorDiv>
            <div>
              <Voice roomKey={roomId} />
            </div>
            <YjsCodeMirror />
          </EditorDiv>
          <Whiteboard isChecked={isChecked}>
            <Board roomKey={roomId} handleSocket={handleSocket} />
          </Whiteboard>
          <BtnDiv>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleBoard}
            >
              화이트보드 켜기 / 끄기
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              // style={{ position: 'fixed' }}
              onClick={handleExit}
            >
              돌아가기
            </Button>
          </BtnDiv>
        </>
      )}
    </>
  );
};

export default Editor;

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); // 검정 투명
  position: fixed;
`;

const EditorDiv = styled.div`
  width: 100%;
  height: 100%;
  // background-color: white;
  // background-color: #272822; // 에디터 검정
  // background-color: rgba(0, 0, 0, 0.8); // 검정 투명
  // background-color: rgba(256, 256, 256, 0.7); // 흰색 투명
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
  position: fixed;
  right: 40px;
  bottom: 20px;
`;
const Whiteboard = styled.div<{ isChecked: boolean }>`
  display: ${(props) => (props.isChecked ? 'fixed' : 'none')};
  overflow: ${(props) => (props.isChecked ? 'hidden' : 'visible')};
  width: 100%;
  height: 100%;
`;
