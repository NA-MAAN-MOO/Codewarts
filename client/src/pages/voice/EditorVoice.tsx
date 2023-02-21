import React, { useState, useEffect } from 'react';
import Audio from 'components/Audio';
import styled from 'styled-components';
import { ReactComponent as MicOff } from 'assets/icons/mic_off.svg';
import { ReactComponent as MicOn } from 'assets/icons/mic_on.svg';
import { ReactComponent as VolOff } from 'assets/icons/volume_off.svg';
import { ReactComponent as VolOn } from 'assets/icons/volume_on.svg';
import {
  Session,
  StreamManager,
  Publisher,
  Subscriber,
} from 'openvidu-browser';
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from 'stores';
import FloatingButton from 'components/FloatingButton';
import Drawer from 'components/Drawer';
import PeopleIcon from '@mui/icons-material/People';
import CurrentPlayer from 'components/CurrentPlayer';

type GameVoiceType = {
  session: Session | undefined;
  subscribers: Subscriber[];
  publisher: Publisher | undefined;
  leaveSession: () => void;
  joinSession: () => void;
};

const EditorVoice = ({
  session,
  subscribers,
  publisher,
  leaveSession,
  joinSession,
}: GameVoiceType) => {
  const [volumeOn, setVolumeOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const { playerId } = useSelector((state: RootState) => {
    return state.user;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleVolume = () => {
    subscribers.map((sm) => {
      sm.subscribeToAudio(!volumeOn);
    });
    setVolumeOn(!volumeOn);
  };
  const handleMic = () => {
    if (!!publisher) publisher.publishAudio(!micOn);
    setMicOn(!micOn);
  };
  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <FloatingButton
        icon={PeopleIcon}
        handleClick={handleDrawer}
        top="1%"
        right="1%"
      />
      <Drawer
        anchor="right"
        isOpen={drawerOpen}
        handleDrawer={handleDrawer}
        content={CurrentPlayer}
      />
      <AudioBox>
        {!!session ? (
          <>
            {subscribers.map((sub, i) => {
              const { user } = JSON.parse(sub.stream.connection.data);
              return (
                user !== playerId && (
                  <div key={user} style={{ display: 'hidden' }}>
                    <Audio streamManager={sub} />
                  </div>
                )
              );
            })}
            <SvgWrapper>
              {volumeOn ? (
                <VolOn
                  width="32px"
                  height="32px"
                  fill="white"
                  onClick={handleVolume}
                />
              ) : (
                <VolOff
                  width="32px"
                  height="32px"
                  fill="white"
                  onClick={handleVolume}
                />
              )}
              {micOn ? (
                <MicOn
                  width="30px"
                  height="30px"
                  fill="white"
                  onClick={handleMic}
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <MicOff
                  width="30px"
                  height="30px"
                  fill="white"
                  onClick={handleMic}
                  style={{ transform: 'scaleX(-1)' }}
                />
              )}
              <div id="session-header">
                <input
                  className="btn btn-large btn-danger"
                  type="button"
                  id="buttonLeaveSession"
                  onClick={leaveSession}
                  value="Leave session"
                />
              </div>
            </SvgWrapper>
          </>
        ) : (
          <ConnectingLine>
            <LoadingOutlined />
            오디오 연결 중...
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={joinSession}
              value="Join session"
            />
          </ConnectingLine>
        )}
      </AudioBox>
    </>
  );
};

export default EditorVoice;

const AudioBox = styled.div`
  position: absolute;
  bottom: 30px;
  left: 25px;
  border: 1px solid red;
`;

const ConnectingLine = styled.div`
  color: lightgray;
  display: flex;
  gap: 10px;
`;

const SvgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  & {
    cursor: pointer;
  }
`;
