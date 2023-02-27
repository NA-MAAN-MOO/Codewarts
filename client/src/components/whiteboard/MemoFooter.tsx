import { useState, MouseEvent, ChangeEvent } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';

export default function MemoFooter() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [checked, setChecked] = useState<boolean>(true);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  function stringToColor() {
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
        <Avatar
          {...stringAvatar('TODO: map 돌려서 사람 추가')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            // background: `${stringToColor()}`,
            '&': {
              border: 'none',
              background: `${stringToColor()}`,
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
          <Typography sx={{ p: 1 }}>TODO: 변수 추가하기</Typography>
        </Popover>
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
        <Avatar
          {...stringAvatar('ef')}
          sx={{
            fontSize: '1em',
            fontWeight: '700',
            background: `${stringToColor()}`,
          }}
        />
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
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
  display: flex;
  margin-left: 10px;
  // border: 1px solid red;
`;
