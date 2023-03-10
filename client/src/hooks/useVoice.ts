import { useState, useEffect } from 'react';
import {
  ConnectionEvent,
  OpenVidu,
  OpenViduError,
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
  toggleMyMicMute,
  toggleMyVolMute,
  setVolMute,
  setMicMute,
  setVoiceStatus,
  setMicAllowed,
  setMicDenied,
} from 'stores/chatSlice';
import { Connection } from 'types';
import _ from 'lodash';
import { MUTE_TYPE } from 'utils/Constants';
import { VOICE_STATUS } from 'utils/Constants';

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
    // 1. openvidu ?????? ??????
    const newOV = new OpenVidu();

    // socket ?????? ???????????? ?????? log??? ????????? ????????? ???????????? ?????? log??? ????????? ?????? ?????? ??????
    newOV.enableProdMode();

    // 2. initSession ??????
    const newSession = newOV.initSession();
    return { OV: newOV, session: newSession };
  };

  const createSession = async (sessionId: string) => {
    try {
      const data = await axios.post(
        APPLICATION_VOICE_URL + '/create-session',
        {
          customSessionId: sessionId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
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
      console.log('?????? disconnect');
      session.disconnect();

      console.log('????????? ?????? ??????');
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
    session,
  }: {
    sessionId: string;
    userName: string;
    session?: Session;
  }) => {
    try {
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

      return response.data; // The token
    } catch (e) {
      console.log('createToken ??????');
      dispatch(setVoiceStatus(VOICE_STATUS.FAIL));
      if (session) {
        disconnectSession(session);
      }
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
      if (!session || !sessionId || !OV) return;

      /**?????????????????? */
      // const isConnectExist = connectionList.some((con: Connection) => {
      //   if (!con.clientData) return false;
      //   const { user } = JSON.parse(con.clientData);
      //   return user === userName;
      // });
      // if (isConnectExist) return;

      const mySession = session;

      // --- Specify the actions when events take place in the session ---

      // On every new Stream received...
      mySession.on('streamCreated', (event) => {
        // Subscribe to the Stream to receive it. Second parameter is undefined
        // so OpenVidu doesn't create an HTML video by its own

        const subscriber = mySession.subscribe(event.stream, undefined);
        addSubscriber(subscriber);

        // if (volMuteInfo[userName]) {
        //   //?????? ?????? ?????? ?????? ????????????, ?????? ??????
        //   subscriber.subscribeToAudio(false);
        // }
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

      //????????? ????????? ?????? ??? ??????
      mySession.on('connectionCreated', async (event: ConnectionEvent) => {
        const session = event.target as Session;
        const sessionId = session.sessionId;
        await getUsers(sessionId);
      });

      //?????? ????????? ????????? ??? ??????
      mySession.on(
        'sessionDisconnected',
        async (event: SessionDisconnectedEvent) => {
          // const session = event.target as Session;
          // const sessionId = session.sessionId;
          // await getUsers(sessionId);
        }
      );

      //?????? ????????? ????????? ????????? ??? ??????
      mySession.on('connectionDestroyed', async (event: ConnectionEvent) => {
        const session = event.target as Session;
        const sessionId = session.sessionId;
        deleteSubscriber(event.target);
        await getUsers(sessionId);
      });

      //????????? ?????? ???????????? ????????? ???????????? ????????? ???
      mySession.on(`signal:${MUTE_TYPE.VOL}`, async (event) => {
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user) {
          //????????? ?????????
          return;
        }
        changeMute({ type: MUTE_TYPE.VOL, user, muteTo });
      });

      //????????? ????????? ???????????? ????????? ???????????? ????????? ???
      mySession.on(`signal:${MUTE_TYPE.MIC}`, async (event) => {
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user) {
          //????????? ?????????
          return;
        }
        changeMute({ type: MUTE_TYPE.MIC, user, muteTo });
      });

      //????????? ?????? ?????? ???????????? ????????? ???
      mySession.on(`signal:${MUTE_TYPE.SET_VOL}`, async (event) => {
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user || user !== userName) {
          return;
        }
        const targetSession = event.target as Session;
        const subscribers = targetSession.streamManagers.filter((sm) => {
          //Subscriber??? streaManager??? remote??? true, Publisher??? remote??? false???
          return sm.remote;
        }) as Subscriber[];

        await handleMyVolumeMute({
          session,
          muteTo,
        });
      });

      //????????? ?????? ????????? ???????????? ????????? ???
      mySession.on(`signal:${MUTE_TYPE.SET_MIC}`, async (event) => {
        //??????
        if (!event.data) return;
        const { user, muteTo } = JSON.parse(event.data);
        if (!user || !pubNow || user !== userName) {
          return;
        }
        // const targetSession = event.target as Session;
        // const publishers = targetSession.streamManagers.filter((sm) => {
        //   //Subscriber??? streaManager??? remote??? true, Publisher??? remote??? false???
        //   return !sm.remote;
        // }) as Publisher[];
        // console.log('????????????', publishers);

        await handleMyMicMute({
          publisher: pubNow,
          session,
          muteTo,
        });
      });

      //????????? ??????
      const connectionList: Connection[] | false = await getConnections(
        sessionId
      );
      if (connectionList === false) {
        // ?????? ?????? ???????????? ??????. ????????? ??????
        await createSession(sessionId);
      } else {
        //?????? ???????????? ?????? ???. userId??? ???????????? ????????? ????????? ??????
        const myConList = connectionList.filter((con: Connection) => {
          if (!con.clientData) return false;
          const { user } = JSON.parse(con.clientData);
          return user === userName;
        });

        //userId??? ???????????? ????????? ????????? ????????????
        if (myConList.length > 0) {
          await Promise.all(
            myConList.map(async (con: Connection) => {
              const connectionId = con.id;
              await axios.delete(
                `${APPLICATION_VOICE_URL}/delete-connection/${sessionId}/${connectionId}`
              );
            })
          );
        }
      }

      // Get a token from the OpenVidu deployment
      const token = await createToken({ sessionId, userName, session });
      if (!token) {
        //?????? ????????? ?????????
        return;
      }

      // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
      // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
      await mySession.connect(token, { user: userName });

      // ---Publish your stream ---
      // Init a passing undefined as targetElement (we don't want OpenVidu to insert a video
      // element: we will manage it on our own) and with the desired properties
      let pubNow = await OV.initPublisherAsync(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: false, // The source of video. If undefined default webcam
        publishAudio: micMuteInfo[userName] ? false : true, // ??????????????? info ??????
        publishVideo: false, // Whether you want to start publishing with your video enabled or not
        resolution: '640x480', // The resolution of your video
        frameRate: 30, // The frame rate of your video
        insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
        mirror: false, // Whether to mirror your local video or not
      });
      await mySession.publish(pubNow);
      handlePublisher(pubNow);
      dispatch(setMicAllowed());
      dispatch(setVoiceStatus(VOICE_STATUS.COMPLETE));
    } catch (error) {
      console.log(error);
      if (
        error instanceof OpenViduError &&
        error.name === 'DEVICE_ACCESS_DENIED'
      ) {
        //????????? ?????? ????????? ?????? ?????????. ?????? ?????? ??????
        await handleMyMicDenied({ session });
        dispatch(setVoiceStatus(VOICE_STATUS.COMPLETE));
      } else {
        if (session) {
          disconnectSession(session);
        }
        dispatch(setVoiceStatus(VOICE_STATUS.FAIL));
      }
    }
  };

  //????????? ConnectionList??? ??????
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
  //   //?????? ????????? ?????? ?????????, ??????
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

  //??? ?????? ??????
  const handleMyVolumeMute = async ({
    session,
    muteTo,
  }: {
    session?: Session;
    muteTo: boolean;
  }) => {
    if (!session) return;
    //false??? ??? ?????? ?????????
    try {
      //audio ????????? mute??? ?????????..
      // subscribers.map((sm) => {
      //   sm.subscribeToAudio(!muteTo);
      // });
      dispatch(toggleMyVolMute());
      await axios.post(
        `${APPLICATION_VOICE_URL}/toggle-mute/${MUTE_TYPE.VOL}`,
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
        type: MUTE_TYPE.VOL,
        data: sendingData,
      });
    } catch (err) {
      console.log(err);
      dispatch(setVoiceStatus(VOICE_STATUS.FAIL));
    }
  };

  //??? ????????? ??????
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
      console.log('????????? ?????? ??????');
      return;
    }
    //false??? ??? ?????? ?????????
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
      dispatch(setVoiceStatus(VOICE_STATUS.FAIL));
    }
  };

  //??? ????????? ???????????? ??????
  const handleMyMicDenied = async ({ session }: { session?: Session }) => {
    try {
      if (!session) return;

      dispatch(setMicDenied());

      await axios.post(
        `${APPLICATION_VOICE_URL}/toggle-mute/${MUTE_TYPE.MIC}`,
        {
          userName: playerId,
          muteTo: true,
        }
      );
      const sendingData = JSON.stringify({
        user: playerId,
        muteTo: true,
      });
      session?.signal({
        type: MUTE_TYPE.MIC,
        data: sendingData,
      });
    } catch (err) {
      console.log(err);
    }
  };

  //?????? ?????? ?????? ????????????
  const getMuteInfo = async () => {
    try {
      return await axios.get(`${APPLICATION_VOICE_URL}/get-mute-info`);
    } catch (err) {
      console.log(err);
    }
  };

  //?????? ????????? ?????????????????? ????????????
  const deleteMuteInfo = async (userName: string) => {
    try {
      await axios.post(`${APPLICATION_VOICE_URL}/delete-mute`, {
        userName: userName,
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
    getMuteInfo,
    deleteMuteInfo,
  };
};
