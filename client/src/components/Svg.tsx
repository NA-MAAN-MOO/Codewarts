//@ts-nocheck
import styled from 'styled-components';
import svgs from 'assets/solvedac_badges/index';

function RenderSvg({ svgName }) {
  const SvgComponent = svgs[`Svg${svgName}`];
  return (
    <RenderSvgDiv>
      <SvgComponent />
    </RenderSvgDiv>
  );
}

export default RenderSvg;

const RenderSvgDiv = styled.span`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  // flex-direction: column;
  // gap: 50px;
`;
