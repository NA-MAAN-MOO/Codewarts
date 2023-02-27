import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CardContent, debounce, Typography } from '@mui/material';
import { useMemo, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import Card from '@mui/material/Card';
import styled from 'styled-components';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export default function Memo() {
  const memoContainer = useRef(null);

  return (
    <Draggable handle="#draggable-dialog-title">
      <Card sx={{ width: '240px', minHeight: '240px', background: '#ffe552' }}>
        <CardContent>
          <DraggableRange id="draggable-dialog-title">
            <DragHandleIcon htmlColor="#ffffff" />
            <DeleteForeverIcon
              htmlColor="#ffffff"
              viewBox="0 0 25 25 "
              sx={{ float: 'right' }}
              //   onClick={}
            />
          </DraggableRange>
          <MemoContent
          //   onChange={}
          />
        </CardContent>
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
