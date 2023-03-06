import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { openGame } from 'stores/modeSlice';
import store, { RootState } from 'stores';
import Box from '@mui/material/Box';
import RankingHeader from 'components/whiteboard/RankingHeader';
import MainField from 'components/whiteboard/MainField';
import RankingList from 'components/whiteboard/RankingList';
import { useSelector } from 'react-redux';
import 'animate.css';

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
  let rankInfos: any = useSelector((state: RootState) => state.rank.infos);

  let [bojInfos, setbojInfos] = useState<DetailInfo[]>(initialState);

  // const getBojInfos = async () => {
  //   try {
  //     const response = await axios.get(`${APPLICATION_DB_URL}/boj-infos`);
  //     setbojInfos(response.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const getBojInfos = () => {};
  // useEffect(()=> {})
  useEffect(() => {
    setbojInfos(rankInfos);
  }, []);

  const handleClose = () => {
    setbojInfos([]);
    store.dispatch(openGame());
  };

  return (
    <>
      <Background>
        <Box
          sx={{ display: 'flex', animationDuration: '0.8s' }}
          className="animate__animated animate__zoomIn"
        >
          <RankingHeader />

          <RankingList
            // getBojInfos={getBojInfos}
            bojInfos={bojInfos}
            // setbojInfos={setbojInfos}
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
  overflow: hidden;
`;
