import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import FloatingBox from './FloatingBox';

const emojies = ['🤣', '🎉', '😡', '🤯', '🖐', '😭', '💩', '💯', '👍', '👎'];

export default function SimplePopper() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div
      aria-describedby={id}
      onMouseLeave={handleClick}
      onMouseEnter={handleClick}
    >
      Toggle Popper
      <Popper id={id} open={open} anchorEl={anchorEl}>
        {emojies.map((item) => (
          <span style={{ border: '1px solid red', fontSize: '40px' }}>
            {item}
          </span>
        ))}
      </Popper>
    </div>
  );
}
