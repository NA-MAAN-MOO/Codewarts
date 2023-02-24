import { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from '../stores/modeSlice';
import YjsCodeMirror from './editor/YjsCodeMirror';
import UserForm from './editor/UserForm';
import { RootState } from '../stores';
import Voice from 'pages/Voice';
import useVoice from 'hooks/useVoice';
import Board from './Board';
import { toggleWhiteboard } from 'stores/whiteboardSlice';
import { Socket } from 'socket.io-client';

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
    if (!socket) return;
    socket.disconnect();
  };
  const handleBoard = () => {
    dispatch(toggleWhiteboard());
  };

  const handleSocket = (soc: Socket) => {
    setSocket(soc);
  };
  return (
    <EditorDiv>
      {roomId ? (
        <div>
          <Voice roomKey={roomId} />
          <YjsCodeMirror />
          <Whiteboard isChecked={isChecked}>
            <Board roomKey={roomId} handleSocket={handleSocket} />
          </Whiteboard>
        </div>
      ) : (
        <div>
          <UserForm />
        </div>
      )}
      <BtnDiv>
        <button type="button" onClick={handleBoard}>
          화이트보드 켜기 / 끄기
        </button>
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
const Whiteboard = styled.div<{ isChecked: boolean }>`
  display: ${(props) => (props.isChecked ? 'fixed' : 'none')};
  width: 100%;
  height: 100%;
`;
