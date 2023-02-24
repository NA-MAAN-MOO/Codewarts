import { ReactNode } from 'react';
import styled from 'styled-components';

const GlassButton = ({ children }: { children: ReactNode }) => {
  return <GlassBtn>{children}</GlassBtn>;
};

export default GlassButton;

const GlassBtn = styled.div`
  position: relative;
  display: inline-block;
  padding: 10px 10px;
  background-color: ${({ theme }) =>
    theme.mainRed}; /*for compatibility with older browsers*/
  background-image: linear-gradient(
    ${({ theme }) => theme.darkRed},
    ${({ theme }) => theme.mainRed}
  );
  overflow: hidden;
  border-radius: 50%;
  /* text styles */
  text-decoration: none;
  color: #fff;
  font-size: 25px;
  font-family: sans-serif;
  font-weight: 100;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 4px);
    height: 50%;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.2)
    );
  }
  &:hover {
    background-image: linear-gradient(#dc143c, #f08080);
  }
  &:hover > &:before {
    opacity: 1;
  }
`;
