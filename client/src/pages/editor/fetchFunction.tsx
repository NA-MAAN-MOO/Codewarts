//@ts-nocheck
/* GraphQL queries */
import USERINFOQUERY from '../../graphql/userInfoQuery';
import axios from 'axios';

/* leetcode 유저 정보 가져오기 */
const fetchLeetUserData = async () => {
  if (leetUserNameRef.current === null) return;

  //@ts-ignore
  let leetUserName = leetUserNameRef.current.value;
  console.log(leetUserName);

  const userQueryVariable = {
    //@ts-ignore
    username: leetUserName,
  };

  try {
    const response = await axios.post(
      'https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql',
      {
        query: USERINFOQUERY,
        variables: userQueryVariable,
      }
    );

    let userData = response.data;
    console.log(userData.data);
    setLeetUserData(userData.data);
  } catch (error) {
    console.error(error);
  }
};

/* 백준 유저 정보 가져오기 */
const fetchBojUserData = async () => {
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
