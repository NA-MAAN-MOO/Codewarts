import { ReactNode } from 'react';
import styled from 'styled-components';

const PixelButton = ({ children }: { children: ReactNode }) => {
  return <PixelBtn>{children}</PixelBtn>;
};

export default PixelButton;

const PixelBtn = styled.div`
  font-size: 1.2em;
  font-family: 'Press Start 2P', cursive;
  width: 200px;
  height: 70px;
  background: #06c1de;
  border: 0px;
  position: relative;
  box-shadow: inset -4px 2px 1px 1px grey, inset -4px -2px 1px 1px lightgray,
    inset 4px 0px 1px 1px lightgray;

  &:hover {
    cursor: pointer;
    background-color: #06b6d1;
  }

  &:active {
    top: 5px;
    box-shadow: -4px 2px 1px 1px grey, -4px -2px 1px 1px lightgray,
      4px 0px 1px 1px lightgray;
  }

  &::after {
    content: '';
    background: black;
    position: absolute;
    left: -2.5%;
    top: 0;
    width: 105%;
    height: 100%;
    z-index: -1;
  }

  &::before {
    content: '';
    background: black;
    position: absolute;
    left: 0;
    top: -5%;
    width: 100%;
    height: 113%;
    z-index: -1;
  }
`;
