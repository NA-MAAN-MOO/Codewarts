import { IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import styled from 'styled-components';

export default function CloseButton(props: any) {
  const { handleClose } = props;

  return (
    <CloseBtnWrap>
      <IconButton
        aria-label="close"
        size="large"
        onClick={handleClose}
        color="secondary"
      >
        <Close />
      </IconButton>
    </CloseBtnWrap>
  );
}

const CloseBtnWrap = styled.div`
  width : 100px,
  height: 100px,
  display :flex,
  position: absolute
`;
