import React, { useRef, useEffect } from 'react';
import { OpenVidu, Session, StreamManager } from 'openvidu-browser';

type AudioType = null | MediaStreamTrack;

const Audio = (props: { streamManager: StreamManager }) => {
  const { streamManager } = props;
  const audioRef = useRef(null);

  useEffect(() => {
    if (!!streamManager && !!audioRef && !!audioRef.current) {
      streamManager.addVideoElement(audioRef.current);
    }
  }, [props]);

  return <audio autoPlay={true} ref={audioRef} />;
};

export default Audio;
