import { useEffect, useState } from 'react';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
/* toast */
import { notifyFail } from './toast';
//@ts-ignore
import missSoundFile from '../../assets/sound_effect/miss_sound.mp3';
//@ts-ignore
import hitSoundFile from '../../assets/sound_effect/hit_sound.mp3';
import SoundPlayer from 'hooks/useSoundPlayer';
import { middleButtonStyle } from 'pages/editor/editorStyle';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

//@ts-ignore
function EvaluateButton(props) {
  const { userName, editorName } = useSelector(
    (state: RootState) => state.editor
  );

  const {
    ytext,
    bojProblemId,
    markingPercent,
    setMarkingPercent,
    mySocket,
    bojProbFullData,
  } = props;

  let [evalFinished, setEvalFinished] = useState(false);
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
      problemId: bojProblemId || null,
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
    if (bojProblemId !== 19940 && bojProblemId !== 19939) {
      alert('채점 가능한 문제 선택해주세요:  19940번, 19939번');
      return;
    }

    let hitCount = 0;
    let totalCases = 0; // 전체 testcase 개수

    if (bojProblemId === 19940) {
      totalCases = 2; // 19940번 테스트 케이스 개수
    } else {
      totalCases = 5; // 19939번 테스트 케이스 개수
    }

    try {
      for (let i = 1; i < 50; i++) {
        const fetchInput = await fetchInputFileText(
          `/assets/olympiad/${bojProblemId}/${i}.in`
        );

        if (fetchInput === null || fetchInput?.startsWith('<!DOCTYPE html>')) {
          console.log('더 이상 채점할 파일이 없어요!!');
          setEvalFinished(true);
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
          `assets/olympiad/${bojProblemId}/${i}.out`
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
    console.log(bojProbFullData?.samples?.[1].input.toString());
    const inputData = {
      code: ytext.toString(),
      // stdin: '1\n', // todo: 실제 input value로 바꾸기
      stdin: bojProbFullData?.samples?.[1].input.toString() || '',
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
    if (!bojProblemId) return;
    if (evalFinished === false) {
      // console.log('아직 채점 다 안 끝났어요~');
      return;
    }
    if (markingPercent === '100') {
      newHitSoundToggle();
      broadcastSuccess();
    } else {
      newMissSoundToggle();
      notifyFail(editorName, bojProblemId);
    }
    setEvalFinished(false);

    setTimeout(() => {
      setMarkingPercent(null);
    }, 4000);
  }, [markingPercent, evalFinished]);

  return (
    <>
      <Tooltip title="코드와트 가채점">
        <Button
          variant="outlined"
          color="primary"
          onClick={evaluateCode}
          style={middleButtonStyle}
        >
          SUBMIT
        </Button>
      </Tooltip>
      {/* ▼ 문제 성공 알림을 테스트하고 싶으면 주석 해제 */}
      {/* <button onClick={broadcastSuccess}>
        테스트버튼: "{editorName}"님이 문제 맞췄다고 알리기
      </button> */}
      {/* <Button
        color="primary"
        style={{
          fontFamily: 'Cascadia Code, Pretendard-Regular',
          fontSize: '17px',
        }}
        onClick={evaluateSample}
      >
        예제채점
      </Button>{' '} */}
    </>
  );
}

export default EvaluateButton;
