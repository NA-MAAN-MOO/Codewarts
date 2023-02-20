import React, { ComponentType } from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
type DrawerProp = {
  anchor: Anchor;
  handleDrawer: () => void;
  isOpen: boolean;
};
type ContentType = {
  content: ComponentType<DrawerProp>;
};

const Drawer = (props: DrawerProp & ContentType) => {
  const { anchor, handleDrawer, isOpen, content: Content } = props;
  return (
    <div>
      <MuiDrawer anchor={anchor} open={isOpen} onClose={handleDrawer}>
        <Content {...props} />
      </MuiDrawer>
    </div>
  );
};

export default Drawer;
