import React, { useState, useEffect } from 'react';
import useVoice from 'hooks/useVoice';
import { GAME_STATUS } from 'utils/Constants';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';

const TestVoiceButtons = () => {
  const { getSessions, getConnections } = useVoice();
  const { START, LOBBY, GAME, EDITOR } = GAME_STATUS;
  const [roomKey, setRoomKey] = useState(GAME);
  const { status, roomId } = useSelector((state: RootState) => {
    return { status: state.mode.status, roomId: state.editor.roomId };
  });

  useEffect(() => {
    if (status === GAME) {
      setRoomKey(GAME);
    } else {
      setRoomKey(roomId);
    }
  }, [status, roomId]);

  return (
    <>
      <button
        onClick={async () => {
          const conn = await getConnections(roomKey);
          console.log(conn);
        }}
      >
        현재 세션 커넥션 가져오기
      </button>
      <button
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
        onClick={async () => {
          const ses = await getSessions();
          console.log(ses);
        }}
      >
        전체 세션 가져오기
      </button>
    </>
  );
};

export default TestVoiceButtons;
