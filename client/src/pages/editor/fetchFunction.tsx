//@ts-nocheck
/* GraphQL queries */
import USERINFOQUERY from '../../graphql/userInfoQuery';
import axios from 'axios';

const APPLICATION_EDITOR_URL =
  process.env.REACT_APP_EDITOR_URL || 'http://localhost:3001';

/* leetcode 유저 정보 가져오기 */
export const fetchLeetUserData = async (leetUserName: string) => {
  // if (leetUserNameRef.current === null) return;

  //@ts-ignore
  // let leetUserName = leetUserNameRef.current.value;
  console.log(leetUserName);

  const userQueryVariable = {
    //@ts-ignore
    username: leetUserName,
  };

  try {
    const response = await axios.post(
      `${APPLICATION_EDITOR_URL}/leet_user_data`,
      {
        query: USERINFOQUERY,
        variables: userQueryVariable,
      }
    );

    let userData = response.data;
    console.log(userData);
    // setLeetUserData(userData.data);
  } catch (error) {
    console.error(error);
  }
};

/* 백준 유저 정보 가져오기 */
export const fetchBojUserData = async () => {
  if (bojUserNameRef.current === null) return;

  //@ts-ignore
  let bojUserName = bojUserNameRef.current.value;
  console.log(bojUserName);

  try {
    const response = await axios.get(
      `https://solved.ac/api/v3/search/user?query=${bojUserName}`
    );

    let userData = response.data;
    console.log(userData);
    setBojUserData(userData);
  } catch (error) {
    console.error(error);
  }
};

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
