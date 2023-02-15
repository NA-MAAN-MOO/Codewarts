import styled from 'styled-components';
import LoginDialog from './LoginDialog';

const Start = () => {
  return (
    <StartDiv>
      <LoginDialog />
    </StartDiv>
  );
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
