import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { debounce } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { useMemo, useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import Card from '@mui/material/Card';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import MemoFooter from './MemoFooter';

export default function Memo(props: any) {
  const { content, editMemo, deleteMemo } = props;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const trackPosition = (data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      defaultPosition={{ x: 80, y: 80 }}
      handle="#draggable-dialog-title"
      onDrag={(e, data) => trackPosition(data)}
    >
      <Card sx={{ width: '240px', minHeight: '240px', background: '#ffe552' }}>
        <CardContent>
          <DraggableRange id="draggable-dialog-title">
            <DragHandleIcon htmlColor="#ffffff" />
            <IconButton
              aria-label="delete"
              size="small"
              //   onClick={deleteMemo}
              color="secondary"
              sx={{ float: 'right', marginTop: '-5px' }}
            >
              <DeleteForeverIcon htmlColor="#ffffff" viewBox="0 0 25 25 " />
            </IconButton>
          </DraggableRange>
          <MemoContent
            // placeholder=""
            defaultValue={content}
            //   onChange={editMemo}
          />
        </CardContent>
        <MemoFooter />
      </Card>
    </Draggable>
  );
}

const DraggableRange = styled.div`
  width: 100%;
  height: 25px;
  //   border: 1px solid red;
`;

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
