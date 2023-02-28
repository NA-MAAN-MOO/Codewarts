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

export default function Memo(props: any) {
  const { item, editMemo, deleteMemo, setMemoSize } = props;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  /* Track position of draggable memo */
  const onChangePosition = useCallback(
    (data: any) => setPosition({ x: data.x, y: data.y }),
    [item.id, setPosition]
  );

  /* When the content of memo changes, 
     it will be saved to DB automatically 
     every five seconds*/
  const onChangeContent = useMemo(
    () =>
      debounce((e) => {
        console.log('실질적으로 edit하는 함수 추가.. 바뀐 내용은 아래');
        editMemo();
        console.log(e.target.value);
      }, 500),
    []
  );

  /* observer? */
  const onChangeSize = useMemo(
    () =>
      debounce((entry) => {
        const { width, height } = entry[0].contentRect;
        setMemoSize(item.id, width, height);
      }, 100),
    [item.id, setMemoSize]
  );

  const onClickDelete = useCallback(
    () => deleteMemo(item.id),
    [item.id, deleteMemo]
  );

  return (
    <Draggable
      defaultPosition={{ x: 80, y: 80 }}
      handle="#draggable-dialog-title"
      onDrag={(e, data) => onChangePosition(data)}
    >
      <Card sx={{ width: '240px', minHeight: '240px', background: '#ffe552' }}>
        <CardContent>
          <DraggableRange id="draggable-dialog-title">
            <DragHandleIcon htmlColor="#ffffff" />
            <IconButton
              aria-label="delete"
              size="small"
              onClick={onClickDelete}
              color="secondary"
              sx={{ float: 'right', marginTop: '-5px' }}
            >
              <DeleteForeverIcon htmlColor="#ffffff" viewBox="0 0 25 25 " />
            </IconButton>
          </DraggableRange>
          <MemoContent defaultValue={item.content} onChange={onChangeContent} />
        </CardContent>
        <MemoFooter id={item.id} participants={item.participants} />
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
