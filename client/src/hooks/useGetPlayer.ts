import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'stores';
import { GAME_STATUS } from 'utils/Constants';
import axios from 'axios';

export default () => {
  const dispatch = useDispatch();
  const { status, roomId } = useSelector((state: RootState) => {
    return { ...state.mode, ...state.editor };
  });

  const [result, setResult] = useState('');

  useEffect(() => {
    (async () => {
      await getPlayer();
    })();
  }, []);

  const getPlayer = async () => {
    if (status === GAME_STATUS.GAME) {
      const { data } = await axios.get('http://localhost:3002/get-connection', {
        params: { sessionId: GAME_STATUS.GAME },
      });
      setResult(data.content);
    } else {
      //에디터일 때
    }
  };

  return result;
};
