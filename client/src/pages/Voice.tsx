import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from 'stores';
import { OpenVidu, Subscriber, Publisher } from 'openvidu-browser';
import useVoice from 'hooks/useVoice';
import { VoiceProp } from 'types';
import GameVoice from 'pages/voice/GameVoice';
import { GAME_STATUS } from 'utils/Constants';
import EditorVoice from 'pages/voice/EditorVoice';
import { fetchMuteInfo, setVoiceStatus } from 'stores/chatSlice';
import { initialMyMute } from 'stores/chatSlice';

//Voice 방 컴포넌트
const Voice = ({ roomKey, session, handleSession, ...rest }: VoiceProp) => {
  const [OV, setOV] = useState<OpenVidu>();
  const [subscribers, setSubscribers] = useState<Array<Subscriber>>([]);
  const [publisher, setPublisher] = useState<Publisher>();
  const {
    createSession,
    disconnectSession,
    registerSession,
    initSession,
    getUsers,
  } = useVoice();
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    leaveSession();
  };
  const { playerId, status, volMuteInfo, micMuteInfo } = useSelector(
    (state: RootState) => {
      return { ...state.user, ...state.mode, ...state.chat };
    }
  );

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);

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
    setSubscribers((subs) => [...subs, newScriber]);
  };

  const handlePublisher = (newPub: Publisher) => {
    setPublisher(newPub);
  };

  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    disconnectSession(session);

    // Empty all properties...
    setOV(undefined);
    handleSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);
  };

  const joinSession = async () => {
    //새 세션을 만든다.
    const { OV, session } = initSession();

    //roomKey를 바탕으로 sessionId를 가져온다.
    //가져온 sessionId와 만든 세션을 서버에서 생성한다.

    //createSession 로직을 registerSession 쪽으로 뺐음.
    // const result = await createSession(roomKey);
    // if (!result) {
    //   return;
    // }
    handleSession(session);
    setOV(OV);
  };

  useEffect(() => {
    (async () => {
      if (
        Object.keys(volMuteInfo).length === 0 &&
        Object.keys(micMuteInfo).length === 0
      ) {
        // 뮤트인포 정보 업데이트
        await appDispatch(fetchMuteInfo());
        dispatch(initialMyMute(playerId));
      }
      if (!session) {
        await joinSession();
        return;
      }
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
  }, [session, OV]);

  const resetSession = async () => {
    await registerSession({
      session,
      sessionId: roomKey,
      addSubscriber,
      deleteSubscriber,
      handlePublisher,
      OV,
      userName: playerId,
    });
  };

  return (
    <>
      {status === (GAME_STATUS.GAME || GAME_STATUS.WHITEBOARD) ? (
        <GameVoice
          session={session}
          subscribers={subscribers}
          joinSession={joinSession}
          publisher={publisher}
          resetSession={resetSession}
        />
      ) : (
        <EditorVoice
          session={session}
          subscribers={subscribers}
          joinSession={joinSession}
          publisher={publisher}
          {...rest}
        />
      )}
    </>
  );
};

export default Voice;
