import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openLobby } from '../stores/modeSlice';
import styled from 'styled-components';

const Start = () => {
  const dispatch = useDispatch();
  return (
    <StartDiv>
      <LogoDiv>코득코득</LogoDiv>
      <LoginBtn type="button" onClick={() => dispatch(openLobby())}>
        로그인
      </LoginBtn>
    </StartDiv>
  );
};

export default Start;

const StartDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 50px;
`;

const LogoDiv = styled.div`
  font-size: 80px;
`;

const LoginBtn = styled.button`
  font-size: 40px;
  padding: 20px;
  background-color: tomato;
  border: none;
  border-radius: 20px;
`;
