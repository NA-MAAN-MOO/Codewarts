import React, { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { styledTheme } from 'styles/theme';

export default function FloatingIcon({
  icon: Icon,
  top,
  right,
  handleClick,
}: {
  icon: ComponentType;
  handleClick: () => void;
  left?: string;
  bottom?: string;
  right?: string;
  top?: string;
}) {
  return (
    <Box sx={{ position: 'absolute', right: { right }, top: { top } }}>
      <Fab
        color="secondary"
        onClick={handleClick}
        sx={{
          border: `3px ridge ${styledTheme.lightRed}`,
        }}
      >
        <Icon />
      </Fab>
    </Box>
  );
}
