import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import GamePlayerItem from './GamePlayerItem';

const CurrentPlayer = ({ handleDrawer }: { handleDrawer?: () => void }) => {
  const { users, status } = useSelector((state: RootState) => {
    return { ...state.chat, ...state.mode };
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
        {users.map(({ name, char }, index) => (
          <GamePlayerItem name={name} char={char} key={name} />
        ))}
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
