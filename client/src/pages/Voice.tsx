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
  getSessionInfo,
  createSession,
  disconnectSession,
  getToken,
  createToken,
  registerSession,
} from 'hooks/useVoice';
import { VoiceProp } from 'types';

const APPLICATION_SERVER_URL = 'http://localhost:5000/';

//Voice 방 컴포넌트
const Voice = ({ roomKey }: VoiceProp) => {
  const [OV, setOV] = useState<OpenVidu>();
  const [session, setSession] = useState<Session>();
  const [initUserData, setInitUserData] = useState({
    mySessionId: '',
    myUserName: '',
  });
  const [subscribers, setSubscribers] = useState<Array<StreamManager>>([]);

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    leaveSession();
  };

  useEffect(() => {
    (async () => {
      window.addEventListener('beforeunload', onBeforeUnload);
      const nowSession = await getSessionInfo(roomKey);
      if (!nowSession) {
        await createSession(roomKey);
      }
      setSession(nowSession);

      return function cleanup() {
        window.removeEventListener('beforeunload', onBeforeUnload);
      };
    })();
  }, []);

  const handleChangeSessionId = (e: Event) => {
    setInitUserData({
      ...initUserData,
      mySessionId: e.target.value,
    });
  };

  const handleChangeUserName = (e: Event) => {
    setInitUserData({
      ...initUserData,
      myUserName: e.target.value,
    });
  };

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
    setInitUserData({
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
    });
  };

  useEffect(() => {
    registerSession(
      session,
      addSubscriber,
      deleteSubscriber,
      OV,
      initUserData.myUserName
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
            <h1 id="session-title">{initUserData.mySessionId}</h1>
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
