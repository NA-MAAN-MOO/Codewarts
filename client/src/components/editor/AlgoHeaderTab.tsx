import axios from 'axios';
import {
  HeaderTab,
  AlgoTextField,
} from '../../../src/pages/editor/editorStyle';
import { useEffect } from 'react';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

//@ts-ignore
function AlgoHeaderTab(props) {
  const { bojProbDataRef, setBojProbFullData, setBojProblemId } = props;

  /* 서버로 몽고DB에 저장된 백준 문제 전체 정보 요청 */
  async function fetchBojProbFullData(probId: string) {
    if (bojProbDataRef.current === null) return;

    try {
      const response = await axios.get(
        `${APPLICATION_EDITOR_URL}/bojdata?probId=${probId}`
      );

      let probFullData = response.data[0];
      console.log(probFullData);
      setBojProbFullData(probFullData);
    } catch (error) {
      console.error(error);
    }
  }

  //@ts-ignore
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      let probId = bojProbDataRef.current.value;
      setBojProblemId(parseInt(probId));
      fetchBojProbFullData(probId);
    }
  };

  // useEffect(() => {
  //   return setBojProbFullData(null);
  // }, []);

  return (
    <HeaderTab>
      <AlgoTextField
        id="reddit-input"
        label="문제 번호로 바로가기"
        variant="filled"
        size="small"
        inputRef={bojProbDataRef}
        autoFocus={true}
        type="text"
        onKeyDown={handleKeyDown}
        fullWidth
      />
    </HeaderTab>
  );
}

export default AlgoHeaderTab;
