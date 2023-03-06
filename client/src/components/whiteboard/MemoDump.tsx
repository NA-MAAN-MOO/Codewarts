import React from 'react';
import Memo from './Memo';
import axios from 'axios';
import { useEffect, useState } from 'react';

function MemoDump(props: any) {
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
        memos.map((memo: any) => (
          <Memo
            key={memo._id}
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
