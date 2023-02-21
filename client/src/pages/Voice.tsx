import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'stores';
import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
  Subscriber,
  Publisher,
} from 'openvidu-browser';
import useVoice from 'hooks/useVoice';
import { VoiceProp } from 'types';
import GameVoice from 'pages/voice/GameVoice';
import { GAME_STATUS } from 'utils/Constants';
import EditorVoice from 'pages/voice/EditorVoice';
import useGetPlayer from 'hooks/useGetPlayer';

//Voice 방 컴포넌트
const Voice = ({ roomKey }: VoiceProp) => {
  const [OV, setOV] = useState<OpenVidu>();
  const [session, setSession] = useState<Session>();
  const [subscribers, setSubscribers] = useState<Array<Subscriber>>([]);
  const [publisher, setPublisher] = useState<Publisher>();
  const { createSession, disconnectSession, registerSession, initSession } =
    useVoice();

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    leaveSession();
  };
  const { playerId, status, users } = useSelector((state: RootState) => {
    return { ...state.user, ...state.mode, ...state.chat };
  });
  const { getUsers, getSessions } = useGetPlayer();

  useEffect(() => {
    (async () => {
      window.addEventListener('beforeunload', onBeforeUnload);

      if (session) return;
      await joinSession();
    })();

    return function cleanup() {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  const deleteSubscriber = (streamManager: Subscriber) => {
    let subNow = subscribers;
    let index = subNow.indexOf(streamManager, 0);
    if (index > -1) {
      subNow.splice(index, 1);
      setSubscribers(subNow);
    }
  };

  const addSubscriber = (newScriber: Subscriber) => {
    setSubscribers([...subscribers, newScriber]);
  };

  const handlePublisher = (newPub: Publisher) => {
    setPublisher(newPub);
  };

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    disconnectSession(session);

    // Empty all properties...
    setOV(undefined);
    setSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);
  };

  const joinSession = async () => {
    //새 세션을 만든다.
    const { OV, session } = initSession();

    //roomKey를 바탕으로 sessionId를 가져온다.
    //가져온 sessionId와 만든 세션을 서버에서 생성한다.
    const result = await createSession(roomKey);
    if (!result) {
      return;
    }
    setSession(session);
    setOV(OV);
  };

  useEffect(() => {
    if (!session) {
      return;
    }
    console.log('영, 유즈이펙트 호출');
    (async () => {
      await registerSession({
        session,
        sessionId: roomKey,
        addSubscriber,
        deleteSubscriber,
        handlePublisher,
        OV,
        userName: playerId,
      });
      await getUsers(roomKey);
    })();
  }, [session]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return status === GAME_STATUS.GAME ? (
    <>
      <GameVoice
        session={session}
        subscribers={subscribers}
        leaveSession={leaveSession}
        joinSession={joinSession}
        publisher={publisher}
      />
      {/* <button onClick={getConnections}>MAIN 세션 커넥션 가져오기</button>
      <button onClick={getSessions}>전체 세션 가져오기</button> */}
    </>
  ) : (
    <EditorVoice
      session={session}
      subscribers={subscribers}
      leaveSession={leaveSession}
      joinSession={joinSession}
      publisher={publisher}
    />
  );
};

export default Voice;
