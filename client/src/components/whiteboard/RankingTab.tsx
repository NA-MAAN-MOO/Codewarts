import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function RankingTab() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="티어" />
        <Tab label="최장스트릭" />
        <Tab label="맞힌문제" />
      </Tabs>
    </>
  );
}
