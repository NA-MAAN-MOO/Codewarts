import React, { useState, useEffect } from 'react';
import Audio from 'components/Audio';
import styled from 'styled-components';
import { ReactComponent as MicOff } from 'assets/icons/mic_off.svg';
import { ReactComponent as MicOn } from 'assets/icons/mic_on.svg';
import { ReactComponent as VolOff } from 'assets/icons/volume_off.svg';
import { ReactComponent as VolOn } from 'assets/icons/volume_on.svg';
import {
  Session,
  StreamManager,
  Publisher,
  Subscriber,
} from 'openvidu-browser';
import { LoadingOutlined } from '@ant-design/icons';

type GameVoiceType = {
  session: Session | undefined;
  subscribers: Subscriber[];
  publisher: Publisher | undefined;
  leaveSession: () => void;
};

const GameVoice = ({
  session,
  subscribers,
  publisher,
  leaveSession,
}: GameVoiceType) => {
  const [volumeOn, setVolumeOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const handleVolume = () => {
    subscribers.map((sm) => {
      sm.subscribeToAudio(!volumeOn);
    });
    setVolumeOn(!volumeOn);
  };
  const handleMic = () => {
    if (!!publisher) publisher.publishAudio(!micOn);
    setMicOn(!micOn);
  };

  return (
    <AudioBox>
      {!!session ? (
        <>
          {subscribers.map((sub, i) => (
            <div key={sub.id} style={{ display: 'hidden' }}>
              <Audio streamManager={sub} />
            </div>
          ))}
          <SvgWrapper>
            {volumeOn ? (
              <VolOn
                width="32px"
                height="32px"
                fill="white"
                onClick={handleVolume}
              />
            ) : (
              <VolOff
                width="32px"
                height="32px"
                fill="white"
                onClick={handleVolume}
              />
            )}
            {micOn ? (
              <MicOn
                width="30px"
                height="30px"
                fill="white"
                onClick={handleMic}
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <MicOff
                width="30px"
                height="30px"
                fill="white"
                onClick={handleMic}
                style={{ transform: 'scaleX(-1)' }}
              />
            )}
            {/* <div id="session-header">
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
          </div> */}
          </SvgWrapper>
        </>
      ) : (
        <ConnectingLine>
          <LoadingOutlined />
          오디오 연결 중...
        </ConnectingLine>
      )}
    </AudioBox>
  );
};

export default GameVoice;

const AudioBox = styled.div`
  position: absolute;
  bottom: 30px;
  left: 25px;
`;

const ConnectingLine = styled.div`
  color: lightgray;
  display: flex;
  gap: 10px;
`;

const SvgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  & {
    cursor: pointer;
  }
`;
