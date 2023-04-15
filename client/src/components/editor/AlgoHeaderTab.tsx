import axios from 'axios';
import {
  HeaderTab,
  AlgoTextField,
} from '../../../src/pages/editor/editorStyle';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

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
      // console.log(probFullData);
      setBojProbFullData(probFullData);
    } catch (error: any) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: '찾는 문제가 없습니다',
        });
      }
      console.error(error);
    }
  }

  /* 백준 문제 정보 가져오기 */
  // const fetchBojProbTitleDiv = async () => {
  //   if (bojProbDataRef.current === null) return;

  //   let probId = bojProbDataRef.current.value;
  //   setBojProblemId(probId);
  //   console.log(probId);

  //   try {
  //     const response = await axios.get(
  //       `https://solved.ac/api/v3/problem/show?problemId=${probId}`
  //     );

  //     let probData = response.data;
  //     console.log(probData);
  //     setBojProbData(probData);
  //     fetchBojProbFullData(probId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  /* leetcode 문제 정보 가져오기 */
  // const fetchLeetProbInfo = async () => {
  //   if (leetProbDataRef.current === null) return;

  //   const problemQueryVariable = {
  //     //@ts-ignore
  //     titleSlug: leetProbDataRef.current.value,
  //   };

  //   try {
  //     const response = await axios.post(
  //       'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
  //       {
  //         query: PROBLEMQUERY,
  //         variables: problemQueryVariable,
  //       }
  //     );

  //     let probData = response.data;
  //     console.log(probData.data);
  //     setLeetProbData(probData.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
