import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import CharRoundLogo from 'components/CharRoundLogo';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
type DrawerProp = {
  anchor: Anchor;
  handleDrawer: () => void;
  isOpen: boolean;
};

const CurrentPlayer = ({ anchor, handleDrawer, isOpen }: DrawerProp) => {
  const users = useSelector((state: RootState) => {
    return state.chat.users;
  });

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      // onClick={handleDrawer}
      onKeyDown={handleDrawer}
    >
      <Title>현재 접속중인 사람</Title>
      <Divider />
      <List>
        {users.map(({ name, char }, index) => {
          return (
            <ListItem
              key={name}
              disablePadding
              sx={{ display: 'flex', gap: '10px' }}
            >
              <ListItemButton onClick={(e) => e.preventDefault()}>
                <ListItemIcon>
                  <CharRoundLogo charName={char} />
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  primaryTypographyProps={{
                    fontFamily: 'Firenze',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default CurrentPlayer;

const Title = styled.div`
  padding: 15%;
  text-align: center;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.mainFont};
  word-break: keep-all;
`;
