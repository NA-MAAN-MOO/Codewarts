import React, { useState, useEffect } from 'react';
import { GameVoiceType } from 'types';
import AudioList from 'components/AudioList';
import VoiceItem from 'components/VoiceItem';
import useVoice from 'hooks/useVoice';

const GameVoiceBox = (props: GameVoiceType) => {
  const { subscribers } = props;

  return (
    <>
      <AudioList subscribers={subscribers} />
      <VoiceItem isMe={true} useFloatBox={true} {...props} />
    </>
  );
};

export default GameVoiceBox;
