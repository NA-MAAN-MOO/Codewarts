import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { openMain, openEditor } from '../stores/modeSlice';

const Game = () => {
  const dispatch = useDispatch();
  return (
    <BackgroundDiv>
      <BtnDiv>
        <button type="button" onClick={() => dispatch(openEditor())}>
          에디터 키기
        </button>
        <button type="button" onClick={() => dispatch(openMain())}>
          메인으로 가기
        </button>
      </BtnDiv>
    </BackgroundDiv>
  );
};

export default Game;

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
