import useVoice from 'hooks/useVoice';
import { VoiceProp } from 'types';
import GameVoice from 'pages/voice/GameVoice';
import { GAME_STATUS } from 'utils/Constants';
import EditorVoice from 'pages/voice/EditorVoice';

const TestVoiceButtons = ({ roomKey }: { roomKey: string }) => {
  const { getSessions, getConnections } = useVoice();

  return (
    <>
      <button
        onClick={async () => {
          const conn = await getConnections(roomKey);
          console.log(conn);
        }}
      >
        현재 세션 커넥션 가져오기
      </button>
      <button
        onClick={async () => {
          const conn = await getConnections(GAME_STATUS.GAME);
          console.log(conn);
        }}
      >
        메인 세션 커넥션 가져오기
      </button>
      <button
        onClick={async () => {
          const ses = await getSessions();
          console.log(ses);
        }}
      >
        전체 세션 가져오기
      </button>
    </>
  );
};

export default TestVoiceButtons;
