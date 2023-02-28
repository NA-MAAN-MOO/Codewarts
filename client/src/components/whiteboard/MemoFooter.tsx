import { useState, MouseEvent, ChangeEvent } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';

export default function MemoFooter(props: any) {
  const { id, participants } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [checked, setChecked] = useState<boolean>(true);

  /* Popover functions */
  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  /* Checkbox function */
  // TODO: 한 번 체크하면 다시 체크 해제 못하게 하기? 아니면 체크 상태에 따라 participant에 넣어줘야 함
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  /* Avatar function */
  function generateColor() {
    let color = '#';

    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    color += randomColor;

    return color;
  }

  function stringAvatar(name: string) {
    return {
      children: `${name[0]}${name[1]}`,
    };
  }

  return (
    <FooterWrapper>
      <AvatarGroup
        max={6}
        sx={{
          '&': { border: 'none' },
        }}
      >
        {participants.map((participant: any) => (
          <>
            <Avatar
              {...stringAvatar(`${participant.nickname}`)}
              sx={{
                fontSize: '1em',
                fontWeight: '700',
                // background: `${stringToColor()}`,
                '&': {
                  border: 'none',
                  background: `${generateColor()}`,
                },
              }}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            />
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: 'none',
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography sx={{ p: 1 }}>{participant.nickname}</Typography>
            </Popover>
          </>
        ))}
      </AvatarGroup>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        sx={{
          color: 'white',
          '&.Mui-checked': { color: 'darkred' },
          margin: '0 0 10px 10px',
        }}
      />
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  width: 90%;
  height: 20%;
  position: absolute;
  bottom: 0;
  display: flex;
  margin-left: 10px;
  justify-content: space-between;
  // border: 1px solid red;
`;
