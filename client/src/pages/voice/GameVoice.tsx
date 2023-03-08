import React, { useState, useEffect, useMemo } from 'react';
import GameVoiceBox from 'components/GameVoiceBox';
import { LoadingOutlined } from '@ant-design/icons';
import { GameVoiceType } from 'types';
import FloatingIcon from 'components/FloatingIcon';
import Drawer from 'components/Drawer';
import PeopleIcon from '@mui/icons-material/People';
import CurrentPlayer from 'components/CurrentPlayer';
import FloatingBox from 'components/FloatingBox';
import type { RootState } from 'stores';
import { useSelector, useDispatch } from 'react-redux';
import SimplePopper from 'components/SimplePopper';
import { VOICE_STATUS } from 'utils/Constants';
import Button from '@mui/material/Button';
import useVoice from 'hooks/useVoice';

const GameVoice = (props: GameVoiceType & { resetSession: () => void }) => {
  const { session, publisher, resetSession } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const { voiceStatus } = useSelector((state: RootState) => {
    return state.chat;
  });
  const { registerSession } = useVoice();

  return (
    <>
      <FloatingIcon
        icon={PeopleIcon}
        handleClick={() => handleDrawer()}
        bottom="2%"
        right="2%"
      />
      <Drawer anchor="right" isOpen={drawerOpen} handleDrawer={handleDrawer}>
        <CurrentPlayer handleDrawer={handleDrawer} {...props} />
      </Drawer>
      {voiceStatus === VOICE_STATUS.COMPLETE ? (
        <GameVoiceBox {...props} />
      ) : voiceStatus === VOICE_STATUS.LOADING ? (
        <FloatingBox>
          <LoadingOutlined />
          오디오 연결 중...
          <SimplePopper />
        </FloatingBox>
      ) : (
        <FloatingBox>
          <LoadingOutlined />
          오디오 연결 끊김
          <button
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid black',
              borderRadius: '15px',
              padding: '10px',
              fontFamily: 'Pretendard-Regular',
              fontSize: '16px',
            }}
            onClick={(e) => resetSession()}
          >
            다시 연결
          </button>
          <SimplePopper />
        </FloatingBox>
      )}
    </>
  );
};

export default GameVoice;
