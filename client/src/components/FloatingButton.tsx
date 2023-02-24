import { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import muiStyled from '@emotion/styled';
import { styledTheme } from 'styles/theme';

const FloatingButton = ({ ...props }) => {
  return (
    <Button
      color="secondary"
      variant="contained"
      sx={{
        border: `3px ridge ${styledTheme.lightRed}`,
        fontFamily: `${styledTheme.mainFont}`,
        borderRadius: '3.75rem',
        padding: '1rem',
        float: 'left',
        transitionDuration: '0.2s',
        boxShadow: '3px 3px 3px #696969',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '3rem',
      }}
      {...props}
    ></Button>
  );
};

export default FloatingButton;

// const StyledBtn = styled(Button)(({ theme }) => ({
//   border: `3px ridge ${styledTheme.lightRed}`,
//   fontFamily: `${styledTheme.mainFont}`,
//   borderRadius: '3.75rem',
//   padding: '1rem',
//   float: 'left',
//   transitionDuration: '0.2s',
//   boxShadow: '3px 3px 3px #696969',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   gap: '1rem',
//   minHeight: '3rem',
//   '&:active': {
//     marginLeft: '5px',
//     marginTop: '5px',
//     boxShadow: 'none',
//   },
// }));

// const FloatingBtn = styled.button`
//   border: none;
//   font-family: ${({ theme }) => theme.mainFont};
//   color: white;
//   float: left;
//   transition-duration: 0.2s;
//   box-shadow: 3px 3px 3px #696969;
//   background-color: ${({ theme }) => theme.mainRed};
//   padding: 1rem;
//   border-radius: 3.75rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 1rem;
//   min-height: 3rem;
//   &:active {
//     margin-left: 5px;
//     margin-top: 5px;
//     box-shadow: none;
//   }
//   border: 3px ridge ${({ theme }) => theme.lightRed};
// `;
