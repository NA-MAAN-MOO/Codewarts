import { useState, useEffect } from 'react';
import {
  OpenVidu,
  Session,
  StreamManager,
  SessionEventMap,
  Subscriber,
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

const APPLICATION_SERVER_URL = 'http://localhost:5000/';

//Voice 방 컴포넌트
const Voice = ({ roomKey, userName }: VoiceProp) => {
  const [OV, setOV] = useState<OpenVidu>();
  const [session, setSession] = useState<Session>();
  const [subscribers, setSubscribers] = useState<Array<StreamManager>>([]);

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
      await createSession(roomKey);
      setSession(session);
      setOV(OV);

      return function cleanup() {
        window.removeEventListener('beforeunload', onBeforeUnload);
      };
    })();
  }, []);

  const deleteSubscriber = (streamManager: StreamManager) => {
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

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    disconnectSession(session);

    // Empty all properties...
    setOV(undefined);
    setSession(undefined);
    setSubscribers([]);
  };

  useEffect(() => {
    registerSession(
      session,
      roomKey,
      addSubscriber,
      deleteSubscriber,
      OV,
      userName
    );
  }, [session]);

  return (
    <div className="container">
      {session === undefined ? (
        <div id="join">
          <div id="join-dialog" style={{ color: 'white' }}>
            Loading...
          </div>
        </div>
      ) : null}

      {session !== undefined ? (
        <div id="session">
          <div id="session-header">
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
          </div>

          <div id="video-container" className="col-md-6">
            {subscribers.map((sub, i) => (
              <div key={sub.id} className="stream-container col-md-6 col-xs-6">
                <span>{sub.id}</span>
                <Audio streamManager={sub} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Voice;
