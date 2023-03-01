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
    info: {
      main: '#272822',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#272822',
    },
    secondary: {
      main: '#FFFFFF',
    },
    info: {
      main: '#FFFFFF',
    },
  },
});

export const styledTheme = {
  logoWidth: '210px',
  logoHeight: '130px',
  mainBlue: '#B0C4DE',
  lightBlue: '#B0E0E6',
  darkBlue: '#4682B4',
  mainRed: '#A52A2A',
  darkRed: '#800000',
  lightRed: '#DC143C',
  lightYellow: '#F5DEB3',
  lighterBlue: '#F0F8FF',
  mainFont: 'Firenze',
  smallIconSize: '23px',
  normalIconSize: '32px',
};

export default muiTheme;
