import { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import bgm1 from 'assets/bgms/bgm1.mp3';
import bgm2 from 'assets/bgms/bgm2.mp3';
import bgm3 from 'assets/bgms/bgm3.mp3';
import { Button, Fab, Fade } from '@mui/material';
import { RootState } from 'stores';
import { useDispatch, useSelector } from 'react-redux';
import FloatingIcon from 'components/FloatingIcon';
import MusicOffRoundedIcon from '@mui/icons-material/MusicOffRounded';
import './BgmPlayer.css';
import { setUserBgmState } from 'stores/userSlice';

const BgmPlayer = () => {
  const bgms = [bgm1, bgm2, bgm3];
  const [bgmIdx, setBgmIdx] = useState(0);
  // let bgmIdx = 0;
  // const setBgmIdx = (idx: number) => {
  //   bgmIdx = idx;
  // };
  const player = useRef<AudioPlayer>(null);
  const { userBgmState } = useSelector((state: RootState) => {
    return state.user;
  });
  const dispatch = useDispatch();

  const [selectedBgm, setSelectedBgm] = useState(bgm1);

  const onClickNext = () => {
    if (bgmIdx + 1 === bgms.length) {
      //왜 011 반복이지
      setBgmIdx(0);
    } else {
      setBgmIdx((prev) => prev + 1);
    }
    // setSelectedBgm(`${bgms[bgmIdx]}`);
  };
  const onClickPrev = () => {
    if (bgmIdx - 1 === -1) {
      setBgmIdx(bgms.length - 1);
    } else {
      setBgmIdx((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setSelectedBgm(`${bgms[bgmIdx]}`);
  }, [bgmIdx]);
  const playerPlay = () => {
    player.current?.audio?.current?.play();
  };
  const playerPause = () => {
    player.current?.audio?.current?.pause();
  };
  useEffect(userBgmState ? playerPlay : playerPause, [userBgmState]);
  const [checked, setChecked] = useState(false);

  const AudioPlayerToggle = (
    <div style={{ width: '20%', height: '10%', zIndex: `1` }}>
      <AudioPlayer
        showSkipControls
        showJumpControls={false}
        style={{ minWidth: '300px' }}
        onClickNext={onClickNext}
        onClickPrevious={onClickPrev}
        customProgressBarSection={[]}
        ref={player}
        loop={true}
        volume={0.1}
        src={selectedBgm}
        // onPlay={(e) => console.log('onPlay')}
      />
    </div>
  );

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div
      style={{
        // padding: '4px',
        gap: '10px',
        display: 'flex',
        position: 'absolute',
        bottom: '2%',
        left: '1%',
        flexDirection: 'column',
        flexFlow: 'column-reverse',
      }}
    >
      <FloatingIcon
        icon={userBgmState ? AudiotrackIcon : MusicOffRoundedIcon}
        // handleClick={handleChange}
        handleClick={() => dispatch(setUserBgmState(!userBgmState))}
        position="static"
      />
      {/* <AudiotrackIcon /> */}
      <Fade in={false}>{AudioPlayerToggle}</Fade>
    </div>
  );
};

export default BgmPlayer;

// const useAudio = (url: string) => {
//   // const [audio] = useState(new Audio(url));
//   const audio = new Audio(url);
//   const toggle = () => audio.play();
//   return toggle;
// };

// const SoundPlayer = (url: string) => {
//   // const [playing, toggle] = useAudio(url);
//   const toggle = useAudio(url);
//   return toggle;
// };

// export default SoundPlayer;
