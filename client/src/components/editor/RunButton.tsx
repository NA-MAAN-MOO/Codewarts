import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { middleButtonStyle, tooltipStyle } from 'pages/editor/editorStyle';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

//@ts-ignore
function RunButton(props) {
  const { ytext, setCompileOutput, setMemory, setCpuTime, inputStdin } = props;

  /* 유저가 작성한 코드를 컴파일하기 위해 서버로 보냄 */
  // const runCode = async () => {
  //   if (!inputStdin) return;

  //   console.log(inputStdin.value);

  //   try {
  //     const { data } = await axios.post(
  //       `${APPLICATION_EDITOR_URL}/code_to_run`,
  //       {
  //         codeToRun: ytext.toString(),
  //         //@ts-ignore
  //         stdin: inputStdin.value,
  //       }
  //     );

  //     console.log(data); // 전체 reponse body (output, statusCode, memory, cpuTime)
  //     setCompileOutput(data.output.replace(/ \n/g, '\r\n').trimEnd());
  //     setMemory(data.memory);
  //     setCpuTime(data.cpuTime);
  //   } catch (error) {
  //     console.error(error);
  //     alert('코드 서버로 보내기 실패');
  //   }
  // };

  /* 구글 클라우드 펑션 버전  */
  const runCode = async () => {
    if (!inputStdin) return;

    const inputValue = {
      code: 'def main():\n\t' + ytext.toString(),
      // code: ytext.toString(),
      //@ts-ignore
      stdin: inputStdin.value,
    };

    console.log(inputValue);

    try {
      const { data } = await axios.post(
        `${APPLICATION_EDITOR_URL}/code_to_run`,
        inputValue
      );

      console.log('코드실행상태:', data.status, '받은데이터:', data); // 전체 reponse body (memory, output, status, time)
      setCompileOutput(data.output.trimEnd());
      setMemory(data.memory);
      setCpuTime(data.time);
    } catch (error) {
      console.error(error);
      alert('코드 실행 실패');
    }
  };

  return (
    <>
      <Tooltip title="코드 실행하기" arrow slotProps={tooltipStyle}>
        <Button
          onClick={runCode}
          color="primary"
          variant="outlined"
          style={middleButtonStyle}
        >
          ▶️ 실행
        </Button>
      </Tooltip>
    </>
  );
}

export default RunButton;
