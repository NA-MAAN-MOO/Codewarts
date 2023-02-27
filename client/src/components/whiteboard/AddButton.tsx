import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AddBox } from '@mui/icons-material';
import styled from 'styled-components';

export default function AddButton(props: any) {
  const { addMemo } = props;

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
