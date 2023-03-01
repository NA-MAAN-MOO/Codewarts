import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState, MouseEvent } from 'react';

function AvatarWithPopper(props: any) {
  const [color, setColor] = useState('#');

  const generateColor = () => {
    let color = '#';
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    color += randomColor;
    return color;
  };

  useEffect(() => {
    let tempColor = generateColor();
    setColor(tempColor);
  }, []);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { participant } = props;

  /* Popover functions */
  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  /* Avatar function */
  function stringAvatar(name: string) {
    return {
      children: `${name[0]}${name[1]}`,
    };
  }

  /* Generate a random color */

  //   useEffect(() => {
  //     color = generateColor();
  //   });

  return (
    <>
      <Avatar
        {...stringAvatar(participant)}
        sx={{
          fontSize: '1em',
          fontWeight: '700',
          '&': {
            background: color,
          },
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{participant}</Typography>
      </Popover>
    </>
  );
}

export default React.memo(AvatarWithPopper);
