//@ts-nocheck
import styled from 'styled-components';
import svgs from 'assets/solvedac_badges/index';

const Tier: any = {
  1: '브론즈 5',
  2: '브론즈 4',
  3: '브론즈 3',
  4: '브론즈 2',
  5: '브론즈 1',
  6: '실버 5',
  7: '실버 4',
  8: '실버 3',
  9: '실버 2',
  10: '실버 1',
  11: '골드 5',
  12: '골드 4',
  13: '골드 3',
  14: '골드 2',
  15: '골드 1',
  16: '플래티넘 5',
  17: '플래티넘 4',
  18: '플래티넘 3',
  19: '플래티넘 2',
  20: '플래티넘 1',
  21: '다이아 5',
  22: '다이아 4',
  23: '다이아 3',
  24: '다이아 2',
  25: '다이아 1',
  26: '루비 5',
  27: '루비 4',
  28: '루비 3',
  29: '루비 2',
  30: '루비 1',
  31: '마스터',
};

function RenderTier(props: any) {
  const { svgName } = props;
  const SvgComponent = svgs[`Svg${svgName}`];

  return (
    <>
      <RenderSvgDiv>
        <SvgComponent width="13px" />
        &nbsp;<span>{Tier[`${svgName}`]}</span>
      </RenderSvgDiv>
    </>
  );
}

export default RenderTier;

const RenderSvgDiv = styled.span`
  // width: 12px;
  display: flex;
  // justify-content: center;
  // margin-top: 10px;
  // flex-direction: column;
  // gap: 50px;
`;
