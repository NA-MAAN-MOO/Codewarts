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
