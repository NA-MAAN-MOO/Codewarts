//@ts-nocheck
import axios from 'axios';

/* GraphQL queries */
import PROBLEMQUERY from '../../graphql/problemQuery';
import {
  HeaderTab,
  StyledTabs,
  StyledTab,
  ProbSummary,
  AlgoInputWrap,
  AlgoTextField,
} from '../../../src/pages/editor/editorStyle';
import RenderSvg from 'components/Svg';
import Chip from '@mui/material/Chip';

//@ts-ignore
function AlgoHeaderTab(props) {
  const {
    algoSelect,
    setAlgoSelect,
    bojProbData,
    setBojProbData,
    leetProbData,
    setLeetProbData,
    bojProbDataRef,
    leetProbDataRef,
    setBojProbFullData,
  } = props;

  const selectChange = (event, newValue: number) => {
    setAlgoSelect(newValue);
  };

  /* 서버로 몽고DB에 저장된 백준 문제 정보 요청 */
  async function fetchBojProbFullData(probId: string) {
    if (bojProbDataRef.current === null) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/bojdata?probId=${probId}`
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (algoSelect === 0) {
        fetchBojProbInfo();
      } else {
        fetchLeetProbInfo();
      }
    }
  };

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

      {algoSelect === 0 && bojProbData?.level ? (
        <ProbSummary>
          <div>
            <RenderSvg svgName={bojProbData.level} />
            <span>
              {bojProbData?.problemId}번 {bojProbData?.titleKo}
            </span>
          </div>
        </ProbSummary>
      ) : leetProbData?.question.questionId ? (
        <ProbSummary>
          <div>
            <span>
              <Chip
                label={leetProbData?.question.difficulty}
                color={
                  leetProbData?.question.difficulty === 'Easy'
                    ? 'success'
                    : leetProbData?.question.difficulty === 'Medium'
                    ? 'warning'
                    : 'error'
                }
              />{' '}
              {leetProbData?.question.questionId}번{' '}
              {leetProbData?.question.title}
            </span>
          </div>
        </ProbSummary>
      ) : null}

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
