import { ReactNode } from 'react';
import styled from 'styled-components';

const JellyButton = ({ children }: { children: ReactNode }) => {
  return (
    <BtnWrapper>
      <BtnInnerWrapper>{children}</BtnInnerWrapper>
    </BtnWrapper>
  );
};

export default JellyButton;

const BtnWrapper = styled.div`
	padding: 1rem 2.5rem;
	border-radius: 3.75rem;
	line-height: 2.5rem;
	font-size: 2rem;
	
	border: 1px solid #8B0000;
	background-image: linear-gradient(-180deg, #DC143C 0%, #CD5C5C 100%);
	box-shadow: 0 1rem 1.25rem 0 	#F08080,
							0 -0.25rem 1.5rem 	#A52A2A inset,
							0 0.75rem 0.5rem rgba(255,255,255, 0.4) inset,
							0 0.25rem 0.5rem 0 #DC143C inset;

&::before {
	content: "";
	display: block;
	height: 0.15rem;
	position: absolute;
	top: 0.5rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 3.5rem);
	background: #fff;
	border-radius: 100%;
	
	opacity: 0.7;
	background-image: linear-gradient(-270deg, rgba(255,255,255,0.00) 0%, #FFFFFF 20%, #FFFFFF 80%, rgba(255,255,255,0.00) 100%);
}

&::after {
	content: "";
	display: block;
	height: 0.15rem;
	position: absolute;
	bottom: 0.75rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 3.5rem);
	background: #fff;
	border-radius: 100%;
	
	filter: blur(1px);
	opacity: 0.05;
	background-image: linear-gradient(-270deg, rgba(255,255,255,0.00) 0%, #FFFFFF 20%, #FFFFFF 80%, rgba(255,255,255,0.00) 100%);
`;

const BtnInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: transparent;
  background-image: linear-gradient(0deg, #f08080 0%, #fefafd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 2px 2px #cd5c5c);
  & {
    cursor: pointer;
  }
`;
