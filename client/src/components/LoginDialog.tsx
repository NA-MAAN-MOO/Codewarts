import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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

interface Characters {
  [key: string]: string;
}

const characters = chars as Characters;

const avatars: { name: string; img: string }[] = Array.from(
  new Array(28),
  (d, idx) => ({ name: `char${idx}`, img: characters[`char${idx}`] })
);
let randomNumber = Math.floor(Math.random() * 28);
const LoginDialog = () => {
  const [name, setName] = useState<string>('');
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const [nameFieldEmpty, setNameFieldEmpty] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name === '') {
      setNameFieldEmpty(true);
    } else {
      console.log('Join! Name:', name, 'Avatar:', avatars[avatarIndex].name);

      dispatch(setPlayerId(name));
      dispatch(setPlayerTexture(avatars[avatarIndex].name));
      handleScene(GAME_STATUS.LOBBY);

      // game.myPlayer.setPlayerTexture(avatars[avatarIndex].name);
      // game.network.readyToConnect();
      // dispatch(setLoggedIn(true));
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
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
          <TextField
            autoFocus
            fullWidth
            label="이름 입력"
            variant="outlined"
            error={nameFieldEmpty}
            helperText={nameFieldEmpty && '이름을 입력해 주세요.'}
            onInput={(e) => {
              setName((e.target as HTMLInputElement).value);
            }}
            sx={{ fontFamily: styledTheme.mainFont }}
          />
        </Right>
      </Content>
      <Bottom>
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          sx={{ fontFamily: styledTheme.mainFont }}
        >
          시작하기
        </Button>
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
  display: flex;
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
