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

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

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
  // or 로딩 상태 만들어서 로딩중 ...
  const getBojInfos = async () => {
    try {
      const response = await axios.get(`${APPLICATION_DB_URL}/boj-infos`);
      setbojInfos(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    setbojInfos([]);
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
          <MainField handleClose={handleClose} />
        </Box>
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
