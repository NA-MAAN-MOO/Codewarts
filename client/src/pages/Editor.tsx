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
import { resetEditorName } from 'stores/editorSlice';
import Header from 'components/editor/Header';
import { darkTheme } from 'styles/theme';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import Board from './Board';
import { toggleWhiteboard } from 'stores/whiteboardSlice';
import QuizIcon from '@mui/icons-material/Quiz';
import ToggleButton from '@mui/material/ToggleButton';

const rightDrawerWidth = 350;

const Main = muiStyled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  // border: '2px solid orange', // for debugging
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -rightDrawerWidth,
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
    width: `calc(100% - ${rightDrawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: rightDrawerWidth,
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
  const [onWhiteBoard, setOnWhiteBoard] = useState('화이트보드 켜기');

  const { editorName, isChecked } = useSelector((state: RootState) => {
    return { ...state.editor, ...state.chat, isChecked: state.board.isChecked };
  });
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  // YjsCodeMirror에 넘겨줘야할 인자
  const [leftOpen, setLeftOpen] = useState(false);
  const dispatch = useDispatch();
  // const [socket, setSocket] = useState<Socket>();
  const { handleSocket, handleProvider, provider } = props;

  const handleRightDrawerOpen = () => {
    setLeftOpen(true);
  };
  const handleLeftDrawerClose = () => {
    setLeftOpen(false);
  };

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleExit = () => {
    dispatch(openGame());
    dispatch(resetEditorName());
    if (isChecked) dispatch(toggleWhiteboard());
    // if (socket) socket.disconnect();
  };
  const handleBoard = () => {
    if (onWhiteBoard === '화이트보드 켜기') {
      setOnWhiteBoard('화이트보드 끄기');
    } else {
      setOnWhiteBoard('화이트보드 켜기');
    }
    dispatch(toggleWhiteboard());
  };

  return (
    <>
      <BackgroundDiv />
      <EditorDiv>
        <ThemeProvider theme={darkTheme}>
          <Box
            sx={{
              display: 'flex',
              // border: '3px solid green', // for debugging
              width: '100%',
              height: '100%',
            }}
            className="animate__animated animate__zoomInUp "
          >
            <AppBar
              position="fixed"
              open={open}
              color="transparent"
              // sx={{
              //   border: '1px solid lightgreen'
              //  }}
            >
              <Toolbar
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleRightDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(leftOpen && { display: 'none' }) }}
                >
                  <QuizIcon />
                </IconButton>
                <Header />
                <BtnDiv>
                  <CloseIcon
                    style={{ color: 'white', cursor: 'pointer' }}
                    onClick={handleExit}
                  />
                </BtnDiv>
              </Toolbar>
            </AppBar>
            <Main open={open}>
              <DrawerHeader />
              <YjsCodeMirror
                leftOpen={leftOpen}
                setLeftOpen={setLeftOpen}
                handleRightDrawerOpen={handleRightDrawerOpen}
                handleLeftDrawerClose={handleLeftDrawerClose}
                handleProvider={handleProvider}
                provider={provider}
              />
            </Main>
            <Drawer
              sx={{
                width: rightDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: rightDrawerWidth,
                  backgroundColor: darkTheme.palette.primary.main,
                  overflowX: 'hidden',
                },
              }}
              variant="persistent"
              anchor="right"
              open={open}
            >
              <Voice {...props} />
            </Drawer>
          </Box>
        </ThemeProvider>
      </EditorDiv>
      {/* <Whiteboard isChecked={isChecked}> */}
      <Board
        roomKey={editorName}
        handleSocket={handleSocket}
        handleBoard={handleBoard}
      />
      {/* </Whiteboard> */}
      <FixedBtnDiv>
        <ThemeProvider theme={darkTheme}>
          <ToggleButton
            value="open"
            selected={open}
            color="secondary"
            onClick={handleDrawer}
            sx={{
              borderRadius: '50%',
            }}
          >
            <PeopleIcon />
          </ToggleButton>
        </ThemeProvider>
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
  position: fixed; // 이거 fixed로 고치면 스크롤 없어짐
  top: 0;
  left: 0;
  // border: 1px solid yellow;
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
  right: 2%;
  bottom: 2%;
`;
