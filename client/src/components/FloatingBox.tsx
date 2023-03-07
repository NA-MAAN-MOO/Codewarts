import { ReactNode } from 'react';
import styled from 'styled-components';

const FloatingBox = ({ children }: { children: ReactNode }) => {
  return <FloatingDiv>{children}</FloatingDiv>;
};

export default FloatingBox;

const FloatingDiv = styled.div`
  float: left;
  transition-duration: 0.2s;
  box-shadow: 3px 3px 3px #696969;
  background-color: ${({ theme }) => theme.mainRed};
  padding: 1rem;
  border-radius: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 2rem;
  border: 3px ridge ${({ theme }) => theme.lightRed};
  color: white;
  font-family: ${({ theme }) => theme.mainFont};
  position: absolute;
  bottom: 2%;
  left: calc(75px + 1%);
`;
