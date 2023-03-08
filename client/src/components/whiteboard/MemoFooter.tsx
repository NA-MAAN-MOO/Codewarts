import React from 'react';
import { useState, ChangeEvent, useCallback } from 'react';
import AvatarWithPopper from './AvatarWithPopper';
import AvatarGroup from '@mui/material/AvatarGroup';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';
import axios from 'axios';

const APPLICATION_DB_URL =
  process.env.REACT_APP_DB_URL || 'http://localhost:3003';

function MemoFooter(props: any) {
  const { _id, participants, getMemos, currentUserNickname } = props;

  const isChecked = participants.includes(currentUserNickname);
  const [checked, setChecked] = useState<boolean>(isChecked);

  /* Checkbox function */
  const participateIn = useCallback(() => {
    participants.push(currentUserNickname);
    try {
      axios.post(APPLICATION_DB_URL + `/participate-in-memo`, {
        _id: _id,
        participants: participants,
      });
      // getMemos();
    } catch (e) {
      console.error(e);
    }
  }, [participants]);

  const notParticipateIn = useCallback(() => {
    participants.filter(
      (participant: string) => participant !== currentUserNickname
    );
    try {
      axios.post(APPLICATION_DB_URL + '/participate-in-memo', {
        _id: _id,
        participants: participants,
      });
    } catch (e) {
      console.error(e);
    }
  }, [participants]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    // if (event.target.checked) {
    participateIn();
    // } else {
    //   notParticipateIn();
    // }
  };

  return (
    <>
      <FooterWrapper>
        <AvatarGroup
          max={6}
          sx={{
            paddingLeft: '10px',
            '&..MuiAvatarGroup-avatar': {
              border: 0,
            },
          }}
        >
          {participants.map((participant: string) => (
            <AvatarWithPopper participant={participant} key={participant} />
          ))}
        </AvatarGroup>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          sx={{
            // marginRight: '10px',
            color: 'white',
            '&.Mui-checked': { color: '#00c410' },
            margin: '0 0 10px 10px',
          }}
          disabled={isChecked ? true : false}
        />
      </FooterWrapper>
    </>
  );
}

const FooterWrapper = styled.div`
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
  display: flex;
  // margin-left: 10px;
  justify-content: space-between;
  // border: 1px solid red;
`;

const StyledAvatarGroup = styled(AvatarGroup)`
  border: none;
`;

export default React.memo(MemoFooter);
