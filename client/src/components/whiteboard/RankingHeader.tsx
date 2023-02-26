import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { CssBaseline } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

/* Right side header */
export default function RankingHeader() {
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `40%`, mr: `60%` }}>
        {/* TODO: 가운데 정렬 */}
        <Toolbar>
          <Typography variant="h5" noWrap component="div" align="center">
            코드와트 랭킹 🔥
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
