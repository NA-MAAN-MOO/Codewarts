import React, { useState, useEffect } from 'react';
import Audio from 'components/Audio';
import styled from 'styled-components';
import { ReactComponent as MicOff } from 'assets/icons/mic_off.svg';
import { ReactComponent as MicOn } from 'assets/icons/mic_on.svg';
import { ReactComponent as VolOff } from 'assets/icons/volume_off.svg';
import { ReactComponent as VolOn } from 'assets/icons/volume_on.svg';
import { Session, Publisher, Subscriber } from 'openvidu-browser';
import { useSelector } from 'react-redux';
import type { RootState } from 'stores';
import { GameVoiceType } from 'types';
import FloatingBox from 'components/FloatingBox';

const VoiceBox = ({
  session,
  subscribers,
  publisher,
  leaveSession,
  joinSession,
}: GameVoiceType) => {
  const [volumeOn, setVolumeOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const { playerId } = useSelector((state: RootState) => {
    return state.user;
  });

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
    <>
      {subscribers.map((sub, i) => {
        const { user } = JSON.parse(sub.stream.connection.data);
        return (
          user !== playerId && (
            <div key={user} style={{ display: 'hidden' }}>
              <Audio streamManager={sub} />
            </div>
          )
        );
      })}
      <FloatingBox>
        {volumeOn ? (
          <VolOn
            width="32px"
            height="32px"
            fill="white"
            onClick={handleVolume}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <VolOff
            width="32px"
            height="32px"
            fill="white"
            onClick={handleVolume}
            style={{ cursor: 'pointer' }}
          />
        )}
        {micOn ? (
          <MicOn
            width="30px"
            height="30px"
            fill="white"
            onClick={handleMic}
            style={{ transform: 'scaleX(-1)', cursor: 'pointer' }}
          />
        ) : (
          <MicOff
            width="30px"
            height="30px"
            fill="white"
            onClick={handleMic}
            style={{ transform: 'scaleX(-1)', cursor: 'pointer' }}
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
      </FloatingBox>
    </>
  );
};

export default VoiceBox;
