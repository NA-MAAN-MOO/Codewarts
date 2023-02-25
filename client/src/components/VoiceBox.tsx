import React, { useState, useEffect } from 'react';
import Audio from 'components/Audio';
import styled from 'styled-components';
import { Session, Publisher, Subscriber } from 'openvidu-browser';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import { GameVoiceType } from 'types';
import FloatingBox from 'components/FloatingBox';
import { MUTE_TYPE } from 'utils/Constants';
import MicIcon from 'components/MicIcon';
import VolumeIcon from 'components/VolumeIcon';
import { toggleMyMicMute, toggleMyVolMute } from 'stores/chatSlice';

const VoiceBox = ({
  session,
  subscribers,
  publisher,
  useFloatBox = true,
}: GameVoiceType & { useFloatBox?: boolean }) => {
  const dispatch = useDispatch();
  const { playerId, myVolMute, myMicMute } = useSelector((state: RootState) => {
    return { ...state.user, ...state.chat };
  });

  //볼륨 음소거 처리
  const handleVolume = () => {
    subscribers.map((sm) => {
      sm.subscribeToAudio(!myVolMute);
    });
    dispatch(toggleMyVolMute());
    session?.signal({
      type: MUTE_TYPE.VOL,
      data: playerId,
    });
  };

  //마이크 음소거 처리
  const handleMic = () => {
    if (!!publisher) publisher.publishAudio(!myMicMute);
    dispatch(toggleMyMicMute());
    session?.signal({
      type: MUTE_TYPE.MIC,
      data: playerId,
    });
  };

  const VolumeSet = () => (
    <>
      <VolumeIcon
        color="white"
        handleVolume={handleVolume}
        isMute={myVolMute}
      />
      <MicIcon color="white" handleMic={handleMic} isMute={myMicMute} />
    </>
  );
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
      {useFloatBox ? (
        <FloatingBox>
          <VolumeSet />
        </FloatingBox>
      ) : (
        <div>
          <VolumeSet />
        </div>
      )}
    </>
  );
};

export default VoiceBox;
