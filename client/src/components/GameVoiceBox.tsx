import React, { useState, useEffect } from 'react';
import { GameVoiceType } from 'types';
import AudioList from 'components/AudioList';
import VoiceItem from 'components/VoiceItem';

const GameVoiceBox = (props: GameVoiceType & { useFloatBox?: boolean }) => {
  const { subscribers } = props;

  return (
    <>
      <AudioList subscribers={subscribers} />
      <VoiceItem isMe={true} useFloatBox={true} {...props} />
    </>
  );
};

export default GameVoiceBox;
