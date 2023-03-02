import { useState, useEffect } from 'react';
import {
  ConnectionEvent,
  OpenVidu,
  Publisher,
  Session,
  SessionDisconnectedEvent,
  Subscriber,
} from 'openvidu-browser';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores';
import axios from 'axios';
import {
  setUsers,
  toggleMicMute,
  toggleMyMicMute,
  toggleMyVolMute,
  toggleVolMute,
  setVolMute,
  setMicMute,
} from 'stores/chatSlice';
import { Connection } from 'types';
import _ from 'lodash';
import { MUTE_TYPE } from 'utils/Constants';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

const APPLICATION_VOICE_URL =
  process.env.REACT_APP_VOICE_URL || 'http://localhost:3002';

export default () => {
  const dispatch = useDispatch();
  const { playerId, myVolMute, myMicMute, volMuteInfo, micMuteInfo } =
    useSelector((state: RootState) => {
      return { ...state.user, ...state.chat };
    });

  const getConnections = async (sessionId: string) => {
    try {
      const { data }: { data: Connection[] | false } = await axios.get(
        `${APPLICATION_VOICE_URL}/get-connections`,
        {
          params: { sessionId: sessionId },
        }
      );
      return data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const getSessions = async () => {
    const { data } = await axios.get(
      `${APPLICATION_VOICE_URL}/get-sessions`,
      {}
    );
    return data;
  };

  const getUsers = async (sessionId: string) => {
    if (!sessionId) return;
    const users = (await getConnections(sessionId)) || [];
    if (users.length === 0) {
      return dispatch(setUsers([]));
    }
    const filteredUser = users.filter((user) => !!user.clientData);
    const userInfos = await Promise.all(
      filteredUser.map(async (user, index) => {
        const name = JSON.parse(user.clientData).user;
        const { data: char } = await axios.get(
          `${APPLICATION_DB_URL}/user/get-char/${name}`
        );
        if (!char) {
          return null;
        }
        return { name, char };
      })
    );
    const flattedList = userInfos.filter((d) => !!d);
    const uniqueUserList = _.uniqBy(flattedList, 'name');
    // const uniqueUserList = userInfos
    //   .filter((d) => !!d)
    //   .filter(
    //     (char, index, self) =>
    //       index ===
    //       self.findIndex(
    //         (p) => p?.name === char?.name && p?.char === char?.char
    //       )
    //   );
    dispatch(setUsers(uniqueUserList));
  };

  const initSession = () => {
    // 1. openvidu 객체 생성
    const newOV = new OpenVidu();

    // socket 통신 과정에서 많은 log를 남기게 되는데 필요하지 않은 log를 띄우지 않게 하는 모드
    newOV.enableProdMode();

    // 2. initSession 생성
    const newSession = newOV.initSession();
    return { OV: newOV, session: newSession };
  };

  const createSession = async (sessionId: string) => {
    try {
      console.log('3 크리에이트세션시작');
      const data = await axios.post(
        APPLICATION_VOICE_URL + '/create-session',
        {
          customSessionId: sessionId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('4 크리에이트 끝');
      return data;
    } catch (err) {
      console.log('createSession error');
      console.log(err);
      return 0;
    }
  };

  const disconnectSession = (session: Session | undefined) => {
    if (!session) {
      return;
    }
    try {
      console.log('세션 disconnect');
      session.disconnect();

      console.log('커넥션 제거 완료');
    } catch (e) {
      console.log(e);
    }
  };

  // const getToken = async (sessionId: string) => {
  //   return await createToken(sessionId);
  // };

  const createToken = async ({
    sessionId,
    userName,
  }: {
    sessionId: string;
    userName: string;
  }) => {
    try {
      console.log('9 createToken 시작');

      const response = await axios.post(
        APPLICATION_VOICE_URL +
          '/create-connection/' +
          sessionId +
          '/connections',
        { userName: userName },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('10 createToken 끝');

      return response.data; // The token
    } catch (e) {
      console.log('createToken 에러');
      console.log(e);
    }
  };

  const registerSession = async (props: {
    session: Session | undefined;
    sessionId: string;
    addSubscriber: Function;
    deleteSubscriber: Function;
    handlePublisher: Function;
    OV: OpenVidu | undefined;
    userName: string;
  }) => {
    const {
      session,
      sessionId,
      addSubscriber,
      deleteSubscriber,
      OV,
      userName,
      handlePublisher,
    } = props;
    try {
      console.log('7 레지스터세션 시작');
      if (!session || !sessionId || !OV) return;
      console.log('세션아이디0', sessionId);
      console.log('OV', OV);
      console.log('유저이름', userName);
      const content: Connection[] | false = await getConnections(sessionId);
      if (content === false) {
        console.log('세션 존재 안 함');
        // 세션 아직 존재하지 않음
        return;
      }
      const isConnectExist = content.some((con: Connection) => {
        if (!con.clientData) return false;
        const { user } = JSON.parse(con.clientData);
        return user === userName;
      });
      console.log('커넥트 존재하는지', isConnectExist);
      if (isConnectExist) return;

      console.log('8 레지스터세션 검증 끝');

      // Get a token from the OpenVidu deployment
      const token = await createToken({ sessionId, userName });
      if (!token) {
        //이미 커넥션 생성됨
        return;
      }

      const mySession = session;
      await mySession.connect(token, { user: userName });

      // Init a passing undefined as targetElement (we don't want OpenVidu to insert a video
      // element: we will manage it on our own) and with the desired properties
      let pubNow = await OV.initPublisherAsync(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: false, // The source of video. If undefined default webcam
        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        publishVideo: false, // Whether you want to start publishing with your video enabled or not
        resolution: '640x480', // The resolution of your video
        frameRate: 30, // The frame rate of your video
        insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
        mirror: false, // Whether to mirror your local video or not
      });
      // --- Specify the actions when events take place in the session ---

      console.log('11 레지스터세션 토큰 생성 완료');

      // On every new Stream received...
      mySession.on('streamCreated', (event) => {
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own

        const subscriber = mySession.subscribe(event.stream, undefined);

        // Update the state with the new subscribers
        addSubscriber(subscriber);
      });

      // On every Stream destroyed...
      mySession.on('streamDestroyed', (event) => {
        // Remove the stream from 'subscribers' array
        deleteSubscriber(event.stream.streamManager);
      });

      // On every asynchronous exception...
      mySession.on('exception', (exception) => {
        console.warn(exception);
      });

      //세션에 누군가 왔을 때 호출
      mySession.on('connectionCreated', async (event: ConnectionEvent) => {
        const session = event.target as Session;
        const sessionId = session.sessionId;
        await getUsers(sessionId);
      });

      //내가 세션을 나갔을 때 호출
      mySession.on(
        'sessionDisconnected',
        async (event: SessionDisconnectedEvent) => {
          // const session = event.target as Session;
          // const sessionId = session.sessionId;
          // await getUsers(sessionId);
        }
      );

      //다른 유저가 세션을 나갔을 때 호출
      mySession.on('connectionDestroyed', async (event: ConnectionEvent) => {
        console.log('세션나감');
        const session = event.target as Session;
        const sessionId = session.sessionId;
        deleteSubscriber(event.target);
        await getUsers(sessionId);
      });

      //유저가 볼륨 음소거를 했다는 시그널을 받았을 때
      mySession.on(`signal:${MUTE_TYPE.VOL}`, async (event) => {
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user) {
          //유저가 없으면
          return;
        }
        changeMute({ type: MUTE_TYPE.VOL, user, muteTo });
      });

      //유저가 마이크 음소거를 했다는 시그널을 받았을 때
      mySession.on(`signal:${MUTE_TYPE.MIC}`, async (event) => {
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user) {
          //유저가 없으면
          return;
        }
        changeMute({ type: MUTE_TYPE.MIC, user, muteTo });
      });

      //방장이 내게 볼륨 음소거를 시켰을 때
      mySession.on(`signal:${MUTE_TYPE.SET_VOL}`, async (event) => {
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user || user !== userName) {
          return;
        }

        const targetSession = event.target as Session;
        const subscribers = targetSession.streamManagers.filter((sm) => {
          //Subscriber는 streaManager의 remote가 true, Publisher는 remote가 false임
          return sm.remote;
        }) as Subscriber[];

        await handleMyVolumeMute({
          subscribers,
          session,
          muteTo,
        });
      });

      //방장이 내게 마이크 음소거를 시켰을 때
      mySession.on(`signal:${MUTE_TYPE.SET_MIC}`, async (event) => {
        //로직
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user || !pubNow || user !== userName) {
          return;
        }
        // const targetSession = event.target as Session;
        // const publishers = targetSession.streamManagers.filter((sm) => {
        //   //Subscriber는 streaManager의 remote가 true, Publisher는 remote가 false임
        //   return !sm.remote;
        // }) as Publisher[];
        // console.log('제공자들', publishers);

        await handleMyMicMute({
          publisher: pubNow,
          session,
          muteTo,
        });
      });

      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      console.log('12 이벤트 연결 끝');

      // ---Publish your stream ---

      await mySession.publish(pubNow);
      handlePublisher(pubNow);
      console.log('13 레지스터 완료');
    } catch (error) {
      console.log(error);
    }
  };

  //서버의 ConnectionList를 리셋
  // const resetServerConnList = async () => {
  //   try {
  //     await axios.delete(`${APPLICATION_SERVER_URL}/reset-connection`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const sessionNow = useSelector((state: RootState) => {
  //   if (!state.chat.sessionNow) return undefined;
  //   return JSON.parse(state.chat.sessionNow);
  // });

  // const handleDisconnect = async () => {
  //   //현재 연결된 세션 있으면, 끊기
  //   try {
  //     // if (!sessionIdNow) return;

  //     // const { data: session } = await axios.get(
  //     //   `${APPLICATION_SERVER_URL}/get-session-from-id`,
  //     //   {
  //     //     params: {
  //     //       sessionId: sessionIdNow,
  //     //     },
  //     //   }
  //     // );
  //     if (!sessionNow) return;

  //     disconnectSession(sessionNow);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const changeMute = ({
    type,
    user,
    muteTo,
  }: {
    type: string;
    user: string;
    muteTo: boolean;
  }) => {
    try {
      if (type === MUTE_TYPE.VOL) {
        dispatch(setVolMute({ user, muteTo }));
      } else if (type === MUTE_TYPE.MIC) {
        dispatch(setMicMute({ user, muteTo }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  //내 볼륨 뮤트
  const handleMyVolumeMute = async ({
    subscribers,
    session,
    muteTo,
  }: {
    subscribers: Subscriber[];
    session?: Session;
    muteTo: boolean;
  }) => {
    if (!session) return;
    //false일 때 뮤트 처리됨
    subscribers.map((sm) => {
      console.log('sm', sm);
      sm.subscribeToAudio(!muteTo);
    });
    dispatch(toggleMyVolMute());
    await axios.post(`${APPLICATION_VOICE_URL}/toggle-mute/${MUTE_TYPE.VOL}`, {
      userName: playerId,
      muteTo,
    });
    const sendingData = JSON.stringify({
      user: playerId,
      muteTo,
    });
    session?.signal({
      type: MUTE_TYPE.VOL,
      data: sendingData,
    });
  };

  //내 마이크 뮤트
  const handleMyMicMute = async ({
    publisher,
    session,
    muteTo,
  }: {
    publisher?: Publisher;
    session?: Session;
    muteTo: boolean;
  }) => {
    if (!session || !publisher) {
      console.log('필요한 정보 없음');
      return;
    }
    //false일 때 뮤트 처리됨
    try {
      publisher.publishAudio(!muteTo);
      dispatch(toggleMyMicMute());
      await axios.post(
        `${APPLICATION_VOICE_URL}/toggle-mute/${MUTE_TYPE.MIC}`,
        {
          userName: playerId,
          muteTo,
        }
      );
      const sendingData = JSON.stringify({
        user: playerId,
        muteTo,
      });
      session?.signal({
        type: MUTE_TYPE.MIC,
        data: sendingData,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    initSession,
    createSession,
    disconnectSession,
    // getToken,
    createToken,
    registerSession,
    getConnections,
    getSessions,
    getUsers,
    // resetServerConnList,
    // handleDisconnect,
    handleMyVolumeMute,
    handleMyMicMute,
  };
};
