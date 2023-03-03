import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import styled from 'styled-components';

export default function AddButton(props: any) {
  const { addMemo } = props;

  return (
    <AddBtnWrapper>
      <Fab
        size="large"
        color="secondary"
        aria-label="add"
        onClick={addMemo}
        sx={{ marginRight: '20px' }}
      >
        <AddIcon />
      </Fab>
    </AddBtnWrapper>
  );
}

const AddBtnWrapper = styled.div`
  // width: 100%;
  height: 10%;
  position: absolute;
  float: right;
  display: flex;
  bottom: 0;
  right: 0;
  border: 1px solid red;
`;
