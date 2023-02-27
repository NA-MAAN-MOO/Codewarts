import React, { useEffect, useState } from 'react';
import { Session } from 'openvidu-browser';
import useVoice from 'hooks/useVoice';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import { Game } from 'pages/Game';
import Editor from 'pages/Editor';
import { GAME_STATUS } from 'utils/Constants';
import { stringToAscii } from 'lib/voiceLib';
import { Socket } from 'socket.io-client';
import { WebsocketProvider } from 'y-websocket';

const VoiceRoom = () => {
  const [session, setSession] = useState<Session>();
  const [socket, setSocket] = useState<Socket>();
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(
    undefined
  );
  const { disconnectSession } = useVoice();
  const { START, LOBBY, GAME, EDITOR } = GAME_STATUS;
  const { status, editorName } = useSelector((state: RootState) => {
    return { status: state.mode.status, editorName: state.editor.editorName };
  });
  const [roomKey, setRoomKey] = useState(editorName);
  const handleSession = (newSession: Session | undefined) => {
    setSession(newSession);
  };

  const dispatch = useDispatch();

  const handleSocket = (soc: Socket) => {
    setSocket(soc);
  };
  const handleProvider = (pro: WebsocketProvider) => {
    setProvider(pro);
  };

  useEffect(() => {
    if (!!session) {
      disconnectSession(session);
      setSession(undefined);
    }
  }, [status, editorName]);

  useEffect(() => {
    if (!editorName) return;
    setRoomKey(stringToAscii(editorName));
  }, [editorName]);

  useEffect(() => {
    if (status !== GAME) {
      return;
    }
    if (socket) {
      console.log('화이트보드 지워버려');
      socket.disconnect();
      setSocket(undefined);
    }
    if (provider) {
      console.log('웹소켓 지워버려');
      provider.disconnect();
      setProvider(undefined);
    }
  }, [status]);

  console.log('VoiceRoom 호출 시점');
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
          handleSocket={handleSocket}
          handleProvider={handleProvider}
          provider={provider}
        ></Editor>
      )}
    </>
  );
};
export default VoiceRoom;
