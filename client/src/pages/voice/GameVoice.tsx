import React, { useState, useEffect, useMemo } from 'react';
import VoiceBox from 'components/VoiceBox';
import styled from 'styled-components';
import { Session, Publisher, Subscriber } from 'openvidu-browser';
import { LoadingOutlined } from '@ant-design/icons';
import { GameVoiceType } from 'types';
import FloatingButton from 'components/FloatingButton';
import Drawer from 'components/Drawer';
import PeopleIcon from '@mui/icons-material/People';
import CurrentPlayer from 'components/CurrentPlayer';

const GameVoice = (props: GameVoiceType) => {
  const { session, joinSession } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
      <FloatingButton
        icon={PeopleIcon}
        handleClick={() => handleDrawer()}
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
          <VoiceBox {...props} />
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

export default GameVoice;

const AudioBox = styled.div`
  position: absolute;
  bottom: 30px;
  left: 25px;
`;

const ConnectingLine = styled.div`
  color: lightgray;
  display: flex;
  gap: 10px;
`;
