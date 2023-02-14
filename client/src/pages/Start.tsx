import React, { ChangeEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openGame } from '../stores/modeSlice';
import styled from 'styled-components';
import { RootState } from '../stores';
import { setCharactorModel, setNickName } from 'stores/characterSlice';
import SelectBox from 'objects/SelectBox';
// import '../../public/assets/characters'

//const {nickName, characterModel} = useSelector((state:RootState)=> state.charactor); 필요한곳에 쓰면됨

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
      <LogoDiv>코득코득</LogoDiv>
      <input
        id="nickNameInput"
        type="text"
        value={nameInput}
        placeholder="Write your name"
        onChange={onNameChange}
      />
      <SelectBox max={CHARACTORMODELS} onChange={onChangeModel} />

      <LoginBtn
        type="button"
        onClick={() => {
          dispatch(setNickName(nameInput));
          dispatch(setCharactorModel(charactorIamge));
          dispatch(openGame());
        }}
      >
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
