import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import PlayerItem from 'components/PlayerItem';
import { GameVoiceType } from 'types';

const CurrentPlayer = ({
  handleDrawer,
  ...rest
}: GameVoiceType & {
  handleDrawer?: () => void;
}) => {
  const { users, status } = useSelector((state: RootState) => {
    return { ...state.chat, ...state.mode };
  });

  return (
    <Box
      sx={{ width: '100%' }}
      role="presentation"
      // onClick={handleDrawer}
      onKeyDown={handleDrawer}
    >
      <Title>참여 중인 유저</Title>
      <Divider />
      <List>
        {users.map(({ name, char }, index) => (
          <PlayerItem name={name} char={char} key={name} {...rest} />
        ))}
      </List>
    </Box>
  );
};

export default CurrentPlayer;

const Title = styled.div`
  padding: 10%;
  text-align: center;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.mainFont};
  word-break: keep-all;
`;
