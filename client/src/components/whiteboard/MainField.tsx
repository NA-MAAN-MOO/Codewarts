import Drawer from '@mui/material/Drawer';
import { Divider } from '@mui/material';
import CloseButton from './CloseButton';

const drawerWidth = 60;

/* Left side main field of whiteboard */
export default function MainField(props: any) {
  const { handleClose } = props;
  return (
    <>
      <Drawer
        sx={{
          width: `${drawerWidth}%`,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: `${drawerWidth}%`,
            boxSizing: 'border-box',
            // bgcolor: 'transparent',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <CloseButton handleClose={handleClose} />
        {/* <Divider /> */}
        {/* <Toolbar /> */}
      </Drawer>
    </>
  );
}
