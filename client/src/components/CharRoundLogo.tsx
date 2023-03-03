import styled from 'styled-components';
import characters from 'assets/characters';
import { Theme, useTheme } from '@mui/material';

interface CuttedWrapperProps {
  isSpecial: boolean;
  muiTheme: Theme;
}

const CharRoundLogo = ({
  charName,
  isSpecial = false,
}: {
  charName: string;
  isSpecial: boolean;
  name: string;
}) => {
  const muiTheme = useTheme();
  const charUrl = characters[charName];
  return (
    <CuttedWrapper isSpecial={isSpecial} muiTheme={muiTheme}>
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
  border: ${({ theme, isSpecial, muiTheme }) =>
    isSpecial
      ? `3px inset ${theme.lightRed}`
      : `3px inset ${muiTheme.palette.info.main}`};
  width: 50px;
  height: 50px;
  border-radius: 100%;
  overflow: hidden;
`;
