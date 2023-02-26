import React, { useState } from 'react';
import {
  styled as muiStyled,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import YjsCodeMirror from 'pages/editor/YjsCodeMirror';
import Voice from 'pages/Voice';
import IconButton from '@mui/material/IconButton';
import { VoiceProp, YjsProp } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from 'stores/modeSlice';
import { RootState } from '../stores';
import { resetRoomId } from 'stores/editorSlice';
import Header from 'components/editor/Header';
import { darkTheme } from 'styles/theme';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import Board from './Board';
import { toggleWhiteboard } from 'stores/whiteboardSlice';
import { Socket } from 'socket.io-client';
import FloatingButton from 'components/FloatingButton';

const drawerWidth = 240;

const Main = muiStyled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = muiStyled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  display: 'flex',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = muiStyled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const Editor = (props: VoiceProp & YjsProp) => {
  const { roomId, isChecked } = useSelector((state: RootState) => {
    return { ...state.editor, ...state.chat, isChecked: state.board.isChecked };
  });
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  // const [socket, setSocket] = useState<Socket>();
  const { handleSocket, handleProvider, provider } = props;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleExit = () => {
    dispatch(openGame());
    dispatch(resetRoomId());
    if (isChecked) dispatch(toggleWhiteboard());
    // if (socket) socket.disconnect();
  };
  const handleBoard = () => {
    dispatch(toggleWhiteboard());
  };

  console.log('Edirot 컴포넌트 호출 시점');

  return (
    <>
      <BackgroundDiv />
      <EditorDiv>
        <ThemeProvider theme={darkTheme}>
          <Box
            sx={{ display: 'flex' }}
            className="animate__animated animate__zoomInUp "
          >
            <AppBar position="fixed" open={open} color="transparent">
              <Toolbar
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Header />
                <BtnDiv>
                  <CloseIcon
                    style={{ color: 'white', cursor: 'pointer' }}
                    onClick={handleExit}
                  />
                  <IconButton
                    color="secondary"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerOpen}
                    sx={{ ...(open && { display: 'none' }) }}
                  >
                    <PeopleIcon />
                  </IconButton>
                </BtnDiv>
              </Toolbar>
            </AppBar>
            <Main open={open}>
              <DrawerHeader />
              <YjsCodeMirror
                handleProvider={handleProvider}
                provider={provider}
              />
            </Main>
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  backgroundColor: darkTheme.palette.primary.main,
                },
              }}
              variant="persistent"
              anchor="right"
              open={open}
            >
              <Voice handleDrawerClose={handleDrawerClose} {...props} />
            </Drawer>
          </Box>
        </ThemeProvider>
      </EditorDiv>
      <Whiteboard isChecked={isChecked}>
        <Board roomKey={roomId} handleSocket={handleSocket} />
      </Whiteboard>
      <FixedBtnDiv>
        <FloatingButton
          variant="contained"
          // color="primary"
          size="small"
          onClick={handleBoard}
        >
          화이트보드 켜기 / 끄기
        </FloatingButton>
      </FixedBtnDiv>
    </>
  );
};

export default Editor;

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); // 검정 투명
  position: fixed;
`;

const EditorDiv = styled.div`
  width: 100%;
  height: 100%;
  // background-color: white;
  // background-color: #272822; // 에디터 검정
  // background-color: rgba(0, 0, 0, 0.8); // 검정 투명
  // background-color: rgba(256, 256, 256, 0.7); // 흰색 투명
  // background-size: cover;
  // background-attachment: fixed;
  position: absolute;
  top: 0;
  left: 0;
`;

const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const FixedBtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: fixed;
  right: 40px;
  bottom: 20px;
`;
const Whiteboard = styled.div<{ isChecked: boolean }>`
  display: ${(props) => (props.isChecked ? 'fixed' : 'none')};
  overflow: ${(props) => (props.isChecked ? 'hidden' : 'visible')};
  width: 100%;
  height: 100%;
`;
