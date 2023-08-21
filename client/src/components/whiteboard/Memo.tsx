//@ts-nocheck
import React from 'react';
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import Draggable from 'react-draggable';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import styled from 'styled-components';
import MemoFooter from './MemoFooter';
import { useSelector } from 'react-redux';
import { RootState } from 'stores';
import Image from '../../assets/images/memo_bg1.jpg';

function Memo(props: any) {
  const {
    memo,
    getMemos,
    updateMemo,
    deleteMemo,
    changeMemoPos,
    currentUserNickname,
    maxZIndex,
    setmaxZIndex,
  } = props;

  const [position, setPosition] = useState({
    x: memo.x * window.innerWidth * 0.6,
    y: memo.y * window.innerHeight,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [ownZIndex, setOwnZIndex] = useState(0);

  const isMine = currentUserNickname === memo.authorNickname;

  /* Track position of draggable memo */
  const onChangePosition = useCallback(
    (data: any) =>
      debounce(() => {
        setPosition({
          x: data.x,
          y: data.y,
        });
      }),
    [memo._id, setPosition]
  );

  /* When the content of memo changes, 
     it will be saved to DB automatically 
     every five seconds*/
  const onChangeContent = useMemo(
    () =>
      debounce((e) => {
        updateMemo(memo._id, e.target.value);
      }, 500),
    []
  );

  const onClickDelete = () => {
    deleteMemo(memo._id);
  };

  const bringToFront = () => {
    setIsDragging(true);
    setmaxZIndex((zIndex: number) => zIndex + 1);
  };

  const fixZIndex = () => {
    setOwnZIndex(maxZIndex);
  };

  return (
    <Draggable
      defaultPosition={position}
      bounds={{
        left: -window.innerWidth * 0.1,
        top: 0,
        right: window.innerWidth * 0.5,
        bottom: window.innerHeight * 0.9,
      }}
      onDrag={(e, data) => {
        onChangePosition(data);
      }}
      onStart={bringToFront}
      onStop={(e, data) => {
        setIsDragging(false);
        fixZIndex();
        changeMemoPos(
          memo._id,
          data.x / (window.innerWidth * 0.6),
          data.y / window.innerHeight
        );
      }}
    >
      <Card
        onMouseDown={bringToFront}
        sx={{
          width: '300px',
          minHeight: '240px',
          backgroundImage: `url(${Image})`,
          backgroundSize: '100% 100%',
          display: 'inline',
          position: 'absolute',
          zIndex: isDragging ? maxZIndex : ownZIndex,
        }}
      >
        <CardContent
          sx={{
            fontSize: '1.0em',
            color: 'gray',
            fontFamily: 'NeoDunggeunmoPro-Regular',
          }}
        >
          <span>
            [{memo.date}] &nbsp; {memo.authorNickname}
          </span>
          {isMine && (
            <IconButton
              aria-label="delete"
              size="small"
              color="secondary"
              sx={{ float: 'right', marginTop: '-5px' }}
              onClick={onClickDelete}
            >
              <DeleteForeverIcon htmlColor="#b52216" viewBox="0 0 20 20 " />
            </IconButton>
          )}
          {isMine ? (
            <MemoContent
              defaultValue={memo.content}
              onChange={onChangeContent}
            />
          ) : (
            <MemoContent defaultValue={memo.content} readOnly />
          )}
        </CardContent>
        <MemoFooter
          _id={memo._id}
          participants={memo.participants}
          getMemos={getMemos}
          currentUserNickname={currentUserNickname}
        />
      </Card>
    </Draggable>
  );
}

export default React.memo(Memo);

const MemoContent = styled.textarea`
  width: 100%;
  height: 180px;
  box-sizing: border-box;
  border: none;
  outline: none;
  resize: none;
  background: none;
  margin: 0;
  user-select: auto;
  padding: 5px;
  margin-bottom: 20px;
  font-family: 'Cascadia Code';
  font-size: 1.4em;
`;
