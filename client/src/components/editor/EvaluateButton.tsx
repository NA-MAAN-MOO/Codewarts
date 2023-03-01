import { useEffect, useState } from 'react';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
/* toast */
import { notifySuccess, notifyFail } from './toast';
//@ts-ignore
import missSoundFile from '../../assets/sound_effect/miss_sound.mp3';
//@ts-ignore
import hitSoundFile from '../../assets/sound_effect/hit_sound.mp3';
import SoundPlayer from 'hooks/useSoundPlayer';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

//@ts-ignore
function EvaluateButton(props) {
  const { userName, editorName } = useSelector(
    (state: RootState) => state.editor
  );
  const { ytext, bojProbData, markingPercent, setMarkingPercent, mySocket } =
    props;
  let [진행완료, set진행완료] = useState(false);
  const newMissSoundToggle = SoundPlayer(missSoundFile);
  const newHitSoundToggle = SoundPlayer(hitSoundFile);

  /* fetching '.in' file */
  async function fetchInputFileText(url: string) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      return text;
    } catch {
      console.log('input 파일 fetching 실패');
      return null;
    }
  }

  /* 유저가 가채점 성공시 소켓 이벤트 발동 */
  const broadcastSuccess = () => {
    mySocket?.emit('Big Deal', {
      editorName: editorName,
      problemId: bojProbData?.problemId || null,
      broadcast: true,
    });
  };

  /* 유저가 작성한 코드 가채점하기 위해 서버로 보냄 */
  const evaluateCode = async () => {
    if (!ytext.toString()) {
      alert('채점을 위해 코드를 작성해주세요');
      return;
    }

    // 현재는 '19940 피자오븐', '19939 박 터뜨리기' 문제만 가채점 가능!
    if (bojProbData?.problemId !== 19940 && bojProbData?.problemId !== 19939) {
      alert('채점 가능한 문제 선택해주세요:  19940번, 19939번');
      return;
    }

    let hitCount = 0;
    let totalCases = 0; // 전체 testcase 개수

    if (bojProbData?.problemId === 19940) {
      totalCases = 2; // 19940번 테스트 케이스 개수
    } else {
      totalCases = 10; // 19939번 테스트 케이스 개수
    }

    try {
      for (let i = 1; i < 50; i++) {
        const fetchInput = await fetchInputFileText(
          `/assets/olympiad/${bojProbData?.problemId}/${i}.in`
        );

        if (fetchInput === null || fetchInput?.startsWith('<!DOCTYPE html>')) {
          console.log('더 이상 채점할 파일이 없어요!!');
          set진행완료(true);
          break;
        }

        const { data } = await axios.post(
          `${APPLICATION_EDITOR_URL}/code_to_run`,
          {
            codeToRun: ytext.toString(),
            //@ts-ignore
            stdin: fetchInput,
          }
        );

        const fetchOutput = await fetchInputFileText(
          `assets/olympiad/${bojProbData?.problemId}/${i}.out`
        );
        const jdoodleOutput = data.output;

        if (jdoodleOutput === fetchOutput) {
          console.log(`${i}번 테스트 케이스 맞음`);
          hitCount++;
        } else {
          console.log(`${i}번 테스트 케이스 틀림`);
        }

        setMarkingPercent(`${(hitCount / totalCases) * 100}`);
      }
    } catch (error) {
      console.error(error);
      alert('채점 실패');
    }
  };

  async function callCloudFunction(data: any) {
    const url = `https://asia-northeast3-codeuk-379309.cloudfunctions.net/compiler`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    console.log(options);

    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  }

  const evaluateSample = async () => {
    const inputData = {
      stdin: '',
      code: ytext.toString(),
    };

    callCloudFunction(inputData)
      .then((result) => {
        console.log('Result:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    if (!bojProbData?.problemId) return;
    if (진행완료 === false) {
      // console.log('아직 채점 다 안 끝났어요~');
      return;
    }
    if (markingPercent === '100') {
      notifySuccess(editorName, bojProbData.problemId);
      newHitSoundToggle();
      broadcastSuccess();
    } else {
      notifyFail(editorName, bojProbData.problemId);
      newMissSoundToggle();
    }
    set진행완료(false);
  }, [markingPercent, 진행완료]);

  return (
    <>
      <Tooltip title="코드와트 가채점">
        <Button
          color="primary"
          onClick={evaluateCode}
          style={{
            fontFamily: 'Cascadia Code, Pretendard-Regular',
            fontSize: '17px',
          }}
        >
          가채점
        </Button>
      </Tooltip>
      {/* ▼ 문제 성공 알림을 테스트하고 싶으면 주석 해제 */}
      {/* <button onClick={broadcastSuccess}>
        테스트버튼: "{editorName}"님이 문제 맞췄다고 알리기
      </button> */}
      <Button
        color="primary"
        style={{
          fontFamily: 'Cascadia Code, Pretendard-Regular',
          fontSize: '17px',
        }}
        onClick={evaluateSample}
      >
        예제채점
      </Button>{' '}
    </>
  );
}

export default EvaluateButton;
