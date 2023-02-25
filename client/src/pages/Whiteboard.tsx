import axios from 'axios';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { openGame } from 'stores/modeSlice';
import store from 'stores';

function Whiteboard() {
  let [bojInfos, setbojInfos] = useState<any[]>([]);

  const getBojInfos = async () => {
    try {
      //TODO: URI 포트 확인
      const response = await axios.get(`http://localhost:3003/boj-infos`);
      setbojInfos(response.data);
      console.log(bojInfos);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBack = async () => {
    //FIXME: 화이트보드에 있는 내용 지우거나 redis에 저장해서 불러오기
    store.dispatch(openGame());
  };

  return (
    <>
      <Background>
        <div>
          백준 랭킹 🔥 <button onClick={getBojInfos}>새로고침</button>
        </div>
        {bojInfos?.map((info: any) => (
          <div>
            {info.id} {info.nickname} {info.tier} {info.bojId} {info.rating}
            {info.maxStreak}
          </div>
        ))}
        <button onClick={handleBack}>돌아가기</button>
      </Background>
    </>
  );
}

export default Whiteboard;

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
`;

// nickname: data.userNickname,
//           id: data.userId,
//           bojId: data.userBojId,
//           tier: eachData.tier,
//           rating: eachData.rating,
//           maxStreak: eachData.maxStreak,
