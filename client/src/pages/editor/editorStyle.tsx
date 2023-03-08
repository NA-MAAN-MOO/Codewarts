import styledc from 'styled-components';
import { styled, alpha, createTheme, useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

/* MUI button color theme setting */
const buttonTheme = createTheme({
  palette: {
    primary: {
      // main: '#eeba30', // 그리핀도르 찐노랑
      main: '#ffefd5', // papayawhip
      // main: '#272822', // 에디터 검정
      // main: '#ba835e', // 갈색
    },
    secondary: {
      main: '#ffefd5', // papayawhip
      // main: '#FD971F', // 주황
      // main: '#272822', // 에디터 검정
      // main: '#11cb5f',
    },
    error: {
      main: '#ae0001', // 그리핀도르 찐빨강
    },
  },
});

const editorThemeCSS = {
  '&': {
    borderRadius: '.5em', // '.cm-gutters'와 같이 조절할 것
    // height: '400px',
    // maxHeight: '400px',
    // minHeight: '400px',
    height: '50vh',
  },
  '.cm-editor': {
    // maxHeight: '50%',
    // height: '100%',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '.cm-content, .cm-gutter': {
    fontFamily: 'Cascadia Code, Pretendard-Regular',
    // height: 'auto',
    // minHeight: `${400 * 50}%`,
  },
  '.cm-content': {
    fontSize: '1.7em',
  },
  '.cm-gutter': {
    // minHeight: '50%',
  },
  '.cm-gutters': {
    borderRadius: '.5em',
  },
};

const EditorWrapper = styledc.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // padding: 0 0 0 0;
  font-family: 'Cascadia Code', 'Pretendard-Regular';
  // border: 1px solid red;
  overflow: auto;
  `;

const EditorInfo = styledc.div`
font-family: 'Firenze';
// color: rgba(255, 255, 255, 0.7);
font-size: 40px; 
font-weight: 600; 
// margin-top: 3%;
text-align: center;
// filter: drop-shadow(0px 4px 4px rgba(255, 255, 255, 0.5));
`;

const AlgoInfoWrap = styledc.div`
overflow: auto;
// border: 1px solid yellow;
`;

const HeaderTab = styledc.div`
// display: flex;
// justify-content: space-between;
width: 100%;
color: papayawhip;
// border: 1px solid green;
flex-grow: 1;
`;

const AlgoInputWrap = styledc.div`
// margin-top: 10px;
display: flex;
justify-content: center;
align-items: center;
// margin-left: 5px;
// border: 1px solid red;
width: 100%
`;

const ProbTitleDiv = styledc.div`
text-shadow: 1px 1px 2px grey;
color: #fff;
font-size: 1.9rem;
width: 100%;
display: flex;
flex-direction : row;
align-items: center;
overflow: visible;
min-height: 100%;
display: flex,
justify-content: space-between,
text-align: center;
// border: 1px solid lightgreen;
padding: 16px;
`;

const AlgoInput = styledc.input`
  font-size: 18px;
  padding: 10px;
  margin: 10px;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

/* text field theme setting */
//@ts-ignore
const AlgoTextField = styled((props: TextFieldProps) => (
  <TextField
    //@ts-ignore
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  '& label': {
    textShadow: '1px 1px 2px #ededed',
    fontFamily: 'Cascadia Code, Pretendard-Regular',
  },
  '& input': {
    fontFamily: 'Cascadia Code, Pretendard-Regular',
    // color: 'papayawhip',
  },
  // '문제 번호로 바로가기' 라벨
  '.MuiFormLabel-root': {
    fontSize: '1.1rem',
    marginTop: '-2.5px',
  },
  '& .MuiInputBase-sizeSmall': {
    // margin: '10px 10px 10px 10px',
  },
  '& textarea': {
    fontFamily: 'Cascadia Code, Pretendard-Regular',
    color: 'papayawhip',
  },
  // 컴파일칸 라벨
  '& .css-1pv68re-MuiFormLabel-root-MuiInputLabel-root': {
    fontSize: '1.5rem',
  },

  // 컴파일 output칸 input 필드
  '& .MuiInputBase-readOnly': {
    color: 'papayawhip',
  },
  '& label.Mui-focused': {
    color: 'papayawhip',
    textShadow: '2px 2px 2px gray',
  },
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    // backgroundColor: theme.palette.mode === 'light' ? 'papayawhip' : '#2b2b2b',
    backgroundColor: theme.palette.mode === 'light' ? 'papayawhip' : 'grey',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'papayawhip',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      // color: 'papayawhip',
      color: '#fff',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      border: 0,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ProfileInfo = styledc.div`
  margin-left: 20px;
  martgin-top: 10px;
  font-size: 20px;
`;

/* Paper element theme setting */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#272822' : '#272822',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const MiddleWrapper = styledc.div`
  martgin-top: 10px;
  font-size: 20px;
  text-align: right;
  // font-family: 'Cascadia Code', 'Pretendard-Regular';

  color: papayawhip;
`;

/* 다크/라이트 토글 스위치 테마 */
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  // 토글 막대기 부분
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 0,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          'papayawhip'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#272822',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        'papayawhip'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#272822',
    borderRadius: 20 / 2,
  },
}));

/* 왼쪽 서랍 문제 아코디언 */
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  backgroundColor: '#272822',
  // color: '#fff',
  color: 'papayawhip',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

/* 왼쪽 서랍 아코디언 소제목 */
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}
      />
    }
    sx={{ fontSize: '1.5rem' }}
    {...props}
  />
))(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  backgroundColor: '#272822',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

/* 왼쪽 서랍 아코디언 내용 */
const accordionDetailStyle = {
  fontSize: '1.3rem',
};

/* 왼쪽 서랍 아코디언 예제 제목*/
const accordionSampleTitle = {
  color: 'rgba(255, 255, 255, 0.7)',
  marginRight: '7px',
};

/* 왼쪽 서랍 아코디언 예제 내용 */
const accordionSampleStyle = {
  color: 'papayawhip',
  fontFamily: 'Cascadia Code, Pretendard-Regular',
  textAlign: 'left',
  fontSize: '1.2em',
};

const accoSampleTitleStyle = {
  display: 'flex',
  alignItems: 'center',
};

/* Drawer setting */
const leftDrawerWidth = 40;

const leftDrawerCSS = {
  width: leftDrawerWidth,
  flexShrink: 0,
  // border: '1px solid green',
  '& .MuiDrawer-paper': {
    width: leftDrawerWidth,
    boxSizing: 'border-box',
  },
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexDirection: 'column',
  flexGrow: 1,
  // padding: theme.spacing(2),
  // border: '1px solid purple', // for debugging
  height: '100%',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${leftDrawerWidth}%`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${leftDrawerWidth}%)`,
    marginLeft: `${leftDrawerWidth}%`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  // border: '1px solid purple', //for debugging
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  alignItems: 'center',
  // minHeight: '100%',
}));

const middleButtonStyle = {
  // fontFamily: 'Cascadia Code, Pretendard-Regular',
  fontFamily: 'Firenze, Pretendard-Regular',
  fontSize: '1.5rem',
  boxShadow: 'inset 0.2em 0.2em #ededed',
  marginRight: '5px',
  marginLeft: '5px',
  marginBottom: '5px',
};

export {
  HeaderTab,
  AlgoInput,
  AlgoInputWrap,
  AlgoTextField,
  ProbTitleDiv,
  ProfileInfo,
  Item,
  MiddleWrapper,
  EditorWrapper,
  EditorInfo,
  AlgoInfoWrap,
  MaterialUISwitch,
  AccordionSummary,
  Accordion,
  accordionDetailStyle,
  accordionSampleStyle,
  accordionSampleTitle,
  accoSampleTitleStyle,
  buttonTheme,
  Main,
  AppBar,
  DrawerHeader,
  leftDrawerWidth,
  leftDrawerCSS,
  middleButtonStyle,
  editorThemeCSS,
};
