import React, { useState, useEffect, useMemo } from 'react';
import VoiceBox from 'components/VoiceBox';
import { LoadingOutlined } from '@ant-design/icons';
import { GameVoiceType } from 'types';
import FloatingIcon from 'components/FloatingIcon';
import Drawer from 'components/Drawer';
import PeopleIcon from '@mui/icons-material/People';
import CurrentPlayer from 'components/CurrentPlayer';
import FloatingBox from 'components/FloatingBox';

const GameVoice = (props: GameVoiceType) => {
  const { session, joinSession } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <FloatingIcon
        icon={PeopleIcon}
        handleClick={() => handleDrawer()}
        top="1%"
        right="1%"
      />
      <Drawer anchor="right" isOpen={drawerOpen} handleDrawer={handleDrawer}>
        <CurrentPlayer handleDrawer={handleDrawer} {...props} />
      </Drawer>
      {!!session ? (
        <VoiceBox {...props} />
      ) : (
        <FloatingBox>
          <LoadingOutlined />
          오디오 연결 중...
        </FloatingBox>
      )}
    </>
  );
};

export default GameVoice;
