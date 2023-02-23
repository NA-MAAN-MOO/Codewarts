import { ReactNode } from 'react';
import styled from 'styled-components';

const FloatingButton = ({ ...props }) => {
  return <FloatingBtn {...props}></FloatingBtn>;
};

export default FloatingButton;

const FloatingBtn = styled.button`
  border: none;
  font-family: ${({ theme }) => theme.mainFont};
  color: white;
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
  min-height: 3rem;
  &:active {
    margin-left: 5px;
    margin-top: 5px;
    box-shadow: none;
  }
`;
