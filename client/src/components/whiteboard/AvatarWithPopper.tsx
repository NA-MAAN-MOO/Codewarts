import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState, MouseEvent } from 'react';
import { NONE } from 'phaser';

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
      children: name.length !== 1 ? `${name[0]}${name[1]}` : `${name[0]}`,
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
          fontFamily: 'NeoDunggeunmoPro-Regular',
          // fontFamily: 'Cascadia Code',
          marginLeft: '-7px',

          '&': {
            background: color,
            border: 0,
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
        <Typography sx={{ fontFamily: 'NeoDunggeunmoPro-Regular' }}>
          {participant}
        </Typography>
      </Popover>
    </>
  );
}

export default React.memo(AvatarWithPopper);
