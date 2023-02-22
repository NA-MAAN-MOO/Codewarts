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
  width: 30px;
  display: inline-block;
  justify-content: center;
  margin: 0 10px 0 0;
  // flex-direction: column;
  // gap: 50px;
`;
