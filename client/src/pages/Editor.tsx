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
import { VoiceProp } from 'types';
import { useDispatch } from 'react-redux';
import { openGame } from 'stores/modeSlice';
import { resetRoomId } from 'stores/editorSlice';
import Header from 'components/editor/Header';
import { darkTheme } from 'styles/theme';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';

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

const Editor = (props: VoiceProp) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleExit = () => {
    dispatch(openGame());
    dispatch(resetRoomId());
  };
  return (
    <EditorDiv>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{ display: 'flex' }}
          className="animate__animated animate__zoomInUp "
        >
          <AppBar position="fixed" open={open} color="transparent">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            <YjsCodeMirror />
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
  );
};

export default Editor;

const EditorDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  // background-color: #272822; // 에디터 검정
  background-color: rgba(0, 0, 0, 0.8); // 검정 투명
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
