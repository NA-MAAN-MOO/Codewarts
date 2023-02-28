import * as React from 'react';
import Box from '@mui/material/Box';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import FloatingBox from './FloatingBox';
import { Button, Fade, Grid, Paper } from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SimpleZoom from './SimpleZoom';
import { getPhaserSocket } from 'network/phaserSocket';
import phaserGame from 'codeuk';

const emojies = ['🤣', '🎉', '😡', '🤯', '🖐', '😭', '💩', '💯', '👍', '👎'];

export default function SimplePopper() {
  const mySocket = getPhaserSocket(); //!!
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [open, setOpen] = React.useState(false);
  let selectedEmoji = '';

  function resetSelectedEmoji() {
    selectedEmoji = '';
  }

  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  const clickEmoji = (emoji: string) => {
    selectedEmoji = emoji;
    mySocket?.emit('sendEmoji', {
      socketId: phaserGame.socketId,
      emoji: selectedEmoji,
    });
    resetSelectedEmoji();
  };

  return (
    <Box sx={{ width: 60 }}>
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <SimpleZoom clickEmoji={clickEmoji} emojies={emojies} />
            </Paper>
          </Fade>
        )}
      </Popper>
      <Grid container justifyContent="center">
        <Grid item container xs={6} alignItems="flex-end" direction="column">
          <Grid item>
            <Button onClick={handleClick('right')}>
              <InsertEmoticonIcon fontSize="large" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  //   return (
  //     <button
  //       onMouseEnter={handleClick}
  //       //   onMouseLeave={handleClick}
  //     >
  //       Toggle Popper
  //       <Popper
  //         sx={{
  //           position: 'absolute',
  //           left: '10px',
  //           border: '5px solid black',
  //           transform: 'translate(20px, 1120px)',
  //         }}
  //         id={id}
  //         open={open}
  //         anchorEl={anchorEl}
  //       >
  //         {emojies.map((item) => (
  //           <span style={{ border: '1px solid red', fontSize: '40px' }}>
  //             {item}
  //           </span>
  //         ))}
  //       </Popper>
  //     </button>
  //   );
}
