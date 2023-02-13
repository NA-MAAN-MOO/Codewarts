import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openMain, openEditor } from '../stores/modeSlice';

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
const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: absolute;
  right: 10px;
  bottom: 10px;
`;
