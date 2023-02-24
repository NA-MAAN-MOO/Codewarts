import { useState, useEffect } from 'react';
import {
  ConnectionEvent,
  OpenVidu,
  Session,
  SessionDisconnectedEvent,
} from 'openvidu-browser';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores';
import axios from 'axios';
import { setUsers } from 'stores/chatSlice';
import { Connection } from 'types';

const APPLICATION_SERVER_URL = 'http://localhost:3002';

export default () => {
  const dispatch = useDispatch();
  const { playerId: userName } = useSelector((state: RootState) => {
    return state.user;
  });

  const getConnections = async (sessionId: string) => {
    try {
      const { data }: { data: Connection[] | false } = await axios.get(
        'http://localhost:3002/get-connections',
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
    const { data } = await axios.get('http://localhost:3002/get-sessions', {});
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
          `http://localhost:3003/user/get-char/${name}`
        );
        return { name, char };
      })
    );
    const uniqueUserList = userInfos.filter(
      (char, index, self) =>
        index ===
        self.findIndex((p) => p.name === char.name && p.char === char.char)
    );
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
      const data = await axios.post(
        APPLICATION_SERVER_URL + '/create-session',
        {
          customSessionId: sessionId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return 1;
    } catch (err) {
      console.log('createSession error');
      console.log(err);
      return 0;
    }
  };

  const disconnectSession = async (session: Session | undefined) => {
    if (!session) {
      return;
    }
    try {
      console.log('세션 disconnect');
      session.disconnect();

      await axios.delete(
        `${APPLICATION_SERVER_URL}/delete-connection/${session.sessionId}`,
        {
          data: {
            userName: userName,
          },
        }
      );
      console.log('커넥션 제거 완료');
      // dispatch(removeSession());
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
    const response = await axios.post(
      APPLICATION_SERVER_URL +
        '/create-connection/' +
        sessionId +
        '/connections',
      { userName: userName },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
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
      if (!session || !sessionId) return;

      const content: Connection[] | false = await getConnections(sessionId);
      if (content === false) {
        // 세션 아직 존재하지 않음
        return;
      }
      const isConnectExist = content.some((con: Connection) => {
        if (!con.clientData) return false;
        const { user } = JSON.parse(con.clientData);
        return user === userName;
      });
      if (isConnectExist) return;

      // Get a token from the OpenVidu deployment
      const token = await createToken({ sessionId, userName });
      if (!token) {
        //이미 커넥션 생성됨
        return;
      }

      const mySession = session;

      // --- 3) Specify the actions when events take place in the session ---

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

      mySession.on('connectionCreated', async (event: ConnectionEvent) => {
        //세션에 누군가 왔을 때 호출
        const session = event.target as Session;
        const sessionId = session.sessionId;
        await getUsers(sessionId);
      });

      mySession.on(
        'sessionDisconnected',
        async (event: SessionDisconnectedEvent) => {
          //내가 세션을 나갔을 때 호출
          // const session = event.target as Session;
          // const sessionId = session.sessionId;
          // await getUsers(sessionId);
        }
      );

      mySession.on('connectionDestroyed', async (event: ConnectionEvent) => {
        //다른 유저가 세션을 나갔을 때 호출
        console.log('세션나감');
        const session = event.target as Session;
        const sessionId = session.sessionId;
        deleteSubscriber(event.target);
        await getUsers(sessionId);
      });

      // --- 4) Connect to the session with a valid user token ---

      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      await mySession.connect(token, { user: userName });
      if (!OV) return;
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

      // --- 6) Publish your stream ---

      await mySession.publish(pubNow);
      handlePublisher(pubNow);
    } catch (error) {
      console.log(error);
    }
  };

  // const sessionNow = useSelector((state: RootState) => {
  //   if (!state.chat.sessionNow) return undefined;
  //   return JSON.parse(state.chat.sessionNow);
  // });

  // const handleDisconnect = async () => {
  //   //현재 연결된 세션 있으면, 끊기
  //   try {
  //     // if (!sessionIdNow) return;

  //     // const { data: session } = await axios.get(
  //     //   'http://localhost:3002/get-session-from-id',
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
    // handleDisconnect,
  };
};
