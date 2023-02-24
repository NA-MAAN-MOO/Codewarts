import React, { useEffect, useState } from 'react';
import { Session } from 'openvidu-browser';
import useVoice from 'hooks/useVoice';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import Game from 'pages/Game';
import Editor from 'pages/Editor';
import { GAME_STATUS } from 'utils/Constants';
import { stringToAscii } from 'lib/voiceLib';

const VoiceRoom = () => {
  const [session, setSession] = useState<Session>();
  const { disconnectSession } = useVoice();
  const { START, LOBBY, GAME, EDITOR } = GAME_STATUS;
  const { status, roomId } = useSelector((state: RootState) => {
    return { status: state.mode.status, roomId: state.editor.roomId };
  });
  const [roomKey, setRoomKey] = useState(roomId);
  const handleSession = (newSession: Session | undefined) => {
    setSession(newSession);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!session) {
      disconnectSession(session);
      setSession(undefined);
    }
  }, [status, roomId]);

  useEffect(() => {
    setRoomKey(stringToAscii(roomId));
  }, [roomId]);

  return (
    <>
      {status === GAME ? (
        <Game
          session={session}
          handleSession={handleSession}
          roomKey={GAME}
        ></Game>
      ) : (
        <Editor
          session={session}
          handleSession={handleSession}
          roomKey={roomKey}
        ></Editor>
      )}
    </>
  );
};
export default VoiceRoom;
