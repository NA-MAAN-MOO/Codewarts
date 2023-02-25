import React, { useState, useEffect } from 'react';
import Audio from 'components/Audio';
import styled from 'styled-components';
import { Session, Publisher, Subscriber } from 'openvidu-browser';
import { useSelector } from 'react-redux';
import type { RootState } from 'stores';
import { GameVoiceType } from 'types';
import FloatingBox from 'components/FloatingBox';
import { MUTE_TYPE } from 'utils/Constants';
import MicIcon from 'components/MicIcon';
import VolumeIcon from 'components/VolumeIcon';

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

  //볼륨 음소거 처리
  const handleVolume = () => {
    subscribers.map((sm) => {
      sm.subscribeToAudio(!volumeOn);
    });
    setVolumeOn(!volumeOn);
    session?.signal({
      type: MUTE_TYPE.VOL,
      data: playerId,
    });
  };

  //마이크 음소거 처리
  const handleMic = () => {
    if (!!publisher) publisher.publishAudio(!micOn);
    setMicOn(!micOn);
    session?.signal({
      type: MUTE_TYPE.MIC,
      data: playerId,
    });
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
        <VolumeIcon
          color="white"
          handleVolume={handleVolume}
          isMute={!volumeOn}
        />
        <MicIcon color="white" handleMic={handleMic} isMute={!micOn} />
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
