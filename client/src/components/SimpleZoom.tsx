import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Zoom from '@mui/material/Zoom';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Theme } from '@mui/material/styles';
import { truncate } from 'fs';
import { Button } from '@mui/material';

export default function SimpleZoom({clickEmoji, emojies }) {
  const checked = true;
  const handleChange = () => {};

  return (
    <Box sx={{ height: 36.7 }}>
      <Box sx={{ display: 'flex' }}>
        <Zoom in={checked}>
          <Button onClick={clickEmoji(emojies[0])} variant="outlined" color="secondary">
            {emojies[0]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '100ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[1])} variant="outlined" color="secondary">
            {emojies[1]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '200ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[2])} variant="outlined" color="secondary">
            {emojies[2]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '300ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[3])} variant="outlined" color="secondary">
            {emojies[3]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '400ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[4])} variant="outlined" color="secondary">
            {emojies[4]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '500ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[5])} variant="outlined" color="secondary">
            {emojies[5]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '600ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[6])} variant="outlined" color="secondary">
            {emojies[6]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '700ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[7])} variant="outlined" color="secondary">
            {emojies[7]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '800ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[8])} variant="outlined" color="secondary">
            {emojies[8]}
          </Button>
        </Zoom>
        <Zoom
          in={checked}
          style={{ transitionDelay: checked ? '900ms' : '0ms' }}
        >
          <Button onClick={clickEmoji(emojies[9])} variant="outlined" color="secondary">
            {emojies[9]}
          </Button>
        </Zoom>
      </Box>
    </Box>
  );
}
