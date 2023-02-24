import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Session,
  StreamManager,
  Publisher,
  Subscriber,
} from 'openvidu-browser';
import { LoadingOutlined } from '@ant-design/icons';
import VoiceBox from 'components/VoiceBox';
import FloatingBox from 'components/FloatingBox';

type GameVoiceType = {
  session: Session | undefined;
  subscribers: Subscriber[];
  publisher: Publisher | undefined;
  leaveSession: () => void;
  joinSession: () => void;
};

const EditorVoice = (props: GameVoiceType) => {
  const { session, joinSession } = props;

  return (
    <>
      {!!session ? (
        <VoiceBox {...props} />
      ) : (
        <FloatingBox>
          <LoadingOutlined />
          오디오 연결 중...
        </FloatingBox>
      )}
    </>
  );
};

export default EditorVoice;

const ConnectingLine = styled.div`
  color: lightgray;
  display: flex;
  gap: 10px;
`;
