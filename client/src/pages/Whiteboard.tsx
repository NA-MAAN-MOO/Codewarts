import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { openGame } from 'stores/modeSlice';
import store, { RootState, useAppDispatch } from 'stores';
import { getbojInfos } from 'stores/rankSlice';
import Box from '@mui/material/Box';
import RankingHeader from 'components/whiteboard/RankingHeader';
import MainField from 'components/whiteboard/MainField';
import RankingList from 'components/whiteboard/RankingList';
import { useSelector } from 'react-redux';
import 'animate.css';
import Image from '../assets/images/leaderboard_bg.png';
import { APPLICATION_URL } from 'utils/Constants';

const APPLICATION_DB_URL = APPLICATION_URL.APPLICATION_DB_URL;

interface DetailInfo {
  bojId: string;
  userId: string;
  maxStreak: number;
  nickname: string;
  tier: number;
  solved: number;
}

function Whiteboard() {
  const initialState: [] = [];

  let [bojInfos, setbojInfos] = useState<DetailInfo[]>(initialState);

  const getBojInfos = async () => {
    try {
      const response = await axios.get(`${APPLICATION_DB_URL}/boj-infos`);

      setbojInfos(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getBojInfos();
  }, []);

  const handleClose = () => {
    store.dispatch(openGame());
  };

  return (
    <>
      <Background>
        <Box
          sx={{
            display: 'flex',
            animationDuration: '1.2s',
            backgroundImage: `url(${Image})`,
            backgroundSize: '40% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          className="animate__animated animate__zoomIn"
        >
          <RankingHeader />

          <RankingList bojInfos={bojInfos} />
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
  // border: 1px solid blue;
`;
