import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#B0C4DE',
      light: '#4682B4',
    },
    secondary: {
      main: '#B0E0E6',
    },
  },
});

export const styledTheme = {
  logoWidth: '100px',
  logoHeight: '100px',
  mainBlue: '#B0C4DE',
  lightBlue: '#B0E0E6',
  darkBlue: '#4682B4',
  lighterBlue: '#F0F8FF',
  mainFont: 'Firenze',
};

export default muiTheme;
