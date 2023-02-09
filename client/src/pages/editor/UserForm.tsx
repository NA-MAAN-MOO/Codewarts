import { useState, useRef } from 'react';
import axios from 'axios';
import { setUserName, setRoomId } from 'stores/editorSlice';
import { useDispatch } from 'react-redux';

function UserForm() {
  /* state 디스트럭쳐링 */
  const dispatch = useDispatch();
  // const { setUserName, setRoomId } = useStore(({ setUserName, setRoomId }) => ({
  //   setUserName,
  //   setRoomId,
  // }));

  /* ref 생성 */
  const inputRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);

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
      const { data } = await axios.post(`http://localhost:3001/create-room`, {
        username: nameInputValue,
      });

      setRoomId(data.roomId);

      console.log(`onSuccess! 방 ID는 : ${data.roomId}`);
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
    const roomIdValue = roomIdRef.current?.value;

    /* 입력 에러처리 */
    if (!nameInput || !roomIdValue) {
      alert('이름과 방 ID 입력해주세요');
      return;
    }

    setRoomId(roomIdValue);
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
        <input placeholder="Room ID" ref={roomIdRef} />
        <button onClick={enterRoom}>Enter!</button>
      </p>
    </div>
  );
}

export default UserForm;
