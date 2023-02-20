import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import logo from 'assets/images/logo.png';
import chars from 'assets/characters';
import { styledTheme } from 'styles/theme';
import { setPlayerId, setPlayerTexture } from '../stores/userSlice';
import { useDispatch } from 'react-redux';
import { handleScene } from 'lib/phaserLib';
import { GAME_STATUS } from 'utils/Constants';
import { Snackbar, SnackbarOrigin } from '@mui/material';
import SignUpForm from './SignUpForm';

interface Characters {
  [key: string]: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={10} ref={ref} variant="filled" {...props} />;
});

export interface State extends SnackbarOrigin {
  openLoginWarn: boolean;
}

const characters = chars as Characters;

const avatars: { name: string; img: string }[] = Array.from(
  new Array(28),
  (d, idx) => ({ name: `char${idx}`, img: characters[`char${idx}`] })
);

const LoginDialog = () => {
  const [openLoginWarn, setOpenLoginWarn] = React.useState(false);
  const [openSignUp, setOpenSignUp] = React.useState(false);

  const handleClick = () => {
    setOpenLoginWarn(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenLoginWarn(false);
  };

  const [userId, setUserId] = useState<string>('');
  const [idValid, setIdValid] = useState<boolean>(true);
  const [userIdFieldEmpty, setUserIdFieldEmpty] = useState<boolean>(false);
  const [userPw, setUserPw] = useState<string>('');
  const [pwValid, setPwValid] = useState<boolean>(false);
  const [userPwFieldEmpty, setUserPwFieldEmpty] = useState<boolean>(false);
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userId === '') {
      setUserIdFieldEmpty(true);
    } else if (userId !== '' && userPw === '') {
      setUserPwFieldEmpty(true);
      setUserIdFieldEmpty(false);
      // } else if (!pwValid || !idValid) {  나중에 실제로 db연결하면 활성화
      //   handleClick();
      //   // console.log('fdas?', open);  onclose 때문에 꺼지면서 false로..
    } else {
      console.log('Join! Name:', userId, 'Avatar:', avatars[avatarIndex].name);

      dispatch(setPlayerId(userId));
      dispatch(setPlayerTexture(avatars[avatarIndex].name));
      handleScene(GAME_STATUS.LOBBY);

      // game.myPlayer.setPlayerTexture(avatars[avatarIndex].name);
      // game.network.readyToConnect();
      // dispatch(setLoggedIn(true));
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Snackbar
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openLoginWarn}
        onClose={handleClose}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          아이디와 비밀번호를 다시 확인해 주세요
        </Alert>
      </Snackbar>
      <img
        src={logo}
        style={{ width: styledTheme.logoWidth, height: styledTheme.logoHeight }}
      />
      {/* <RoomName>
        <Avatar
          style={{ background: getColorByString('roomName와야함 나중에') }}
        >
          {'CW'}
        </Avatar>
        <h3>{'My Room'}</h3>
      </RoomName> */}
      <Content>
        <Left>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(swiper) => {
              setAvatarIndex(swiper.activeIndex);
            }}
          >
            {avatars.map((avatar) => (
              <SwiperSlide key={avatar.name}>
                <img
                  style={{
                    scale: '4.5',
                    left: '20%',
                    clipPath: 'inset(0px 36px 102px 40px)',
                    top: '120%',
                    position: 'absolute',
                  }}
                  src={avatar.img}
                  alt={avatar.name}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Left>
        <Right>
          <TextField
            fullWidth
            label="ID"
            variant="outlined"
            error={userIdFieldEmpty}
            helperText={userIdFieldEmpty && 'ID를 입력해 주세요.'}
            onInput={(e) => {
              setUserId((e.target as HTMLInputElement).value);
            }}
            sx={{ fontFamily: styledTheme.mainFont }}
          />
          <div style={{ height: '15px' }}></div>
          <TextField
            fullWidth
            label="PASSWORD"
            variant="outlined"
            error={userPwFieldEmpty}
            helperText={userPwFieldEmpty && 'Password를 입력해 주세요.'}
            onInput={(e) => {
              setUserPw((e.target as HTMLInputElement).value);
            }}
            sx={{ fontFamily: styledTheme.mainFont }}
          />
          <div style={{ height: '30px' }}></div>
          <Button
            style={{ left: '200px' }}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{ fontFamily: styledTheme.mainFont }}
          >
            시작하기
          </Button>
        </Right>
      </Content>
      <Bottom>
        <SignUpForm />
      </Bottom>
    </Wrapper>
  );
};

export default LoginDialog;

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`;

const Content = styled.div`
  display: flex;
  margin: 36px 0;
`;

const Left = styled.div`
  margin-right: 48px;

  --swiper-navigation-size: 24px;

  .swiper {
    width: 160px;
    height: 220px;
    border-radius: 8px;
    overflow: hidden;
  }

  .swiper-slide {
    width: 160px;
    height: 220px;
    background: ${({ theme }) => theme.lighterBlue};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 95px;
    height: 136px;
    object-fit: contain;
  }
`;

const Right = styled.div`
  width: 300px;
  display: block;
  align-items: center;
  // padding-top: 50px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
