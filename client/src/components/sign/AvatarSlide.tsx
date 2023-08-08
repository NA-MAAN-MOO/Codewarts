import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useSignContext } from 'hooks/useSignContext';

let randomNumber = Math.floor(Math.random() * 28);

const AvatarSlide = () => {
  const { avatars, handleAvatarIndex } = useSignContext();
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={0}
      slidesPerView={1}
      onSlideChange={(swiper) => {
        handleAvatarIndex(swiper.activeIndex);
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
  );
};

export default AvatarSlide;
