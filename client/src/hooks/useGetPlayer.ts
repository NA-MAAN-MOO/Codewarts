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

  const getPlayer = async () => {
    if (status === GAME_STATUS.GAME) {
      const { data } = await axios.get('http://localhost:3002/get-connection', {
        params: { sessionId: GAME_STATUS.GAME },
      });
      dispatch(setUsers(data.content));
    } else {
      //에디터일 때
    }
  };

  return { getPlayer };
};
