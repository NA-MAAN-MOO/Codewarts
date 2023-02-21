import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores';
import { GAME_STATUS } from 'utils/Constants';
import axios from 'axios';
import { setUsers } from 'stores/chatSlice';
import { Connection } from 'types';

export default () => {
  const dispatch = useDispatch();
  const { status, roomId } = useSelector((state: RootState) => {
    return { ...state.mode, ...state.editor };
  });

  const getConnections = async (sessionId: string) => {
    try {
      if (status === GAME_STATUS.GAME) {
        const { data }: { data: Connection[] } = await axios.get(
          'http://localhost:3002/get-connections',
          {
            params: { sessionId: GAME_STATUS.GAME },
          }
        );
        dispatch(setUsers(data));
        return data;
      } else {
        //에디터일 때
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  };
  const getSessions = async () => {
    const { data } = await axios.get('http://localhost:3002/get-sessions', {});
    console.log(data);
  };

  const getUsers = async (sessionId: string) => {
    const users = (await getConnections(sessionId)) || [];
    const charInfos = await Promise.all(
      users.map(async (user, index) => {
        const name = JSON.parse(user.clientData).user;
        const { data: char } = await axios.get(
          `http://localhost:3003/user/get-char/${name}`
        );
        return { name, char };
      })
    );
    dispatch(setUsers(charInfos));
  };

  return { getConnections, getSessions, getUsers };
};
