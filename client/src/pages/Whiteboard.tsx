import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { openGame } from 'stores/modeSlice';
import store from 'stores';
import Box from '@mui/material/Box';
import RankingHeader from 'components/whiteboard/RankingHeader';
import MainField from 'components/whiteboard/MainField';
import RankingList from 'components/whiteboard/RankingList';
import CloseButton from 'components/whiteboard/CloseButton';

interface DetailInfo {
  bojId: string;
  id: string;
  maxStreak: number;
  nickname: string;
  tier: number;
  solved: number;
}

function Whiteboard() {
  const initialState: [] = [];

  let [bojInfos, setbojInfos] = useState<DetailInfo[]>(initialState);

  //TODO: export해서 phaser main scene에서 불리게? 또는 Lobby? redis에 저장까지
  const getBojInfos = async () => {
    try {
      const response = await axios.get(`http://localhost:3003/boj-infos`);
      await setbojInfos(response.data);
      //   console.log(bojInfos);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBack = async () => {
    await setbojInfos([]);
    store.dispatch(openGame());
  };

  return (
    <>
      <Background>
        <Box sx={{ display: 'flex' }}>
          <RankingHeader />

          <RankingList
            getBojInfos={getBojInfos}
            bojInfos={bojInfos}
            setbojInfos={setbojInfos}
          />
          <MainField />
        </Box>
        <CloseButton handleBack={handleBack} />
      </Background>
    </>
  );
}

export default Whiteboard;

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
`;
