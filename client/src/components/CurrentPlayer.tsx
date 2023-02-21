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
  console.log(users);

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawer}
      onKeyDown={handleDrawer}
    >
      <Title>현재 보고 있는 사람</Title>
      <Divider />
      <List>
        {users.map((user, index) => {
          const { user: name } = JSON.parse(user.clientData);
          return (
            <ListItem key={name} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* TODO : 캐릭터 로고 가져오는 axios 호출 해서 이미지 붙이기 */}
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
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
