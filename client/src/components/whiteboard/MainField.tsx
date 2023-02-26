import Drawer from '@mui/material/Drawer';

const drawerWidth = 60;

/* Left side main field of whiteboard */
export default function MainField() {
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
        {/* <Toolbar /> */}
        {/* <Divider /> */}
      </Drawer>
    </>
  );
}
