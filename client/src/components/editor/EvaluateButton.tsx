import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

/* toast */
import { notifySuccess, notifyFail } from './toast';

//@ts-ignore
function EvaluateButton(props) {
  const { userName, roomId } = useSelector((state: RootState) => state.editor);
  const { ytext, bojProbData, markingPercent, setMarkingPercent } = props;

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

  /* 유저가 작성한 코드 가채점하기 위해 서버로 보냄 */
  const evaluateCode = async () => {
    if (!ytext.toString()) {
      alert('채점을 위해 코드를 작성해주세요');
      return;
    }

    // 현재는 '19940 피자오븐' 문제만 가채점 가능!
    if (bojProbData?.problemId !== 19940) {
      alert('채점 가능한 문제 선택해주세요: 19940번');
      return;
    }

    let totalCases = 2; // 19940번 테스트 케이스 개수
    let hitCount = 0;

    try {
      for (let i = 1; i < 50; i++) {
        const fetchInput = await fetchInputFileText(
          `/assets/olympiad/0${i}.in`
        );

        if (fetchInput === null || fetchInput?.startsWith('<!DOCTYPE html>')) {
          console.log('더 이상 채점할 파일이 없어요!!');
          break;
        }

        const { data } = await axios.post(`http://localhost:3001/code_to_run`, {
          codeToRun: ytext.toString(),
          //@ts-ignore
          stdin: fetchInput,
        });

        const fetchOutput = await fetchInputFileText(
          `assets/olympiad/0${i}.out`
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

      // 현재 비동기적으로 작동함
      if (markingPercent === '100') {
        notifySuccess(roomId, bojProbData.problemId);
      } else {
        notifyFail(roomId, bojProbData.problemId);
      }
    } catch (error) {
      console.error(error);
      alert('채점 실패');
    }
  };

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
    </>
  );
}

export default EvaluateButton;
