import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import RankingTab from './RankingTab';
import RankingTable from './RankingTable';

export default function RankingList(props: any) {
  const { bojInfos, setbojInfos, getBojInfos } = props;
  let [showInfoFlag, setFlag] = useState(true);
  let [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (showInfoFlag) {
      getBojInfos();
      setFlag(false);
    }
  }, []);

  const bojInfoCopy = [...bojInfos];

  const bojInfoSortedByTier = [...bojInfos];
  const bojInfoSortedByStreak = [
    ...bojInfoCopy.sort((a, b) => b.maxStreak - a.maxStreak),
  ];
  const bojInfoSortedBySolved = [
    ...bojInfoCopy.sort((a, b) => b.solved - a.solved),
  ];
  //   initialBojInfos = [...bojInfos];

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'tranparent', p: 5, height: 1 }}
    >
      <Toolbar variant="dense" sx={{ marginTop: '-10px' }} />
      <Tabs value={tabValue} onChange={handleChange} centered>
        <Tab label="티어" />
        <Tab label="최장스트릭" />
        <Tab label="맞힌문제" />
      </Tabs>
      {tabValue === 0 ? (
        <RankingTable bojInfos={bojInfoSortedByTier} />
      ) : tabValue === 1 ? (
        <RankingTable bojInfos={bojInfoSortedByStreak} />
      ) : (
        <RankingTable bojInfos={bojInfoSortedBySolved} />
      )}
      {/* <RankingTable bojInfos={bojInfos} /> */}

      <Typography paragraph></Typography>
    </Box>
  );
}

// {info.id}
