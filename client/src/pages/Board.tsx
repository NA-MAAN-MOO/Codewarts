import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './styles/board.css';
import styled from 'styled-components';
import { CirclePicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const APPLICATION_BOARD_URL =
  process.env.REACT_APP_SERVER_URL || 'http://localhost:3004';

const Board = (props: any) => {
  const { handleSocket } = props;
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef: any = useRef();

  useEffect(() => {
    // getContext() method returns a drawing context on the canvas

    const canvas: any = canvasRef.current;
    const test = colorsRef.current;
    const context = canvas.getContext('2d');

    // Colors
    const colors = document.getElementsByClassName('color');
    console.log(colors, 'the colors');
    console.log(test);
    // set the current color
    const current = {
      color: '#eeeeee',
      x: 0,
      y: 0,
    };

    const removeCanvas = () => {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };
    const removeBtn = document.getElementsByClassName('removeBtn')[0];
    removeBtn.addEventListener('click', removeCanvas, false);

    // helper that will update the current color
    const onColorUpdate = (e: any) => {
      let arr = e.target.style.MozBoxShadow.split(' ');
      current.color = arr[arr.length - 1];
    };

    // loop through the color elements and add the click event listeners
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }
    let drawing = false;

    // create the drawing

    const drawLine = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      color: string,
      emit: boolean
    ) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;

      socketRef.current.emit('drawing', {
        roomKey: props.roomKey,
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
      });
    };

    // mouse movement

    const onMouseDown = (e: any) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e: any) => {
      if (!drawing) {
        return;
      }
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e: any) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
    };

    // limit the number of events per second

    const throttle = (callback: any, delay: number) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    // add event listeners to our canvas

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    // make the canvas fill its parent component

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    // socket.io connection
    const onDrawingEvent = (data: any) => {
      const w = canvas.width;
      const h = canvas.height;
      drawLine(
        data.x0 * w,
        data.y0 * h,
        data.x1 * w,
        data.y1 * h,
        data.color,
        false
      );
    };

    socketRef.current = io(`${APPLICATION_BOARD_URL}`, {
      path: '/board/',
    });
    handleSocket(socketRef.current);
    socketRef.current.emit('joinRoom', props.roomKey);
    socketRef.current.on('drawing', onDrawingEvent);
  }, []);

  // pallete is go
  let [toggle, setToggle] = useState(false);
  const hadleToggle = () => {
    setToggle(!toggle);
    console.log(toggle);
  };

  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
    '#eeeeee',
  ];
  const circleSize = 35;
  const circleSpacing = 10;
  let [palleteWidth, setPalleteWidth] = useState(
    Math.ceil(
      (colors.length * (circleSize + circleSpacing)) / window.innerHeight
    ) *
      (circleSize + circleSpacing)
  );
  const updateWidth = () => {
    setPalleteWidth(
      Math.ceil(
        (colors.length * (circleSize + circleSpacing)) / window.innerHeight
      ) *
        (circleSize + circleSpacing)
    );
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidth, false);
  }, []);

  return (
    <ColorWrapper ref={colorsRef} className="colors">
      <canvas ref={canvasRef} className="whiteboard" />
      <PalleteWrapper>
        <CircleWrapper palleteWidth={palleteWidth} toggle={toggle}>
          <CirclePicker
            width="auto"
            colors={colors}
            circleSpacing={circleSpacing}
            circleSize={circleSize}
            className="color"
          />
        </CircleWrapper>
        <ColorLensIcon
          onClick={hadleToggle}
          className="palleteBtn"
          sx={{ fontSize: 40 }}
        />
        <DeleteForeverIcon
          // onClick={removeCanvas}
          className="palleteBtn removeBtn"
          sx={{ fontSize: 40 }}
        />
      </PalleteWrapper>
    </ColorWrapper>
  );
};

export default Board;

const ColorWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`;
const PalleteWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;
  height: 100%;
`;
const CircleWrapper = styled.div<{ toggle: boolean; palleteWidth: number }>`
  display: flex;
  height: 100%;
  width: ${(props) => (props.toggle ? '0%' : `${props.palleteWidth}px`)};
  overflow: hidden;
  transition: all 1s;
`;
