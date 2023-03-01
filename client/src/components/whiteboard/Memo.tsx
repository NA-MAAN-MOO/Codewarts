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
  } = props;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState('');
  const [zIndex, setZIndex] = useState(0);

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
    setZIndex(10);
  };

  return (
    <Draggable
      defaultPosition={{ x: memo.x, y: memo.y }}
      bounds=""
      onDrag={(e, data) => {
        // e.stopPropagation();
        onChangePosition(data);
        changeMemoPos(memo._id, data.x, data.y);
      }}
      onMouseDown={bringToFront}
    >
      <Card
        sx={{
          width: '240px',
          minHeight: '240px',
          background: color,
          display: 'inline',
          position: 'relative',
          zIndex: zIndex,
        }}
      >
        <CardContent>
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
          {isMine ? (
            <MemoContent
              defaultValue={memo.content}
              onChange={onChangeContent}
            />
          ) : (
            <MemoContent defaultValue={memo.content} disabled />
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
  height: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  resize: none;
  background: none;
  margin: 0;
  user-select: auto;
  padding: 10px;
  font-family: 'Noto Sans KR';
`;

// const MemoWrapper = styled.div`
//   display: inline;
// `;
