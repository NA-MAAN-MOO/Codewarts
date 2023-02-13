import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

const Lobby = () => {
  const dispatch = useDispatch();

  return <BackgroundDiv></BackgroundDiv>;
};

export default Lobby;

const BackgroundDiv = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border: 4px solid green;
`;
