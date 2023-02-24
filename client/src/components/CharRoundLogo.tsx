import styled from 'styled-components';
import characters from 'assets/characters';

const CharRoundLogo = ({ charName }: { charName: string }) => {
  const charUrl = characters[charName];
  return (
    <CuttedWrapper>
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
const CuttedWrapper = styled.div`
  border: 3px inset ${({ theme }) => theme.mainRed};
  width: 50px;
  border-radius: 100%;
  height: 50px;
  // overflow: hidden;
`;
