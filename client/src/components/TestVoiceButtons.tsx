import React, { useState, useEffect } from 'react';
import useVoice from 'hooks/useVoice';
import { GAME_STATUS } from 'utils/Constants';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import axios from 'axios';
import { stringToAscii } from 'lib/voiceLib';

const APPLICATION_VOICE_URL =
  `${process.env.REACT_APP_SERVER_URL}/voice` || 'http://localhost:3002';

const TestVoiceButtons = () => {
  const { getSessions, getConnections } = useVoice();
  const { START, LOBBY, GAME, EDITOR } = GAME_STATUS;
  const [roomKey, setRoomKey] = useState(GAME);
  const { status, editorName } = useSelector((state: RootState) => {
    return { status: state.mode.status, editorName: state.editor.editorName };
  });
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (status === GAME) {
      setRoomKey(GAME);
    } else {
      setRoomKey(editorName);
    }
  }, [status, editorName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSessionId(e.target.value);
  };

  const handleCloseSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.delete(
        `${APPLICATION_VOICE_URL}/delete-session/${sessionId}`
      );
      if (result.status === 200) {
        console.log('세션 종료 완료');
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div style={{ position: 'absolute', top: '0', left: '0', zIndex: '99999' }}>
      <button
        type="button"
        onClick={async () => {
          const conn = await getConnections(
            roomKey === GAME_STATUS.GAME ? roomKey : stringToAscii(roomKey)
          );
          console.log(conn);
        }}
      >
        현재 세션 커넥션 가져오기
      </button>
      <button
        type="button"
        onClick={async () => {
          const conn = await getConnections(GAME_STATUS.GAME);
          if (conn === false) {
            console.log('세션 없음');
          } else {
            console.log(conn);
          }
        }}
      >
        메인 세션 커넥션 가져오기
      </button>
      <button
        type="button"
        onClick={async () => {
          const ses = await getSessions();
          console.log(ses);
        }}
      >
        전체 세션 가져오기
      </button>
      <form onSubmit={handleCloseSession}>
        <label>닫을 세션아이디</label>
        <input
          type="text"
          name="sessionId"
          value={sessionId}
          onChange={handleChange}
        />
        <button type="submit">세션 닫기</button>
      </form>
    </div>
  );
};

export default TestVoiceButtons;
