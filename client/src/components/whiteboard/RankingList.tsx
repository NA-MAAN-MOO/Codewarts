import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RankingTable from './RankingTable';
import { styled } from '@mui/material/styles';

export default function RankingList(props: any) {
  const { bojInfos, setbojInfos, getBojInfos } = props;
  let [showInfoFlag, setFlag] = useState(true);
  let [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // useEffect(() => {
  //   if (showInfoFlag) {
  //     getBojInfos();
  //     setFlag(false);
  //   }
  // }, []);

  const bojInfoCopy = [...bojInfos];

  const bojInfoSortedByTier = [...bojInfoCopy.sort((a, b) => b.tier - a.tier)];
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
      sx={{
        flexGrow: 1,
        bgcolor: 'tranparent',
        p: 5,
        height: 1,
        marginTop: '20px',
      }}
    >
      <Toolbar variant="dense" sx={{ marginTop: '-10px' }} />
      {/* 탭이 가운데에 있는 게 좋으면 centered 키워드 붙이기 */}
      <AntTabs value={tabValue} onChange={handleChange} centered>
        <AntTab label="티어" />
        <AntTab label="최장스트릭" />
        <AntTab label="맞힌문제" />
      </AntTabs>
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

/* Custom Style */
const AntTabs = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#760002',
  },
});

const AntTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: ['-apple-system'].join(','),
  fontSize: '1.1em',
  '&:hover': {
    color: '#ab0508',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#760002',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#f79294',
  },
}));

interface StyledTabProps {
  label: string;
}
