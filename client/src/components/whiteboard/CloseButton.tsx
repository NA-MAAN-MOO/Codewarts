import { IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';

export default function CloseButton(props: any) {
  const { handleClose } = props;

  return (
    <IconButton
      aria-label="close"
      size="large"
      onClick={handleClose}
      color="secondary"
      sx={{ float: 'right', marginRight: '20px', marginTop: '10px' }}
    >
      <Close />
    </IconButton>
  );
}
