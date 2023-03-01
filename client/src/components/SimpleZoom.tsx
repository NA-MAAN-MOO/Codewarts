import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Zoom from '@mui/material/Zoom';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Theme } from '@mui/material/styles';
import { truncate } from 'fs';
import { Button } from '@mui/material';

export default function SimpleZoom({ clickEmoji, emojies }) {
  const checked = true;
  const handleChange = () => {};

  return (
    <Box sx={{ display: 'flex' }}>
      {emojies.map((item, index) => {
        return (
          <Zoom
            in={checked}
            style={{
              transitionDelay: checked ? `${100 * (index + 1)}ms` : '0ms',
            }}
          >
            <Button
              onClick={() => clickEmoji(item)}
              variant="contained"
              color="error"
              sx={{
                fontSize: '28px',
                backgroundColor: 'white',
                minWidth: '40px',
                borderRadius: '30%',
              }}
            >
              {item}
            </Button>
          </Zoom>
        );
      })}
    </Box>
  );
}
