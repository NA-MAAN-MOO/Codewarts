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
import FloatingBox from 'components/FloatingBox';
import SimplePopper from 'components/SimplePopper';
import { styled as muiStyled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const VoiceItem = ({
  session,
  subscribers,
  publisher,
  name = '', //보이스 목록 아이템이 나타내는 유저 닉네임
  isMe = false, //내 보이스 목록 아이템인지
  isSuperior = false, //내가 에디터 주인인지
  useFloatBox = false, //플로트 박스 안에 있는 버전인지(사이즈가 커짐)
}: GameVoiceType & {
  name?: string;
  char?: string;
  isMe?: boolean;
  isSuperior?: boolean;
  useFloatBox?: boolean;
}) => {
  const dispatch = useDispatch();
  const { handleMyMicMute, handleMyVolumeMute } = useVoice();
  const {
    playerId,
    myVolMute,
    myMicMute,
    volMuteInfo,
    micMuteInfo,
    isMicAllowed,
  } = useSelector((state: RootState) => {
    return { ...state.user, ...state.chat };
  });

  const LightTooltip = muiStyled(({ className, ...props }: TooltipProps) => (
    <Tooltip classes={{ popper: className }} {...props} />
  ))(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'rgb(226, 178, 100, 0.9)',
      boxShadow: theme.shadows[1],
      fontSize: 16,
      padding: '13px',
      borderRadius: '50px',
      border: 'solid rgb(172, 0, 0) 2px',
      color: styledTheme.darkRed,
      fontFamily: 'Pretendard-Regular',
      fontWeight: 'bold',
    },
  }));

  const isVolMute = isMe ? myVolMute : volMuteInfo[name];
  const isMicMute = isMe ? myMicMute : micMuteInfo[name];

  //내 볼륨 음소거 처리
  const handleMyVolume = async () => {
    if (!session) return;
    await handleMyVolumeMute({ subscribers, session, muteTo: !myVolMute });
  };

  //내 마이크 음소거 처리
  const handleMyMic = async () => {
    if (!session || !publisher) return;
    await handleMyMicMute({ publisher, session, muteTo: !myMicMute });
  };

  //내 방에 들어온 다른 사람 볼륨 음소거 처리
  const handleGuestVolume = () => {
    if (!session) return console.log('세션없음');
    const otherMuteNow = volMuteInfo[name];
    const sendingData = JSON.stringify({
      user: name,
      muteTo: !otherMuteNow,
    });
    session.signal({
      type: MUTE_TYPE.SET_VOL,
      data: sendingData,
    });
  };

  //내 방에 들어온 다른 사람 마이크 음소거 처리
  const handleGuestMic = () => {
    if (!session) return console.log('세션없음');
    const otherMuteNow = micMuteInfo[name];
    console.log(otherMuteNow);
    const sendingData = JSON.stringify({
      user: name,
      muteTo: !otherMuteNow,
    });
    session.signal({
      type: MUTE_TYPE.SET_MIC,
      data: sendingData,
    });
  };

  const WrapperDiv = useFloatBox ? FloatingBox : SmallWrapper;

  return (
    <>
      <WrapperDiv>
        <VolumeIcon
          color={isMe || isSuperior ? 'white' : 'gray'}
          handleVolume={
            isMe ? handleMyVolume : isSuperior ? handleGuestVolume : undefined
          }
          isMute={isVolMute}
          size={
            useFloatBox ? styledTheme.normalIconSize : styledTheme.smallIconSize
          }
        />
        {isMicAllowed && !!publisher ? (
          //마이크 권한 허용
          <MicIcon
            color={isMe || isSuperior ? 'white' : 'gray'}
            handleMic={
              isMe ? handleMyMic : isSuperior ? handleGuestMic : undefined
            }
            isMute={isMicMute}
            size={
              useFloatBox
                ? styledTheme.normalIconSize
                : styledTheme.smallIconSize
            }
          />
        ) : (
          //마이크 권한 허용하지 않았을 때
          <LightTooltip
            title={
              !isMicAllowed
                ? '마이크 권한을 허용해 주세요.'
                : '마이크를 인식하지 못했습니다.'
            }
            placement="top"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MicIcon
                color={isMe || isSuperior ? 'white' : 'gray'}
                isMute={true}
                size={
                  useFloatBox
                    ? styledTheme.normalIconSize
                    : styledTheme.smallIconSize
                }
              />
            </div>
          </LightTooltip>
        )}
        {useFloatBox && <SimplePopper />}
      </WrapperDiv>
    </>
  );
};

export default VoiceItem;

const SmallWrapper = styled.div`
  display: flex;
  gap: 5px;
`;
