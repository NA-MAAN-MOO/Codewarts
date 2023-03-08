import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Session,
  StreamManager,
  Publisher,
  Subscriber,
} from 'openvidu-browser';
import { LoadingOutlined } from '@ant-design/icons';
import CurrentPlayer from 'components/CurrentPlayer';
import {
  styled as muiStyled,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
import AudioList from 'components/AudioList';
import { VOICE_STATUS } from 'utils/Constants';
import type { RootState } from 'stores';
import { useSelector, useDispatch } from 'react-redux';

type GameVoiceType = {
  session: Session | undefined;
  subscribers: Subscriber[];
  publisher: Publisher | undefined;
  joinSession: () => void;
  handleDrawerClose?: () => void;
};

const DrawerHeader = muiStyled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const EditorVoice = (props: GameVoiceType) => {
  const { session, joinSession, subscribers, publisher } = props;
  const { voiceStatus } = useSelector((state: RootState) => {
    return state.chat;
  });
  const theme = useTheme();

  return (
    <>
      <AudioList subscribers={subscribers} />
      {/* <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>
      <Divider /> */}
      {voiceStatus === VOICE_STATUS.COMPLETE ? (
        <CurrentPlayer {...props} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            padding: '20px',
          }}
        >
          <LoadingOutlined />
          오디오 연결 중...
        </div>
      )}
    </>
  );
};

export default EditorVoice;

const ConnectingLine = styled.div`
  color: lightgray;
  display: flex;
  gap: 10px;
`;
