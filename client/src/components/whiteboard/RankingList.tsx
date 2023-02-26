import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import RankingTab from './RankingTab';
import RankingTable from './RankingTable';

export default function RankingList(props: any) {
  let [showInfoFlag, setFlag] = useState(true);
  const { bojInfos, getBojInfos } = props;

  useEffect(() => {
    if (showInfoFlag) {
      getBojInfos();
      setFlag(false);
    }
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'tranparent', p: 5, height: 1 }}
    >
      <Toolbar variant="dense" sx={{ marginTop: '-10px' }} />
      <RankingTab />
      <RankingTable bojInfos={bojInfos} />
      <Typography paragraph></Typography>
    </Box>
  );
}

// {info.id}
