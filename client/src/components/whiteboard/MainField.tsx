import Drawer from '@mui/material/Drawer';
import CloseButton from './CloseButton';
import MemoDump from './MemoDump';
import AppBar from '@mui/material/AppBar';
import AddButton from './AddButton';
import Typography from '@mui/material/Typography';

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
            background: 'transparent',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <AppBar
          position="fixed"
          sx={{
            width: `60%`,
            ml: `40%`,
            backgroundColor: 'transparent',
            boxShadow: 'none',
            marginTop: '10px',
            // border: '1px solid red',
          }}
        >
          <div>
            <CloseButton handleClose={handleClose} />
          </div>

          {/* </Typography> */}
        </AppBar>
        <MemoDump />

        {/* <Divider /> */}
        {/* <Toolbar /> */}
        <AddButton />
      </Drawer>
    </>
  );
}
