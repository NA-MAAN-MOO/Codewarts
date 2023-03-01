import CharRoundLogo from 'components/CharRoundLogo';
import styled from 'styled-components';
import svgs from 'assets/solvedac_badges/index';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';

const BadgeLogo = (props: {
  charName: string;
  isSpecial: boolean;
  name: string;
}) => {
  const { name } = props;
  const rankInfos = useSelector((state: RootState) => state.rank.infos);

  const myTier = rankInfos?.find((d) => d.nickname === name)?.tier || '';
  const SvgComponent = myTier ? svgs[`Svg${myTier}`] : svgs.Svg0;
  return (
    <Wrapper>
      <CharRoundLogo {...props}></CharRoundLogo>
      <BadgeWrapper>{/* <SvgComponent width="18px" /> */}</BadgeWrapper>
    </Wrapper>
  );
};

export default BadgeLogo;

const Wrapper = styled.div`
  position: relative;
`;

const BadgeWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
`;
