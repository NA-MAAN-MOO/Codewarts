import { useState, useEffect } from 'react';
import { Peer } from 'peerjs';

import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
  Subscriber,
  Publisher,
} from 'openvidu-browser';
import { Event, SessionEvent } from 'types';
import axios from 'axios';
import Audio from 'components/Audio';
import {
  createSession,
  disconnectSession,
  registerSession,
  initSession,
} from 'hooks/useVoice';
import { VoiceProp } from 'types';
import GameVoice from 'components/voice/GameVoice';

const APPLICATION_SERVER_URL = 'http://localhost:3002/';

//Voice 방 컴포넌트
const Voice = ({ roomKey, userName }: VoiceProp) => {
  const peer = new Peer(roomKey);
  const [OV, setOV] = useState<OpenVidu>();
  const [session, setSession] = useState<Session>();
  const [subscribers, setSubscribers] = useState<Array<Subscriber>>([]);
  const [publisher, setPublisher] = useState<Publisher>();
  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    leaveSession();
  };

  useEffect(() => {
    (async () => {
      window.addEventListener('beforeunload', onBeforeUnload);

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

      return function cleanup() {
        window.removeEventListener('beforeunload', onBeforeUnload);
      };
    })();
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

  useEffect(() => {
    registerSession({
      session,
      sessionId: roomKey,
      addSubscriber,
      deleteSubscriber,
      handlePublisher,
      OV,
      userName,
    });
  }, [session]);

  return roomKey === 'MAIN' ? (
    <GameVoice
      session={session}
      subscribers={subscribers}
      leaveSession={leaveSession}
      publisher={publisher}
    />
  ) : (
    <div>에디터화면</div>
  );
};

export default Voice;
