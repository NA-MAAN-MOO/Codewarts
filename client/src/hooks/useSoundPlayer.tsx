import React, { useState, useEffect } from 'react';

const useAudio = (url: string) => {
  // const [audio] = useState(new Audio(url));
  const audio = new Audio(url);
  // const [playing, setPlaying] = useState(false);

  // const toggle = () => setPlaying(!playing);
  const toggle = () => audio.play();

  // useEffect(() => {
  //   playing ? audio.play() : audio.pause();
  // }, [playing]);

  // useEffect(() => {
  //   audio.addEventListener('ended', () => setPlaying(false));
  //   return () => {
  //     audio.removeEventListener('ended', () => setPlaying(false));
  //   };
  // }, []);

  // return [playing, toggle];
  return toggle;
};

const SoundPlayer = (url: string) => {
  // const [playing, toggle] = useAudio(url);
  const toggle = useAudio(url);
  return toggle;
};

export default SoundPlayer;
