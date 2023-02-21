import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores';
import { GAME_STATUS } from 'utils/Constants';
import axios from 'axios';
import { setUsers } from 'stores/chatSlice';

export default () => {
  const dispatch = useDispatch();
  const { status, roomId } = useSelector((state: RootState) => {
    return { ...state.mode, ...state.editor };
  });

  const getConnections = async () => {
    if (status === GAME_STATUS.GAME) {
      const { data } = await axios.get(
        'http://localhost:3002/get-connections',
        {
          params: { sessionId: GAME_STATUS.GAME },
        }
      );
      dispatch(setUsers(data));
    } else {
      //에디터일 때
    }
    console.log('getConnections 끝');
  };
  const getSessions = async () => {
    const { data } = await axios.get('http://localhost:3002/get-sessions', {});
    console.log(data);
  };

  return { getConnections, getSessions };
};
