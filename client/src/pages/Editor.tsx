import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from '../stores/modeSlice';
import YjsCodeMirror from './editor/YjsCodeMirror';
import UserForm from './editor/UserForm';
import { RootState } from '../stores';
import Voice from 'pages/Voice';
import useVoice from 'hooks/useVoice';
import Button from '@mui/material/Button';

const Editor = () => {
  const { roomId, session } = useSelector((state: RootState) => {
    return { ...state.editor, ...state.chat };
  });
  const dispatch = useDispatch();
  const { disconnectSession } = useVoice();

  const handleExit = () => {
    disconnectSession(session);
    dispatch(openGame());
  };
  return (
    <>
      {roomId && (
        <EditorDiv>
          <div>
            <Voice roomKey={roomId} />
          </div>
          <YjsCodeMirror />
          <BtnDiv>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ position: 'fixed' }}
              onClick={handleExit}
            >
              돌아가기
            </Button>
          </BtnDiv>
        </EditorDiv>
      )}
    </>
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
const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  right: 40px;
  bottom: 20px;
`;
