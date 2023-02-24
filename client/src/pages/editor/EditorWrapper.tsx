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
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { VoiceProp } from 'types';
import { useDispatch } from 'react-redux';
import { openGame } from 'stores/modeSlice';
import { resetRoomId } from 'stores/editorSlice';
import Header from 'components/editor/Header';
import { darkTheme } from 'styles/theme';
import CloseIcon from '@mui/icons-material/Close';
import CurrentPlayer from 'components/CurrentPlayer';

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

export default function EditorWrapper(props: VoiceProp) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawer = () => {
    setOpen(!open);
  };
  const handleExit = () => {
    dispatch(openGame());
    dispatch(resetRoomId());
  };

  return (
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
                <MenuIcon />
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
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <CurrentPlayer handleDrawer={handleDrawer} />
        </Drawer>
      </Box>
      <Voice {...props} />
    </ThemeProvider>
  );
}

const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
