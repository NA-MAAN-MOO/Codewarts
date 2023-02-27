import { useState, useRef } from 'react';
import axios from 'axios';
import { setUserName, setEditorName } from 'stores/editorSlice';
import { useDispatch } from 'react-redux';

const APPLICATION_EDITOR_URL =
  `${process.env.REACT_APP_SERVER_URL}/editor` || 'http://localhost:3001';

function UserForm() {
  /* state 디스트럭쳐링 */
  const dispatch = useDispatch();

  /* ref 생성 */
  const inputRef = useRef<HTMLInputElement>(null);
  const editorNameRef = useRef<HTMLInputElement>(null);

  /* "방 만들기" 실행 */
  const createRoom = async () => {
    if (!inputRef.current) return;
    const nameInputValue: string = inputRef.current.value;

    alert('방 만들자~');

    /* 유저네임 입력 에러처리 */
    if (!nameInputValue) {
      alert('유저네임 입력하세요');
      return;
    }

    console.log('받아라');

    try {
      /* "방 만들기" 서버에게 요청 */
      const { data } = await axios.post(`${APPLICATION_EDITOR_URL}/new_room`, {
        userName: nameInputValue,
      });

      dispatch(setEditorName(data.editorName));

      console.log(`onSuccess! 방 ID는 : ${data.editorName}`);
      alert('유저네임 생성 완료. 방 ID를 다른 사람에게 공유하세요');
    } catch (error) {
      console.error(error);
      alert('방 생성 실패');
    }
    dispatch(setUserName(nameInputValue));
  };

  /* 기존 방 참가: JOIN 누르면 실행될 함수 */
  const enterRoom = async () => {
    const nameInput = inputRef.current?.value;
    const editorNameValue = editorNameRef.current?.value;

    /* 입력 에러처리 */
    if (!nameInput || !editorNameValue) {
      alert('이름과 방 ID 입력해주세요');
      return;
    }

    dispatch(setEditorName(editorNameValue));
    dispatch(setUserName(nameInput));

    alert('방 입장 성공');
    console.log('룸ID, 유저네임 스테이트 변경 성공');
  };

  return (
    <div>
      <p>
        <span>Your Name </span>
        <input placeholder="Write your name" ref={inputRef} />
        <button onClick={createRoom}>방 만들기</button>
      </p>
      <p>
        <span>Room ID </span>
        <input placeholder="Room ID" ref={editorNameRef} />
        <button onClick={enterRoom}>Enter!</button>
      </p>
    </div>
  );
}

export default UserForm;
