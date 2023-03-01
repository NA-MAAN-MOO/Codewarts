import React from 'react';
import Memo from './Memo';
import axios from 'axios';
import { useEffect, useState } from 'react';

function MemoDump(props: any) {
  //FIXME: 이걸 redux로 전역적으로 관리할 수 있게 바꿔야 할듯?
  const {
    memos,
    addMemo,
    getMemos,
    deleteMemo,
    updateMemo,
    changeMemoPos,
    currentUserNickname,
  } = props;

  const [maxZIndex, setmaxZIndex] = useState(0);

  return (
    <>
      {memos.length !== 0 ? (
        memos.map((memo: {}) => (
          <Memo
            memo={memo}
            getMemos={getMemos}
            deleteMemo={deleteMemo}
            updateMemo={updateMemo}
            changeMemoPos={changeMemoPos}
            currentUserNickname={currentUserNickname}
            maxZIndex={maxZIndex}
            setmaxZIndex={setmaxZIndex}
          />
        ))
      ) : (
        <></>
      )}
    </>
  );
}

export default React.memo(MemoDump);
