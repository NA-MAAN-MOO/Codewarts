import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#B0C4DE',
      dark: '#4682B4',
      light: '#B0E0E6',
    },
    secondary: {
      main: '#A52A2A',
      dark: '#800000',
      light: '#F5DEB3',
    },
  },
});

export const styledTheme = {
  logoWidth: '100px',
  logoHeight: '130px',
  mainBlue: '#B0C4DE',
  lightBlue: '#B0E0E6',
  darkBlue: '#4682B4',
  lighterBlue: '#F0F8FF',
  mainFont: 'Firenze',
};

export default muiTheme;
