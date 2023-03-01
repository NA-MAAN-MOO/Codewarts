import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import { GameVoiceType } from 'types';
import { MUTE_TYPE } from 'utils/Constants';
import MicIcon from 'components/MicIcon';
import VolumeIcon from 'components/VolumeIcon';
import useVoice from 'hooks/useVoice';
import { styledTheme } from 'styles/theme';

const VoiceItem = ({
  session,
  subscribers,
  publisher,
  name, //보이스 목록 아이템이 나타내는 유저 닉네임
  isMe = false, //내 보이스 목록 아이템인지
  isSuperior = false, //내가 에디터 주인인지
}: GameVoiceType & {
  name: string;
  char: string;
  isMe?: boolean;
  isSuperior?: boolean;
}) => {
  const dispatch = useDispatch();
  const { handleMyMicMute, handleMyVolumeMute } = useVoice();
  const { playerId, myVolMute, myMicMute, volMuteInfo, micMuteInfo } =
    useSelector((state: RootState) => {
      return { ...state.user, ...state.chat };
    });

  const isVolMute = isMe ? myVolMute : volMuteInfo[name];
  const isMicMute = isMe ? myMicMute : micMuteInfo[name];

  //내 볼륨 음소거 처리
  const handleMyVolume = async () => {
    if (!session) return;
    await handleMyVolumeMute({ subscribers, session });
  };

  //내 마이크 음소거 처리
  const handleMyMic = async () => {
    if (!session || !publisher) return;
    await handleMyMicMute({ publisher, session });
  };

  //내 방에 들어온 다른 사람 볼륨 음소거 처리
  const handleGuestVolume = () => {
    if (!session) return console.log('세션없음');
    session.signal({
      type: MUTE_TYPE.SET_VOL,
      data: name,
    });
  };

  //내 방에 들어온 다른 사람 마이크 음소거 처리
  const handleGuestMic = () => {
    if (!session) return console.log('세션없음');
    session.signal({
      type: MUTE_TYPE.SET_MIC,
      data: name,
    });
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '5px' }}>
        <VolumeIcon
          color={isMe || isSuperior ? 'white' : 'gray'}
          handleVolume={
            isMe ? handleMyVolume : isSuperior ? handleGuestVolume : undefined
          }
          isMute={isVolMute}
          size={styledTheme.smallIconSize}
        />
        <MicIcon
          color={isMe || isSuperior ? 'white' : 'gray'}
          handleMic={
            isMe ? handleMyMic : isSuperior ? handleGuestMic : undefined
          }
          isMute={isMicMute}
          size={styledTheme.smallIconSize}
        />
      </div>
    </>
  );
};

export default VoiceItem;
