import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import logo from 'assets/images/logo.png';
import logo_new from 'assets/images/logo_new.png';
import chars from 'assets/characters';
import loginFrame from '../assets/images/frame.png';
import { styledTheme } from 'styles/theme';
import {
  setPlayerBojId,
  setPlayerId,
  setPlayerLeetId,
  setPlayerTexture,
  setUserBgmState,
  setUserLoginId,
} from 'stores/userSlice';
// import { initialMyMute } from 'stores/chatSlice';
// import { fetchMuteInfo } from 'stores/chatSlice';
import { useDispatch } from 'react-redux';
import { handleScene } from 'lib/phaserLib';
import { GAME_STATUS } from 'utils/Constants';
import { Snackbar, SnackbarOrigin } from '@mui/material';
import SignUpForm from './SignUpForm';
import axios, { AxiosError } from 'axios';
import MySnackbar from './MySnackbar';
import { useAppDispatch } from 'stores';

import 'animate.css';
import { openGame } from 'stores/modeSlice';
import useVoice from 'hooks/useVoice';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';
const APPLICATION_VOICE_URL =
  process.env.REACT_APP_VOICE_URL || 'http://localhost:3002';

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
let randomNumber = Math.floor(Math.random() * 28);
const LoginDialog = () => {
  const [openLoginWarn, setOpenLoginWarn] = React.useState(false);
  const [loginFailMsg, setLoginFailMsg] = React.useState('');

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
    setLoginFailMsg('');
    setOpenLoginWarn(false);
  };

  const [userId, setUserId] = useState<string>('');
  const [idValid, setIdValid] = useState<boolean>(false);
  const [userIdFieldEmpty, setUserIdFieldEmpty] = useState<boolean>(false);
  const [userPw, setUserPw] = useState<string>('');
  const [pwValid, setPwValid] = useState<boolean>(false);
  const [userPwFieldEmpty, setUserPwFieldEmpty] = useState<boolean>(false);
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const { deleteMuteInfo } = useVoice();
  const [autoPlayOn, setAutoPlayOn] = useState(false);
  // let autoPlayOn = false;

  const autoPlay = () => {
    if (!autoPlayOn) {
      dispatch(setUserBgmState(true));
    }
    setAutoPlayOn(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userId === '') {
      setUserIdFieldEmpty(true);
      return;
    } else if (userId !== '' && userPw === '') {
      setUserPwFieldEmpty(true);
      setUserIdFieldEmpty(false);
      return;
    } else {
      //todo user info ??????
      const body = { userId: userId, userPw: userPw };
      try {
        const response = await axios.post(
          `${APPLICATION_DB_URL}/user/login`,
          body
        );
        if (response.data.status === 200) {
          // handleScene(GAME_STATUS.LOBBY);
          const { payload } = response.data; //userId, userNickname, userBojId, userLeetId
          //todo payload ??? ???????????? ????????????
          dispatch(openGame());
          dispatch(setPlayerId(payload.userNickname));
          dispatch(setPlayerBojId(payload.userBojId));
          dispatch(setPlayerLeetId(payload.userLeetId));
          dispatch(setPlayerTexture(avatars[avatarIndex].name));
          dispatch(setUserLoginId(userId));

          handleScene(GAME_STATUS.LOBBY, {
            playerId: payload.userNickname,
            playerTexture: avatars[avatarIndex].name,
          });
          // // ?????? ?????? ?????? ?????????????????? ??????
          // await deleteMuteInfo(payload.userNickname);
          // ??????????????? ??? ?????? ????????????
          // await appDispatch(fetchMuteInfo());

          // dispatch(initialMyMute(payload.userNickname));
        }
      } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 420) {
          setLoginFailMsg('?????? ????????? ???????????????.');
        } else {
          setLoginFailMsg('???????????? ??????????????? ?????? ????????? ?????????.');
        }
        handleClick();
        setUserId('');
        setUserPw('');
      }
    }
  };

  return (
    <Wrapper
      onFocus={autoPlay}
      className="animate__animated animate__fadeIn animate__delay-0.8s"
      style={{
        position: 'absolute',
        backgroundImage: `url(${loginFrame})`,
        backgroundSize: '100% 100%',
      }}
    >
      <MySnackbar
        text={loginFailMsg}
        state="warning"
        onClose={handleClose}
        onOpen={openLoginWarn}
      />
      <img
        src={logo_new}
        style={{
          width: styledTheme.logoWidth,
          height: styledTheme.logoHeight,
          userSelect: 'none',
        }}
      />
      {/* <RoomName>
        <Avatar
          style={{ background: getColorByString('roomName????????? ?????????') }}
        >
          {'CW'}
        </Avatar>
        <h3>{'My Room'}</h3>
      </RoomName> */}
      <Content onSubmit={handleSubmit} id="login">
        <Left>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(swiper) => {
              setAvatarIndex(swiper.activeIndex);
            }}
            initialSlide={randomNumber}
          >
            {avatars.map((avatar) => (
              <SwiperSlide key={avatar.name}>
                <img
                  style={{
                    scale: '4.5',
                    left: '20%',
                    clipPath: 'inset(0px 36px 102px 39px)',
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
          <div style={{ height: '20px' }}></div>
          <TextField
            fullWidth
            label="ID"
            variant="outlined"
            error={userIdFieldEmpty}
            helperText={userIdFieldEmpty && 'ID??? ????????? ?????????.'}
            value={userId}
            // margin="dense"
            onInput={(e) => {
              setUserId((e.target as HTMLInputElement).value);
            }}
            sx={{ fontFamily: styledTheme.mainFont }}
          />
          <div style={{ height: '20px' }}></div>
          <TextField
            fullWidth
            type="password"
            label="PASSWORD"
            variant="outlined"
            value={userPw}
            margin="dense"
            error={userPwFieldEmpty}
            helperText={userPwFieldEmpty && 'Password??? ????????? ?????????.'}
            onInput={(e) => {
              setUserPw((e.target as HTMLInputElement).value);
            }}
            sx={{ fontFamily: styledTheme.mainFont }}
          />
          <div style={{ height: '20px' }}></div>
          <Bottom>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              form="login"
              sx={{ fontFamily: styledTheme.mainFont, marginBottom: '10px' }}
            >
              ????????????
            </Button>
            <SignUpForm />
          </Bottom>
        </Right>
      </Content>
    </Wrapper>
  );
};

export default LoginDialog;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 16px;
  padding: 36px 60px;
  // box-shadow: 0px 0px 5px #0000006f;
  img {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
  }
`;

const Content = styled.form`
  display: flex;
  margin: 36px 0;
`;

const Left = styled.div`
  margin-right: 48px;
  margin-top: -8px;

  --swiper-navigation-size: 24px;

  .swiper {
    width: 160px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
  }

  .swiper-slide {
    width: 160px;
    height: 215px;
    // background: ${({ theme }) => theme.lighterBlue};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 97px;
    height: 136px;
    object-fit: contain;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
`;

const Right = styled.div`
  width: 300px;
  display: block;
  align-items: center;
  // padding-top: 50px;
`;

const Bottom = styled.div`
  // display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
