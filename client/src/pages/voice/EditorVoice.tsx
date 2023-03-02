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

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import AudioList from 'components/AudioList';

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
  const { session, joinSession, handleDrawerClose, subscribers, publisher } =
    props;
  const theme = useTheme();

  return (
    <>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronRightIcon />
        </IconButton>
        <AudioList subscribers={subscribers} />
      </DrawerHeader>
      <Divider />
      {!!publisher ? (
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
