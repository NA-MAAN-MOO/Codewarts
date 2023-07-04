import styled from 'styled-components';
import LoginDialog from './sign/LoginDialog';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import { GAME_STATUS } from 'utils/Constants';

const Start = () => {
  const { START, LOGIN } = GAME_STATUS;
  const { status } = useSelector((state: RootState) => {
    return { ...state.mode };
  });
  return <StartDiv>{status === LOGIN ? <LoginDialog /> : <></>}</StartDiv>;
};

export default Start;

const StartDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 50px;
`;
