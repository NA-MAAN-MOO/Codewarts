import React, { ComponentType, ReactNode } from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
type DrawerProp = {
  anchor: Anchor;
  handleDrawer: () => void;
  isOpen: boolean;
  variant?: 'temporary' | 'permanent' | 'persistent' | undefined;
  children: ReactNode;
};

const Drawer = (props: DrawerProp) => {
  const { handleDrawer, isOpen, ...rest } = props;
  return <MuiDrawer open={isOpen} onClose={handleDrawer} {...rest} />;
};

export default Drawer;
