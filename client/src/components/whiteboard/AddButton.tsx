import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AddBox } from '@mui/icons-material';
import styled from 'styled-components';
import { RootState } from 'stores';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import axios from 'axios';

export default function AddButton(props: any) {
  const currentUserId = useSelector((state: RootState) => state.user.playerId);
  const currentUserNickname = useSelector(
    (state: RootState) => state.user.playerNickname
  );

  const initialMemoModel = {
    authorId: currentUserId,
    authorNickname: currentUserNickname,
    content: '',
    x: 80,
    y: 80,
    participants: [],
  };

  //TODO: 메모 추가하면 프레임 하나 생기고, 리덕스에 저장해두었다가, onChange시 DB에 저장
  const addMemo = () => {};
  // const { addMemo } = props;

  return (
    <AddBtnWrapper>
      <IconButton
        aria-label="close"
        size="large"
        //TODO: addMemo 구현하기
        //   onClick={addMemo}
        color="secondary"
        sx={{ float: 'right', marginTop: '10px', marginRight: '20px' }}
      >
        <AddBox />
      </IconButton>
    </AddBtnWrapper>
  );
}

const AddBtnWrapper = styled.div`
  width: 100%;
  height: 10%;
  position: absolute;
  bottom: 0;
`;
