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

const memoColors = [
  '#ffe552',
  '#7fff7a',
  '#ffbfec',
  '#ffbfc8',
  '#ffbb6e',
  '#abe9ff',
  '#e9c4ff',
];

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

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [ownZIndex, setOwnZIndex] = useState(maxZIndex);

  const isMine = currentUserNickname === memo.authorNickname;

  useEffect(() => {
    let randNum = Math.floor(Math.random() * memoColors.length);
    setColor(memoColors[randNum]);
  }, []);

  /* Track position of draggable memo */
  const onChangePosition = useCallback(
    (data: any) =>
      debounce(() => {
        setPosition({ x: data.x, y: data.y });
      }),
    [memo._id, setPosition]
  );

  /* When the content of memo changes, 
     it will be saved to DB automatically 
     every five seconds*/
  const onChangeContent = useMemo(
    () =>
      debounce((e) => {
        // FIXME: 나만 바꿀 수 있게
        updateMemo(memo._id, e.target.value);
      }, 500),
    []
  );

  /* observer? */
  //   const onChangeSize = useMemo(
  //     () =>
  //       debounce((entry) => {
  //         const { width, height } = entry[0].contentRect;
  //         setMemoSize(item.id, width, height);
  //       }, 100),
  //     [item.id, setMemoSize]
  //   );

  const onClickDelete = () => {
    // console.log('온클릭딜리트');
    deleteMemo(memo._id);
  };

  const bringToFront = () => {
    // console.log('찍힘');
    // let tempZIndex = maxZindex + 1;
    setIsDragging(true);
    setmaxZIndex(maxZIndex + 1);
  };

  const fixZIndex = () => {
    setOwnZIndex(maxZIndex);
  };

  return (
    <Draggable
      handle="#draggable-div"
      defaultPosition={{ x: memo.x, y: memo.y }}
      bounds={{
        left: -window.innerWidth * 0.1,
        top: 0,
        right: window.innerWidth * 0.5,
        bottom: window.innerHeight * 0.9,
      }}
      onDrag={(e, data) => {
        // e.stopPropagation();
        onChangePosition(data);
      }}
      onMouseDown={bringToFront}
      onStart={bringToFront}
      onStop={(e, data) => {
        setIsDragging(false);
        fixZIndex();
        changeMemoPos(memo._id, data.x, data.y);
      }}
    >
      <Card
        sx={{
          width: '300px',
          minHeight: '240px',
          background: color,
          display: 'inline',
          position: 'absolute',
          zIndex: isDragging ? maxZIndex : ownZIndex,
        }}
      >
        <CardContent sx={{ fontSize: '0.9em', color: 'gray' }}>
          <div id="draggable-div" style={{ height: '30px' }}>
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
                <DeleteForeverIcon htmlColor="#ffffff" viewBox="0 0 25 25 " />
              </IconButton>
            )}
          </div>
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
  font-family: 'Noto Sans KR';
  font-size: 1.1em;
`;

// const MemoWrapper = styled.div`
//   display: inline;
// `;
