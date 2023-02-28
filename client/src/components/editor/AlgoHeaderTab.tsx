import axios from 'axios';
/* GraphQL queries */
import PROBLEMQUERY from '../../graphql/problemQuery';
import {
  HeaderTab,
  StyledTabs,
  StyledTab,
  AlgoInputWrap,
  AlgoTextField,
} from '../../../src/pages/editor/editorStyle';
import { useEffect } from 'react';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

//@ts-ignore
function AlgoHeaderTab(props) {
  const {
    algoSelect,
    setAlgoSelect,
    setBojProbData,
    setLeetProbData,
    bojProbDataRef,
    leetProbDataRef,
    setBojProbFullData,
    bojProblemId,
    setBojProblemId,
  } = props;

  //@ts-ignore
  const selectChange = (event, newValue: number) => {
    setAlgoSelect(newValue);
  };

  /* 서버로 몽고DB에 저장된 백준 문제 정보 요청 */
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

  /* 백준 문제 정보 가져오기 */
  const fetchBojProbInfo = async () => {
    if (bojProbDataRef.current === null) return;

    let probId = bojProbDataRef.current.value;
    setBojProblemId(probId);
    console.log(probId);

    try {
      const response = await axios.get(
        `https://solved.ac/api/v3/problem/show?problemId=${probId}`
      );

      let probData = response.data;
      console.log(probData);
      setBojProbData(probData);
      fetchBojProbFullData(probId);
    } catch (error) {
      console.error(error);
    }
  };

  /* leetcode 문제 정보 가져오기 */
  const fetchLeetProbInfo = async () => {
    if (leetProbDataRef.current === null) return;

    const problemQueryVariable = {
      //@ts-ignore
      titleSlug: leetProbDataRef.current.value,
    };

    try {
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
        {
          query: PROBLEMQUERY,
          variables: problemQueryVariable,
        }
      );

      let probData = response.data;
      console.log(probData.data);
      setLeetProbData(probData.data);
    } catch (error) {
      console.error(error);
    }
  };

  //@ts-ignore
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (algoSelect === 0) {
        fetchBojProbInfo();
      } else {
        fetchLeetProbInfo();
      }
    }
  };

  useEffect(() => {
    return setBojProbFullData(null);
  }, []);

  return (
    <HeaderTab>
      <StyledTabs
        value={algoSelect}
        onChange={selectChange}
        aria-label="algo-selector"
      >
        <StyledTab label="Baekjoon" />
        <StyledTab label="LeetCode" />
      </StyledTabs>

      <AlgoInputWrap>
        <div>
          <AlgoTextField
            id="reddit-input"
            label={algoSelect === 0 ? '백준 문제 번호' : 'leetcode-title-slug'}
            variant="filled"
            size="small"
            inputRef={algoSelect === 0 ? bojProbDataRef : leetProbDataRef}
            autoFocus={true}
            type="text"
            onKeyDown={handleKeyDown}
          />
        </div>
      </AlgoInputWrap>
    </HeaderTab>
  );
}

export default AlgoHeaderTab;
