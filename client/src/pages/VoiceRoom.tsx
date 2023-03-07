import React, { useEffect, useState } from 'react';
import { Session } from 'openvidu-browser';
import useVoice from 'hooks/useVoice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from 'stores';
import { Game } from 'pages/Game';
import Editor from 'pages/Editor';
import { GAME_STATUS, VOICE_STATUS } from 'utils/Constants';
import { stringToUnicode } from 'lib/voiceLib';
import { Socket } from 'socket.io-client';
import { WebsocketProvider } from 'y-websocket';
import { fetchMuteInfo, setVoiceStatus } from 'stores/chatSlice';
import {
  notifySuccess,
  notifyFail,
  ToastContainer,
} from '../components/editor/toast'; /* toast for event alarm */
import { turnWhiteboardOff } from 'stores/whiteboardSlice';

const VoiceRoom = () => {
  const [session, setSession] = useState<Session>();
  const [socket, setSocket] = useState<Socket>();
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(
    undefined
  );
  const { disconnectSession, deleteMuteInfo } = useVoice();
  const { START, WHITEBOARD, GAME, EDITOR } = GAME_STATUS;
  const { status, editorName, volMuteInfo, micMuteInfo } = useSelector(
    (state: RootState) => {
      return { ...state.mode, ...state.editor, ...state.chat };
    }
  );
  const [roomKey, setRoomKey] = useState(editorName);
  const handleSession = (newSession: Session | undefined) => {
    setSession(newSession);
  };
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const handleSocket = (soc: Socket) => {
    setSocket(soc);
  };
  const handleProvider = (pro: WebsocketProvider) => {
    setProvider(pro);
  };

  useEffect(() => {
    if (!!session) {
      if (status === WHITEBOARD || status === session.sessionId) {
        return;
      }
      disconnectSession(session);
      setSession(undefined);
      dispatch(setVoiceStatus(VOICE_STATUS.LOADING));
    }
    dispatch(turnWhiteboardOff());
  }, [status, editorName]);

  useEffect(() => {
    if (!editorName) return;
    setRoomKey(stringToUnicode(editorName));
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

  return (
    <>
      {status === GAME || status === WHITEBOARD ? (
        <>
          <ToastContainer />
          <Game
            session={session}
            handleSession={handleSession}
            roomKey={GAME}
          ></Game>
        </>
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
