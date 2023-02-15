import React, { ChangeEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from '../stores/modeSlice';
import styled from 'styled-components';
import { RootState } from '../stores';
import SelectBox from 'objects/SelectBox';
import LoginDialog from './LoginDialog';
import main_background from 'assets/images/main_background.png';

//const {playerId, playerTexture} = useSelector((state:RootState)=> state.user); 리액트 컴포넌트 안에있어야하나봄..

const Start = () => {
  const dispatch = useDispatch();
  const [nameInput, setNameInput] = useState('');
  const { userName } = useSelector((state: RootState) => state.editor);
  const [charactorIamge, setCharatorIamge] = useState('char1');
  const CHARACTORMODELS = 28;

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;
    setNameInput(newName);
  }

  function onChangeModel(e: ChangeEvent<HTMLOptionElement>) {
    const newCharactorIamge = e.target.value;
    setCharatorIamge(newCharactorIamge);
  }

  return (
    <StartDiv>
      <LoginDialog />
    </StartDiv>
  );
};

export default Start;

const StartDiv = styled.div`
  width: 100%;
  height: 100%;
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
