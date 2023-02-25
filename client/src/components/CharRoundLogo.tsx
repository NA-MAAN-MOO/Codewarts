import styled from 'styled-components';
import characters from 'assets/characters';

interface CuttedWrapperProps {
  isSpecial: boolean;
}

const CharRoundLogo = ({
  charName,
  isSpecial = false,
}: {
  charName: string;
  isSpecial: boolean;
}) => {
  const charUrl = characters[charName];
  return (
    <CuttedWrapper isSpecial={isSpecial}>
      <StyledImg src={charUrl} />;
    </CuttedWrapper>
  );
};

export default CharRoundLogo;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-position: center 15px;
  object-fit: cover; /* to make sure the image fills the container */
  scale: 2.5;
`;
const CuttedWrapper = styled.div<CuttedWrapperProps>`
  border: ${({ theme, isSpecial }) =>
    isSpecial ? '3px inset #FFA500' : `3px inset ${theme.mainRed}`};
  width: 50px;
  border-radius: 100%;
  height: 50px;
  overflow: hidden;
`;
