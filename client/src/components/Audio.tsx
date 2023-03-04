import React, { useRef, useEffect } from 'react';
import { Subscriber } from 'openvidu-browser';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores';

type AudioType = null | MediaStreamTrack;

const Audio = (props: { streamManager: Subscriber }) => {
  const { streamManager } = props;
  const audioRef = useRef(null);
  const { myVolMute } = useSelector((state: RootState) => {
    return state.chat;
  });

  useEffect(() => {
    if (!!streamManager && !!audioRef && !!audioRef.current) {
      streamManager.addVideoElement(audioRef.current);
    }
  }, [props]);

  return <audio autoPlay={true} ref={audioRef} muted={myVolMute} />;
};

export default Audio;
