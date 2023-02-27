import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import { GameVoiceType } from 'types';
import FloatingBox from 'components/FloatingBox';
import { MUTE_TYPE } from 'utils/Constants';
import MicIcon from 'components/MicIcon';
import VolumeIcon from 'components/VolumeIcon';
import { toggleMyMicMute, toggleMyVolMute } from 'stores/chatSlice';
import AudioList from 'components/AudioList';
import useVoice from 'hooks/useVoice';

const GameVoiceBox = ({
  session,
  subscribers,
  publisher,
  useFloatBox = true,
}: GameVoiceType & { useFloatBox?: boolean }) => {
  const dispatch = useDispatch();
  const { playerId, myVolMute, myMicMute } = useSelector((state: RootState) => {
    return { ...state.user, ...state.chat };
  });
  const { handleMyVolumeMute, handleMyMicMute } = useVoice();

  //볼륨 음소거 처리
  const handleVolume = async () => {
    await handleMyVolumeMute({ session, subscribers });
  };

  //마이크 음소거 처리
  const handleMic = async () => {
    await handleMyMicMute({ publisher, session });
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
      <AudioList subscribers={subscribers} />
      {useFloatBox ? (
        <FloatingBox>
          <VolumeSet />
        </FloatingBox>
      ) : (
        <div style={{ display: 'flex', gap: '5px' }}>
          <VolumeSet />
        </div>
      )}
    </>
  );
};

export default GameVoiceBox;
