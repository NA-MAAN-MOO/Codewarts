import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'stores';
import Audio from 'components/Audio';
import { Subscriber } from 'openvidu-browser';

const AudioList = ({ subscribers }: { subscribers: Subscriber[] }) => {
  const { playerId } = useSelector((state: RootState) => {
    return state.user;
  });
  return (
    <>
      {subscribers.map((sub, i) => {
        const { user } = JSON.parse(sub.stream.connection.data);
        return (
          user !== playerId && (
            <div key={user} style={{ display: 'hidden' }}>
              <Audio streamManager={sub} />
            </div>
          )
        );
      })}
    </>
  );
};
export default AudioList;
