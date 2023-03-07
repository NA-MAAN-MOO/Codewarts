import { useEffect, useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
//@ts-ignore
import bgm1 from '../../assets/bgms/Rinne - End world.mp3';
//@ts-ignore
import bgm2 from '../../assets/bgms/Rinne2.mp3';
import { Button, Fab, Fade } from '@mui/material';
import { RootState } from 'stores';
import { useSelector } from 'react-redux';

const BgmPlayer = () => {
  const bgms = [bgm1, bgm2];
  const [bgmIdx, setBgmIdx] = useState(1);
  // let bgmIdx = 0;
  // const setBgmIdx = (idx: number) => {
  //   bgmIdx = idx;
  // };
  const player = useRef<AudioPlayer>(null);
  const { userBgmState } = useSelector((state: RootState) => {
    return state.user;
  });

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
  const playerPauseResume = () => {
    player.current?.audio?.current?.pause();
  };
  useEffect(playerPlay, [userBgmState]);
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
        volume={0.3}
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
        padding: '4px',
        gap: '10px',
        display: 'flex',
        position: 'absolute',
        bottom: '0%',
        left: '0',
      }}
    >
      <div>
        <div style={{ height: '35%' }}></div>
        <Fab
          onClick={handleChange}
          size="small"
          color="primary"
          aria-label="add"
        >
          <AudiotrackIcon />
        </Fab>
      </div>
      <Fade in={checked}>{AudioPlayerToggle}</Fade>
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
